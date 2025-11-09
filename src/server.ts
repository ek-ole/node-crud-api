import http, { request } from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
