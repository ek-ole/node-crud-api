import { spawn } from 'child_process';
import { createServer, request } from 'http';
import { createConnection } from 'net';

const workerPorts = [4001, 4002, 4003];
const PORT = 4000;

function waitForPort(port: number, timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function tryConnect() {
      const socket = createConnection(port, 'localhost');

      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });

      socket.on('error', () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for port ${port}`));
        } else {
          setTimeout(tryConnect, 100);
        }
      });
    }

    tryConnect();
  });
}

const workers = workerPorts.map((port) => {
  const worker = spawn('node', ['dist/server.js'], {
    env: { ...process.env, WORKER_PORT: port.toString() },
  });

  worker.stdout.on('data', (data) => {
    console.log(`Worker ${port}: ${data}`);
  });

  console.log(`Starting worker on port ${port}`);
  return waitForPort(port);
});

Promise.all(workers).then(() => {
  console.log('All workers are ready!');

  let currentWorker = 0;
  const balancer = createServer((req, res) => {
    const workerPort = workerPorts[currentWorker];
    currentWorker = (currentWorker + 1) % workerPorts.length;

    const proxyReq = request(
      {
        port: workerPort,
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
    console.log(`Load balancer running on port ${PORT}`);
  });
});