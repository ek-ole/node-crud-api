import { createServer, request } from 'http';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const workerPorts = [4001, 4002, 4003];
let currentWorker = 0;

const balancer = createServer((clientReq, clientRes) => {
  const workerPort = workerPorts[currentWorker];
  currentWorker = (currentWorker + 1) % workerPorts.length;

  console.log(`Routing to worker ${workerPort}`);

  const proxy = request(
    {
      port: workerPort,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    },
    (workerRes) => {
      clientRes.writeHead(workerRes.statusCode!, workerRes.headers);
      workerRes.pipe(clientRes);
    },
  );

  clientReq.pipe(proxy);
  proxy.on('error', () => {
    clientRes.writeHead(502);
    clientRes.end('Bad Gateway');
  });
});

balancer.listen(PORT, () => {
  console.log(`Load balancer on port ${PORT}`);
});
