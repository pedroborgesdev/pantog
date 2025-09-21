package controllers

import (
	"fmt"
	"pantog/dto"
	"pantog/logger"
	"pantog/services"
	"pantog/utils"

	"github.com/gin-gonic/gin"
)

type UrlController struct {
	urlService *services.UrlService
}

func NewUrlController() *UrlController {
	return &UrlController{
		urlService: services.NewUrlService(),
	}
}

func (c *UrlController) ShortUrl(ctx *gin.Context) {
	var request dto.UrlShortRequest

	userEmail, _ := ctx.Get("userEmail")
	fmt.Println(userEmail)

	if err := ctx.ShouldBindJSON(&request); err != nil {
		utils.BadRequest(ctx, gin.H{
			"error": err.Error(),
		})
		return
	}

	shortUrl, err := c.urlService.ShortUrl(request.Url, request.Params, userEmail.(string))
	if err != nil {
		utils.BadRequest(ctx, map[string]interface{}{
			"error": err.Error(),
		})
		logger.Log("DEBUG", "failed to short url", []logger.LogDetail{
			{Key: "url", Value: request.Url},
			{Key: "params", Value: request.Params},
			{Key: "error", Value: err.Error()},
		})
		return
	}

	utils.Success(ctx, map[string]interface{}{
		"message": "url has been shortened",
		"url":     shortUrl,
	})
}

func (c *UrlController) RedirectUrl(ctx *gin.Context) {
	url := ctx.Param("url")

	if url == "" {
		utils.BadRequest(ctx, gin.H{
			"error": "input the url",
		})
		return
	}

	originalUrl, err := c.urlService.RedirectUrl(ctx, url)
	if err != nil {
		utils.BadRequest(ctx, map[string]interface{}{
			"error": "failed to redirect url",
		})
		logger.Log("DEBUG", "failed to short url", []logger.LogDetail{
			{Key: "url", Value: url},
			{Key: "error", Value: err.Error()},
		})
		return
	}

	ctx.Redirect(308, originalUrl)
}

func (c *UrlController) GetUrlMetrics(ctx *gin.Context) {
	url := ctx.Param("shortened")

	if url == "" {
		utils.BadRequest(ctx, gin.H{
			"error": "input the url",
		})
		return
	}

	result, err := c.urlService.GetUrlMetrics(url)
	if err != nil {
		utils.BadRequest(ctx, map[string]interface{}{
			"error": "failed get url metrics",
		})
		logger.Log("DEBUG", "failed to get url metrics", []logger.LogDetail{
			{Key: "url", Value: url},
			{Key: "error", Value: err.Error()},
		})
		return
	}

	utils.Success(ctx, map[string]interface{}{
		"message": "url metrics has been returned",
		"metrics": result,
	})
}

func (c *UrlController) GetUrlList(ctx *gin.Context) {
	userEmail, _ := ctx.Get("userEmail")

	urlList, _ := c.urlService.GetUrlList(userEmail.(string))

	utils.Success(ctx, map[string]interface{}{
		"message": "url list has been returned",
		"metrics": urlList,
	})
}
