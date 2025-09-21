package main

import (
	"pantog/cache"
	"pantog/config"
	"pantog/database"
	"pantog/debug"
	"pantog/logger"
	"pantog/routes"
	"pantog/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	debug.LoadDebugConfig()

	logger.Log("INFO", "Application has been started", []logger.LogDetail{
		{Key: "message", Value: "success"},
	})

	config.LoadAppConfig()

	err := database.InitDB()
	if err != nil {
		logger.Log("ERROR", "Cannot connect to database", []logger.LogDetail{
			{Key: "error", Value: err.Error()},
		})
	}

	cache.InitRedis()

	router := gin.Default()

	// router.Use(
	// // middlewares.CORSMiddleware(),
	// // middlewares.MemoryBenchmarkMiddleware(),
	// )

	workers.NewUrlWorker()
	workers.NewClientWorker(&gin.Context{})

	routes.SetupRoutes(router)

	logger.Log("INFO", "Api has been stared", []logger.LogDetail{
		{Key: "message", Value: "success"},
	})

	router.Run(":" + config.AppConfig.HTTPPort)
}
