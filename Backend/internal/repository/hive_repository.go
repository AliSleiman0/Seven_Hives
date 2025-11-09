package repository

import (
	"context"
	"seven_hives_backend/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type HiveRepository struct {
	collection *mongo.Collection
}

func NewHiveRepository(db *mongo.Database) *HiveRepository {
	return &HiveRepository{
		collection: db.Collection("hives"),
	}
}

func (r *HiveRepository) Create(hive *models.Hive) error {
	hive.CreatedAt = time.Now()
	hive.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(context.Background(), hive)
	if err != nil {
		return err
	}

	hive.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *HiveRepository) GetByID(id primitive.ObjectID) (*models.Hive, error) {
	var hive models.Hive
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&hive)
	if err != nil {
		return nil, err
	}
	return &hive, nil
}

func (r *HiveRepository) GetByOwnerID(ownerID primitive.ObjectID) ([]models.Hive, error) {
	cursor, err := r.collection.Find(context.Background(), bson.M{"owner_id": ownerID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var hives []models.Hive
	err = cursor.All(context.Background(), &hives)
	return hives, err
}

func (r *HiveRepository) Update(id primitive.ObjectID, hive *models.Hive) error {
	hive.UpdatedAt = time.Now()

	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": hive},
	)
	return err
}

func (r *HiveRepository) Delete(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
