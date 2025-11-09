import http from 'http';
import dotenv from 'dotenv';
import { handleUsersRequest } from './userController';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  try {
    if (request.url?.startsWith('/api/users')) {
    handleUsersRequest(request, response);
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
} catch (error) {
  console.error('Server error:', error);
  response.writeHead(500, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Internal server error' }));
}
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
