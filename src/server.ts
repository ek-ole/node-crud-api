import http from 'http';
import dotenv from 'dotenv';

interface User {
  id: string;
  username: string;
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
  } else if (request.url === '/api/users' && request.method === 'POST') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        const {username, age, hobbies} = JSON.parse(body);

        if (!username || !age || !hobbies) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          return response.end(JSON.stringify({ error: 'Missing required fields' }));
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          age,
          hobbies,
        };

        users.push(newUser);
        
        response.writeHead(201, { 'Content-Type': 'application/json' });
         response.end(JSON.stringify(newUser));
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });    
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
