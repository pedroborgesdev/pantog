package middlewares

import (
	"pantog/logger"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
)

func MemoryBenchmarkMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var mBefore, mAfter runtime.MemStats
		runtime.ReadMemStats(&mBefore)

		start := time.Now()
		c.Next()
		duration := time.Since(start)

		runtime.ReadMemStats(&mAfter)

		memUsed := float64(mAfter.Alloc-mBefore.Alloc) / 1024.0

		logger.Log("BENCH", "Request RAM usage calculated", []logger.LogDetail{
			{Key: "route", Value: c.FullPath()},
			{Key: "duration", Value: duration},
			{Key: "memory_usage(kb)", Value: memUsed},
		})
	}
}
