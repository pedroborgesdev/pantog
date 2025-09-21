package database

import (
	"fmt"

	"pantog/config"
	"pantog/logger"
	"pantog/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {
	host := config.AppConfig.DBHost
	port := config.AppConfig.DBPort
	user := config.AppConfig.DBUser
	password := config.AppConfig.DBPwd
	dbname := config.AppConfig.DBName
	sslmode := config.AppConfig.DBSSLMode

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		logger.Log("ERROR", "Failed to connect to database", []logger.LogDetail{
			{Key: "Error", Value: err.Error()},
		})
	}

	sqlDB, err := db.DB()
	if err != nil {
		logger.Log("ERROR", "Failed to get database instance", []logger.LogDetail{
			{Key: "Error", Value: err.Error()},
		})
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	err = runMigrations(db)
	if err != nil {
		logger.Log("ERROR", "Failed to migrate database", []logger.LogDetail{
			{Key: "Error", Value: err.Error()},
		})
		return fmt.Errorf(err.Error())
	}

	DB = db

	logger.Log("INFO", "Connected to database successfully", []logger.LogDetail{})
	return nil
}

func runMigrations(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.User{},
		&models.Url{},
		&models.VisitRegionCount{},
		&models.VisitPlatformCount{},
		&models.VisitBrowserCount{},
	)

	if err != nil {
		return err
	}

	return nil
}
