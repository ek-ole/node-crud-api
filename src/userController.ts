import { IncomingMessage, ServerResponse } from "http";
import { User, users } from "./user";
import { getUserIdFromUrl, parseRequestBody, UserInput } from "./utils/request";
import { sendResponse } from "./utils/response";

export async function handleUsersRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const userId = getUserIdFromUrl(request.url);

  try {
    switch (request.method) {
      case 'GET':
        if (userId) {
          const user = users.find((u) => u.id === userId);
          if (!user) {
            return sendResponse(response, 404, { error: 'User not found' });
          }
          sendResponse(response, 200, user);
        } else {
          sendResponse(response, 200, users);
        }
        break;

      case 'POST':
        const newUserData: UserInput = await parseRequestBody(request);
        const { username, age, hobbies } = newUserData;

        if (!username || !age || !hobbies) {
          return sendResponse(response, 400, {
            error: 'Missing required fields',
          });
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          age,
          hobbies,
        };

        users.push(newUser);
        sendResponse(response, 201, newUser);
        break;

      default:
        sendResponse(response, 404, { error: 'Endpoint not found' });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    sendResponse(response, 400, { error: errorMessage });
  }
}
