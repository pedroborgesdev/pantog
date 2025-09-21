package routes

import (
	"net/http"
	"pantog/controllers"
	"pantog/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

	urlController := controllers.NewUrlController()
	userController := controllers.NewUserController()

	router.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	api := router.Group("/")
	// api.Use(
	// 	middlewares.RateLimiter(middlewares.RateLimiterConfig{
	// 		RequestLimit:     50,
	// 		WindowMinutes:    60,
	// 		WarningThreshold: 3,
	// 		BlockTimeout:     5,
	// 	}),
	// )
	{
		api.GET("/favicon.ico", func(c *gin.Context) {
			c.Status(http.StatusNoContent)
		})
		api.POST("/", middlewares.GetUserInfo(), urlController.ShortUrl)
	}

	auth := api.Group("/auth")
	{
		auth.POST("/register", userController.RegisterUser)
		auth.POST("/login", userController.LoginUser)
	}

	metrics := api.Group("/metrics")
	metrics.Use(
		middlewares.AuthMiddleware(),
	)
	{
		metrics.GET("/all", urlController.GetUrlList)
		metrics.GET("/:shortened", urlController.GetUrlMetrics)
		metrics.DELETE("/:shortened", userController.RegisterUser)
	}

	api.GET("/:url", urlController.RedirectUrl)
}
