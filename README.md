# CRUD API

Simple CRUD API for user management built with Node.js and TypeScript.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
2. Configure port in `.env` (default: 4000)

## Available Scripts

- `npm run start:dev` - development mode with hot reload
- `npm run start:prod` - production mode
- `npm run start:multi` - multi mode
- `npm run build` - build project
- `npm run lint` - run linter
- `npm run lint:fix` - fix linting issues

## API Endpoints

- `GET /api/users` - get all users
- `GET /api/users/{id}` - get user by ID
- `POST /api/users` - create new user
- `PUT /api/users/{id}` - update user
- `DELETE /api/users/{id}` - delete user

## User Object

```typescript
{
  id: string,           // UUID
  username: string,     // required
  age: number,         // required
  hobbies: string[]    // required, can be empty array
}
```
