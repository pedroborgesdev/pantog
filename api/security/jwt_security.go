package security

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

var DB *gorm.DB

type TokenJWT struct{}

func NewTokenJWT() *TokenJWT {
	return &TokenJWT{}
}

type UserClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

var jwtKey = []byte("a")

func (h *TokenJWT) GenerateTokenJWT(email string) (string, error) {
	tokenString := ""

	claims := &UserClaims{
		Email:          email,
		StandardClaims: jwt.StandardClaims{},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
