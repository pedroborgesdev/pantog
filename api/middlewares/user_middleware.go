package middlewares

import (
	"fmt"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type UserInfoClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

func GetUserInfo() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		tokenParts := strings.Split(authHeader, " ")

		tokenString := tokenParts[1]

		claims := &UserClaims{}
		_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil {
			return
		}

		c.Set("userEmail", claims.Email)

		fmt.Println(claims.Email)

		c.Next()
	}
}
