package repository

import (
	"pantog/database"
	"pantog/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		DB: database.DB,
	}
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var result models.User

	err := r.DB.Where("email = ?", email).First(&result).Error
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (r *UserRepository) Register(user *models.User) error {
	if err := r.DB.Create(user).Error; err != nil {
		return err
	}
	return nil
}
