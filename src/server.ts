import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  if (request.url === '/api/users' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Get all users'}));
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Endpoint not found' }));
  }  
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
