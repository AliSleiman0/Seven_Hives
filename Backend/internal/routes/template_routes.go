package routes

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupTemplateRoutes(app *fiber.App, db *mongo.Database) {
	// Template/Static routes for frontend
	templates := app.Group("/templates")

	// Static template serving for HTMX fragments
	templates.Static("/", "./Informative/templates")

	// API routes for contact form and other frontend interactions
	api := app.Group("/api")

	// Contact form endpoint
	api.Post("/contact", func(c *fiber.Ctx) error {
		// TODO: Implement contact form handler
		return c.JSON(fiber.Map{
			"message": "Contact form submitted successfully",
			"status":  "success",
		})
	})

	// Newsletter subscription
	api.Post("/newsletter", func(c *fiber.Ctx) error {
		// TODO: Implement newsletter subscription
		return c.JSON(fiber.Map{
			"message": "Newsletter subscription successful",
			"status":  "success",
		})
	})

	// Demo request
	api.Post("/demo", func(c *fiber.Ctx) error {
		// TODO: Implement demo request handler
		return c.JSON(fiber.Map{
			"message": "Demo request submitted",
			"status":  "success",
		})
	})
}
