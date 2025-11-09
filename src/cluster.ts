import cluster from 'cluster';
import { availableParallelism } from 'os';
import { createServer, request } from 'http';
import { sharedDB } from './db';
import { createUser } from './user';

interface DBCommand {
  type: 'GET_ALL' | 'GET_BY_ID' | 'CREATE' | 'UPDATE' | 'DELETE';
  data?: any;
}

interface IPCRequest {
  requestId: string;
  command: DBCommand;
}

interface IPCResponse {
  requestId: string;
  result: any;
}

const numCPUs = availableParallelism();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const workers: Array<{ port: number; worker: cluster.Worker }> = [];
  let workerIndex = 0;

  for (let i = 0; i < numCPUs - 1; i++) {
    const workerPort = PORT + i + 1;
    const worker = cluster.fork();
    workers.push({ port: workerPort, worker });

    worker.send({ port: workerPort });
  }

  cluster.on('message', (worker, message: IPCRequest) => {
    try {
      let result: any;

      switch (message.command.type) {
        case 'GET_ALL':
          result = sharedDB.getAllUsers();
          break;
        case 'GET_BY_ID':
          result = sharedDB.getUserById(message.command.data);
          break;
        case 'CREATE':
          const newUser = createUser(
            message.command.data.username,
            message.command.data.age,
            message.command.data.hobbies,
          );
          result = sharedDB.createUser(newUser);
          break;
        case 'UPDATE':
          result = sharedDB.updateUser(
            message.command.data.id,
            message.command.data,
          );
          break;
        case 'DELETE':
          result = sharedDB.deleteUser(message.command.data);
          break;
      }

      worker.send({ requestId: message.requestId, result });
    } catch (error) {
      worker.send({ requestId: message.requestId, result: null });
    }
  });

  const balancer = createServer((req, res) => {
    const worker = workers[workerIndex];
    workerIndex = (workerIndex + 1) % workers.length;

    const proxyReq = request(
      {
        hostname: 'localhost',
        port: worker.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );

    req.pipe(proxyReq);
    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  });

  balancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });
} else {
  let workerPort = PORT;

  process.on('message', (message: { port: number }) => {
    workerPort = message.port;

    import('./server.js').then(({ server }) => {
      server.listen(workerPort, () => {
        console.log(`Worker ${process.pid} started on port ${workerPort}`);
      });
    });
  });
}
