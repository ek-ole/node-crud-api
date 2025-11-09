import { IncomingMessage } from 'http';
import { validate as uuidValidate } from 'uuid';

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
  })
})}

export function isValidUUID(id:string): boolean {
  return uuidValidate(id);
}
