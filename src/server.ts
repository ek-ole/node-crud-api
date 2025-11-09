import http from 'http';
import dotenv from 'dotenv';

interface User {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

let users: User[] = [];

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  if (request.url === '/api/users' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(users));
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Endpoint not found' }));
  }  
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
