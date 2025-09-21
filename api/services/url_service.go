package services

import (
	"fmt"
	"pantog/models"
	"pantog/repository"
	"pantog/utils"
	"pantog/validation"
	"pantog/workers"
	"strings"

	"github.com/gin-gonic/gin"
)

type UrlService struct {
	urlRepo   *repository.UrlRepository
	validator *validation.UrlValidation
}

func NewUrlService() *UrlService {
	return &UrlService{
		urlRepo:   repository.NewUrlRepository(),
		validator: validation.NewUrlValidation(),
	}
}

func (s *UrlService) ShortUrl(url, params, userEmail string) (string, error) {
	if err := s.validator.ValidateUrlToShort(url, params); err != nil {
		return "", err
	}

	if userEmail == "" {
		userEmail = "Unknown"
	}

	shortUrl := &models.Url{
		Original:  url,
		UserEmail: userEmail,
	}

	if params != "" {
		params += "-"
	}

	for {
		random := utils.RandomCode(6)

		if params != "" {
			params = fmt.Sprintf("%s%s", params, random)
		} else {
			params = random
		}

		shortUrl.Shortened = params

		shortenedUrl, err := s.urlRepo.ShortUrl(shortUrl)

		if err != nil {
			if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				continue
			}
			return "", err
		}

		urlPattern := fmt.Sprintf("http://186.195.216.145:2020/%s", shortenedUrl.Shortened)

		return urlPattern, nil
	}
}

func (s *UrlService) RedirectUrl(c *gin.Context, shortUrl string) (string, error) {
	if err := s.validator.ValidateUrlToShort("/", shortUrl); err != nil {
		return "", err
	}

	originalUrl, err := s.urlRepo.RedirectUrl(shortUrl)

	if originalUrl == "" || err != nil {
		return "", err
	}

	fmt.Println(originalUrl)

	ip := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	workers.EnqueueClientRequest(ip, shortUrl, userAgent)

	return originalUrl, nil
}

func (s *UrlService) GetUrlMetrics(url string) (*models.Metrics, error) {
	urlExists, err := s.urlRepo.FindByShortened(url)
	if err != nil {
		return nil, err
	}

	if urlExists == nil {
		return nil, fmt.Errorf("url does not exists")
	}

	return s.urlRepo.GetUrlMetrics(url)
}

func (s *UrlService) GetUrlList(userEmail string) (*models.MetricsUrlList, error) {
	return s.urlRepo.FindUrlListByEmail(userEmail)
}
