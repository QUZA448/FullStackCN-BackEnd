# Forum Backend - Stack Overflow-lite

A complete RESTful API backend for a Q&A forum platform built with Express.js, PostgreSQL, and JWT authentication.

## Features

✅ User Authentication (Registration, Login, JWT)  
✅ Question Management (CRUD operations)  
✅ Answer Management (Create, Edit, Mark Best)  
✅ Voting System (Upvote/Downvote questions & answers)  
✅ Reputation System (Karma points based on votes)  
✅ Tag System (Categorize questions with tags)  
✅ User Profiles (View user activity and reputation)  
✅ Search & Filter (Search questions, filter by tags)  
✅ Pagination (All list endpoints support pagination)  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Bcryptjs

## Project Structure

```
forum-backend/
├── config/              # Configuration files
│   ├── database.js     # Database configuration
│   └── sequelize.js    # Sequelize setup
├── controllers/         # Business logic
│   ├── authController.js
│   ├── questionController.js
│   ├── answerController.js
│   ├── voteController.js
│   ├── userController.js
│   └── tagController.js
├── models/             # Database models
│   ├── User.js
│   ├── Question.js
│   ├── Answer.js
│   ├── Vote.js
│   ├── Tag.js
│   ├── QuestionTag.js
│   └── index.js       # Model associations
├── routes/            # API routes
│   ├── auth.js
│   ├── questions.js
│   ├── answers.js
│   ├── votes.js
│   ├── users.js
│   └── tags.js
├── middlewares/       # Express middlewares
│   ├── authMiddleware.js
│   └── errorHandler.js
├── server.js          # Main application file
├── package.json       # Dependencies
├── .env               # Environment variables
└── .gitignore        # Git ignore rules
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Steps

1. **Clone or extract the project**
   ```bash
   cd forum-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=forum_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE forum_db;
   ```

5. **Start the server**
   ```bash
   # Development (with nodemon)
   npm run dev
   
   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { username, email, password }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### Question Endpoints

#### Get All Questions
```
GET /api/questions?page=1&limit=10&search=javascript&tag=nodejs
Response: { data: [...], pagination: {...} }
```

#### Get Single Question
```
GET /api/questions/:id
Response: { id, title, description, answers: [...], tags: [...] }
```

#### Create Question
```
POST /api/questions
Headers: Authorization: Bearer <token>
Body: { title, description, tags: [] }
```

#### Update Question
```
PUT /api/questions/:id
Headers: Authorization: Bearer <token>
Body: { title, description, tags: [] }
```

#### Delete Question
```
DELETE /api/questions/:id
Headers: Authorization: Bearer <token>
```

### Answer Endpoints

#### Create Answer
```
POST /api/questions/:questionId/answers
Headers: Authorization: Bearer <token>
Body: { content }
```

#### Update Answer
```
PUT /api/answers/:id
Headers: Authorization: Bearer <token>
Body: { content }
```

#### Delete Answer
```
DELETE /api/answers/:id
Headers: Authorization: Bearer <token>
```

#### Mark Best Answer
```
PATCH /api/answers/:id/mark-best
Headers: Authorization: Bearer <token>
```

### Vote Endpoints

#### Vote on Content
```
POST /api/votes
Headers: Authorization: Bearer <token>
Body: { targetId, targetType: "question|answer", voteType: "upvote|downvote" }
```

#### Get User's Vote
```
GET /api/votes?targetId=xxx&targetType=question
Headers: Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```
GET /api/users/:id
Response: { id, username, email, reputation, questionCount, answerCount }
```

#### Update User Profile
```
PUT /api/users/:id
Headers: Authorization: Bearer <token>
Body: { bio, avatar }
```

#### Get User's Questions
```
GET /api/users/:id/questions?page=1&limit=10
```

#### Get User's Answers
```
GET /api/users/:id/answers?page=1&limit=10
```

#### Get Top Users
```
GET /api/users/top?limit=10
```

### Tag Endpoints

#### Get All Tags
```
GET /api/tags?page=1&limit=20
```

#### Get Questions by Tag
```
GET /api/tags/:name/questions?page=1&limit=10
```

#### Create Tag (Admin)
```
POST /api/tags
Body: { name, description }
```

#### Update Tag (Admin)
```
PUT /api/tags/:id
Body: { description }
```

## Reputation System

- **Upvote on your answer**: +5 reputation
- **Downvote on your answer**: -2 reputation
- **Question marked as best**: +15 reputation

## Database Schema

### Users Table
- id (UUID, PK)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- reputation (Integer, Default: 0)
- bio (Text, Optional)
- avatar (String, Optional)
- createdAt, updatedAt

### Questions Table
- id (UUID, PK)
- userId (UUID, FK)
- title (String)
- description (Text)
- viewCount (Integer)
- upvotes (Integer)
- downvotes (Integer)
- createdAt, updatedAt

### Answers Table
- id (UUID, PK)
- questionId (UUID, FK)
- userId (UUID, FK)
- content (Text)
- isMarkedBest (Boolean)
- upvotes (Integer)
- downvotes (Integer)
- createdAt, updatedAt

### Votes Table
- id (UUID, PK)
- userId (UUID, FK)
- targetId (UUID)
- targetType (Enum: question, answer)
- voteType (Enum: upvote, downvote)
- createdAt

### Tags Table
- id (UUID, PK)
- name (String, Unique)
- description (Text, Optional)
- createdAt, updatedAt

### QuestionTag Table (M:N Junction)
- id (UUID, PK)
- questionId (UUID, FK)
- tagId (UUID, FK)

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (Duplicate resource)
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error description",
  "errors": [{ "field": "fieldName", "message": "error message" }]
}
```

## Testing the API

You can test the API using:
- **Postman**: Import the endpoints into Postman collections
- **cURL**: Use curl commands
- **Insomnia**: Similar to Postman
- **Thunder Client**: VS Code extension

Example with cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'

# Create Question (with token)
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"How to learn JavaScript?","description":"I want to start learning JavaScript...","tags":["javascript","web"]}'
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Question comments
- [ ] User notifications
- [ ] Badges/Achievements system
- [ ] Content moderation
- [ ] Rate limiting
- [ ] Caching with Redis
- [ ] Search optimization (Elasticsearch)
- [ ] File upload for images/attachments

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
