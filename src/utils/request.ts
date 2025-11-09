import { IncomingMessage } from 'http';

export interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export function getUserIdFromUrl(url: string = ''): string | null {
  const parts = url.split('/');
  if (parts.length === 4 && parts[1] === 'api' && parts[2] ==='users') {
    return parts[3];
  }
  return null;
}

export function parseRequestBody(request: IncomingMessage): Promise<UserInput> {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch {
        reject(new Error('Invalid JSON'));
      }

      request.on('error', reject);

        // if (!username || !age || !hobbies) {
        //   response.writeHead(400, { 'Content-Type': 'application/json' });
        //   return response.end(JSON.stringify({ error: 'Missing required fields' }));
        // }

        // const newUser: User = {
        //   id: Math.random().toString(36).substr(2, 9),
        //   username,
        //   age,
        //   hobbies,
        // };

  })
})}
