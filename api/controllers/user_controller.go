package controllers

import (
	"pantog/dto"
	"pantog/logger"
	"pantog/services"
	"pantog/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService *services.UserSerivce
}

func NewUserController() *UserController {
	return &UserController{
		userService: services.NewUserService(),
	}
}

func (c *UserController) RegisterUser(ctx *gin.Context) {
	var request dto.UserRegisterRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		utils.BadRequest(ctx, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := c.userService.RegisterUser(request.Email, request.Password, request.Username)

	if err != nil {
		utils.BadRequest(ctx, map[string]interface{}{
			"error": err.Error(),
		})
		logger.Log("DEBUG", "failed register user", []logger.LogDetail{
			{Key: "url", Value: request.Email},
			{Key: "params", Value: request.Username},
			{Key: "error", Value: err.Error()},
		})
		return
	}

	utils.Success(ctx, map[string]interface{}{
		"message":  "user has been registered",
		"email":    request.Email,
		"username": request.Username,
	})
}

func (c *UserController) LoginUser(ctx *gin.Context) {
	var request dto.UserLoginRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		utils.BadRequest(ctx, gin.H{
			"error": err.Error(),
		})
		return
	}

	jwtToken, err := c.userService.LoginUser(request.Email, request.Password)

	if err != nil {
		utils.BadRequest(ctx, map[string]interface{}{
			"error": err.Error(),
		})
		logger.Log("DEBUG", "failed to login user", []logger.LogDetail{
			{Key: "url", Value: request.Email},
			{Key: "error", Value: err.Error()},
		})
		return
	}

	utils.Success(ctx, map[string]interface{}{
		"message": "user has been logged in",
		"email":   request.Email,
		"token":   jwtToken,
	})
}
