package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"

	"pantog/logger"
)

type Config struct {
	HTTPPort string
	URL      string

	DBHost    string
	DBPort    string
	DBUser    string
	DBName    string
	DBPwd     string
	DBSSLMode string

	UrlRemoveAfter    int
	UrlWorkerLooptime int
}

var AppConfig Config

func LoadAppConfig() error {

	err := godotenv.Load()
	if err != nil {
		logger.Log("DEBUG", "Error on read .env file", []logger.LogDetail{
			{Key: "Error", Value: err.Error()},
		})
	}

	AppConfig = Config{
		HTTPPort: getEnvStr("HTTPPort", "8080"),
		URL:      getEnvStr("URL", "http://186.195.216.145:8080"),

		DBHost:    getEnvStr("DBHost", "postgres"),
		DBPort:    getEnvStr("DBPort", "5432"),
		DBUser:    getEnvStr("DBUser", "postgres"),
		DBName:    getEnvStr("DBName", "pantog"),
		DBPwd:     getEnvStr("DBPwd", "postgres"),
		DBSSLMode: getEnvStr("DBSSLMode", "disable"),

		UrlRemoveAfter:    getEnvInt("UrlRemoveAfetr", 1),
		UrlWorkerLooptime: getEnvInt("UrlWorkerLooptime", 30),
	}

	logger.Log("ENV", "Defined environment variables", []logger.LogDetail{
		{Key: "HTTPPort", Value: AppConfig.HTTPPort},
		{Key: "URL", Value: AppConfig.URL},
		{Key: "DBHost", Value: AppConfig.DBHost},
		{Key: "DBPort", Value: AppConfig.DBPort},
		{Key: "DBUser", Value: AppConfig.DBUser},
		{Key: "DBName", Value: AppConfig.DBName},
		{Key: "DBPwd", Value: AppConfig.DBPwd},
		{Key: "DBSSLMode", Value: AppConfig.DBSSLMode},
		{Key: "UrlRemoveAfter", Value: AppConfig.UrlRemoveAfter},
	})
	return nil
}

func getEnvStr(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	intValue, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return intValue
}
