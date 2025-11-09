import { ServerResponse } from "http";

export function sendResponse(response: ServerResponse, statusCode: number, data: object) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}