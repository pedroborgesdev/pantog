package middlewares

import (
	"fmt"
	"pantog/logger"
	"pantog/utils"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type UserClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

var jwtKey = []byte("a")

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.BadRequest(c, gin.H{
				"error": "authorization token is missing",
			})
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			utils.BadRequest(c, gin.H{
				"error": "invalid token format",
			})
			return
		}

		tokenString := tokenParts[1]

		claims := &UserClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			utils.BadRequest(c, gin.H{
				"error": "invalid token",
			})
			return
		}

		if err != nil {
			utils.BadRequest(c, gin.H{
				"error": "invalid token comparisson error",
			})
			return
		}

		logger.Log("DEBUG", "Hash on auth has been passed", []logger.LogDetail{})

		c.Set("userEmail", claims.Email)

		fmt.Println(claims.Email)

		c.Next()
	}
}
