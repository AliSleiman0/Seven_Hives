package routes

import (
	"seven_hives_backend/internal/handlers"
	"seven_hives_backend/internal/repository"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupUserRoutes(app *fiber.App, db *mongo.Database) {
	// Initialize repository and handler
	userRepo := repository.NewUserRepository(db)
	userHandler := handlers.NewUserHandler(userRepo)

	// User routes group
	users := app.Group("/api/v1/users")

	// User CRUD operations
	users.Post("/", userHandler.CreateUser)      // POST /api/v1/users
	users.Get("/:id", userHandler.GetUser)       // GET /api/v1/users/:id
	users.Put("/:id", userHandler.UpdateUser)    // PUT /api/v1/users/:id
	users.Delete("/:id", userHandler.DeleteUser) // DELETE /api/v1/users/:id
}
