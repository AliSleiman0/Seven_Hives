# Seven Hives Backend

A Go backend application using Fiber and MongoDB for the Seven Hives project.

## Project Structure

```
Backend/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── handlers/              # HTTP handlers
│   │   ├── user_handler.go
│   │   └── hive_handler.go
│   ├── models/               # Data models
│   │   └── models.go
│   ├── repository/           # Database operations
│   │   ├── user_repository.go
│   │   └── hive_repository.go
│   └── routes/              # Route definitions
│       └── routes.go
├── pkg/
│   ├── config/              # Configuration
│   │   └── config.go
│   └── database/            # Database connection
│       └── mongodb.go
├── .env                     # Environment variables
└── go.mod                   # Go module definition
```

## Setup Instructions

1. **Initialize the Go module and install dependencies:**
   ```powershell
   cd Backend
   go mod tidy
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in the `.env` file

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` (if exists)
   - Update the values in `.env` file

4. **Run the application:**
   ```powershell
   go run cmd/main.go
   ```

## API Endpoints

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Hives
- `POST /api/v1/hives` - Create a new hive
- `GET /api/v1/hives/:id` - Get hive by ID
- `PUT /api/v1/hives/:id` - Update hive
- `DELETE /api/v1/hives/:id` - Delete hive
- `GET /api/v1/hives/owner/:ownerID` - Get hives by owner ID

### Health Check
- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 8080)
- `MONGODB_URI` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `JWT_SECRET` - JWT secret key

## Technologies Used

- **Go** - Programming language
- **Fiber** - Web framework
- **MongoDB** - Database
- **MongoDB Go Driver** - Database driver