package routes

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// SetupRoutes initializes all route groups
func SetupRoutes(app *fiber.App, db *mongo.Database) {
	// Setup individual route groups
	SetupUserRoutes(app, db)
	
	SetupAuthRoutes(app, db)
	SetupAdminRoutes(app, db)
	SetupTemplateRoutes(app, db)

	// Setup additional routes
	setupHealthRoutes(app)
	setupCORSRoutes(app)
}

// setupHealthRoutes sets up health check and system status routes
func setupHealthRoutes(app *fiber.App) {
	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Seven Hives API is running",
			"version": "1.0.0",
		})
	})

	// API status endpoint
	app.Get("/api/status", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"api_status": "operational",
			"database":   "connected",
			"timestamp":  "2025-11-08T00:00:00Z",
		})
	})

	// Root endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Seven Hives API",
			"version": "1.0.0",
			"status":  "running",
			"endpoints": []string{
				"/health",
				"/api/v1/users",
				"/api/v1/hives",
				"/api/v1/posts",
				"/api/v1/auth",
				"/api/v1/admin",
				"/templates",
			},
		})
	})
}

// setupCORSRoutes sets up CORS preflight handling
func setupCORSRoutes(app *fiber.App) {
	// Handle preflight requests
	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNoContent)
	})
}
