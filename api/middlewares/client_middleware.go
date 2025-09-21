package middlewares

import (
	"pantog/workers"

	"github.com/gin-gonic/gin"
)

func ClientInfoMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		shortened := c.Param("url")
		userAgent := c.GetHeader("User-Agent")

		if shortened != "" || shortened != "/favicon.ico" {
			workers.EnqueueClientRequest(ip, shortened, userAgent)
		}

		c.Next()
	}
}

// Disabled for now
