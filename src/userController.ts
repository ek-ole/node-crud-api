import { IncomingMessage, ServerResponse } from 'http';
import { createUser, User, users } from './user';
import { getUserIdFromUrl, isValidUUID, parseRequestBody, UserInput } from './utils/request';
import { sendResponse } from './utils/response';

export async function handleUsersRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const userId = getUserIdFromUrl(request.url);

  try {
    switch (request.method) {
      case 'GET':
        if (userId) {
          if (!isValidUUID(userId)) {
            return sendResponse(response, 400, { error: 'Invalid user ID'})
          }
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

        const newUser = createUser(username, age, hobbies);

        users.push(newUser);
        sendResponse(response, 201, newUser);
        break;

      case 'PUT':
        if (!userId) {
          return sendResponse(response, 400, { error: 'User ID is required' });
        }

        if (!isValidUUID(userId)) {
          return sendResponse(response, 400, { error: 'Invalid user ID' });
        }

        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
          return sendResponse(response, 404, { error: 'User not found' });
        }

        const updateData: UserInput = await parseRequestBody(request);
        const {
          username: newUsername,
          age: newAge,
          hobbies: newHobbies,
        } = updateData;

        if (!newUsername || !newAge || !newHobbies) {
          return sendResponse(response, 400, {
            error: 'Missing required fields',
          });
        }

        users[userIndex] = {
          ...users[userIndex],
          username: newUsername,
          age: newAge,
          hobbies: newHobbies,
        };

        sendResponse(response, 200, users[userIndex]);
        break;

        case 'DELETE':
          if (!userId) {
            return sendResponse(response, 400, { error: 'User ID is required' });
          }

          if (!isValidUUID(userId)) {
            return sendResponse(response, 400, { error: 'Invalid user ID' });
          }

          const deleteIndex = users.findIndex(u => u.id === userId);
          if (deleteIndex === -1) {
            return sendResponse(response, 404, {error: 'User not find'})
          }

          users.splice(deleteIndex, 1);
          sendResponse(response, 204, {});
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
