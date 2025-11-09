package handlers

import (
	"seven_hives_backend/internal/models"
	"seven_hives_backend/internal/repository"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HiveHandler struct {
	hiveRepo *repository.HiveRepository
}

func NewHiveHandler(hiveRepo *repository.HiveRepository) *HiveHandler {
	return &HiveHandler{
		hiveRepo: hiveRepo,
	}
}

func (h *HiveHandler) CreateHive(c *fiber.Ctx) error {
	var hive models.Hive
	if err := c.BodyParser(&hive); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.hiveRepo.Create(&hive); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create hive",
		})
	}

	return c.Status(201).JSON(hive)
}

func (h *HiveHandler) GetHive(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid hive ID",
		})
	}

	hive, err := h.hiveRepo.GetByID(objectID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Hive not found",
		})
	}

	return c.JSON(hive)
}

func (h *HiveHandler) GetUserHives(c *fiber.Ctx) error {
	ownerID := c.Params("ownerID")
	objectID, err := primitive.ObjectIDFromHex(ownerID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid owner ID",
		})
	}

	hives, err := h.hiveRepo.GetByOwnerID(objectID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch hives",
		})
	}

	return c.JSON(hives)
}

func (h *HiveHandler) UpdateHive(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid hive ID",
		})
	}

	var hive models.Hive
	if err := c.BodyParser(&hive); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if err := h.hiveRepo.Update(objectID, &hive); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update hive",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Hive updated successfully",
	})
}

func (h *HiveHandler) DeleteHive(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid hive ID",
		})
	}

	if err := h.hiveRepo.Delete(objectID); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to delete hive",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Hive deleted successfully",
	})
}
