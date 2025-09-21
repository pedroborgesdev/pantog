package repository

import (
	"errors"
	"fmt"
	"pantog/database"
	"pantog/models"
	"time"

	"gorm.io/gorm"
)

type UrlRepository struct {
	DB *gorm.DB
}

func NewUrlRepository() *UrlRepository {
	return &UrlRepository{
		DB: database.DB,
	}
}

func (r *UrlRepository) ShortUrl(shortUrl *models.Url) (*models.Url, error) {
	if err := r.DB.Create(shortUrl).Error; err != nil {
		return nil, err
	}
	return shortUrl, nil
}

func (r *UrlRepository) RedirectUrl(redirectUrl string) (string, error) {
	var result models.Url
	err := r.DB.Where("shortened = ?", redirectUrl).First(&result).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("shortened URL not found")
		}
		return "", err
	}
	return result.Original, nil
}

func (r *UrlRepository) RemoveAfter(days int) error {
	limitDate := time.Now().AddDate(0, 0, -days)

	result := r.DB.Where("created_at < ?", limitDate).Delete(&models.Url{})

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *UrlRepository) FindByShortened(url string) (*models.Url, error) {
	var result models.Url
	err := r.DB.Where("shortened = ?", url).First(&result).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("shortened URL not found")
		}
		return nil, err
	}

	return &result, err
}

func (r *UrlRepository) FindUrlListByEmail(userEmail string) (*models.MetricsUrlList, error) {
	var user models.User

	err := r.DB.Preload("Urls").Where("email = ?", userEmail).First(&user).Error
	if err != nil {
		return nil, err
	}

	var urlList models.MetricsUrlList

	for _, url := range user.Urls {
		var totalVisits int64

		r.DB.Model(&models.VisitRegionCount{}).Where("url_shortened = ?", url.Shortened).Select("SUM(count)").Scan(&totalVisits)

		urlInfo := models.MetricsUrlBasicInfo{
			Shortened:   url.Shortened,
			CreatedAt:   url.CreatedAt,
			TotalVisits: fmt.Sprintf("%d", totalVisits),
		}
		urlList.Urls = append(urlList.Urls, urlInfo)
	}

	return &urlList, nil
}

func (r *UrlRepository) RecordClientInfo(region *models.VisitRegionCount, platform *models.VisitPlatformCount, browser *models.VisitBrowserCount) {
	var existingRegion models.VisitRegionCount
	err := r.DB.Where("url_shortened = ? AND city = ? AND region = ? AND country = ?",
		region.UrlShortened, region.City, region.Region, region.Country).
		First(&existingRegion).Error

	if err == nil {
		r.DB.Model(&existingRegion).Update("count", existingRegion.Count+1)
	} else {
		region.Count = 1
		r.DB.Create(region)
	}

	var existingPlatform models.VisitPlatformCount
	err = r.DB.Where("url_shortened = ? AND platform = ?",
		platform.UrlShortened, platform.Platform).
		First(&existingPlatform).Error

	if err == nil {
		r.DB.Model(&existingPlatform).Update("count", existingPlatform.Count+1)
	} else {
		platform.Count = 1
		r.DB.Create(platform)
	}

	var existingBrowser models.VisitBrowserCount
	err = r.DB.Where("url_shortened = ? AND browser = ?",
		browser.UrlShortened, browser.Browser).
		First(&existingBrowser).Error

	if err == nil {
		r.DB.Model(&existingBrowser).Update("count", existingBrowser.Count+1)
	} else {
		browser.Count = 1
		r.DB.Create(browser)
	}
}

func (r *UrlRepository) GetUrlMetrics(url string) (*models.Metrics, error) {
	var visitRegions []models.VisitRegionCount
	if err := r.DB.Where("url_shortened = ?", url).Find(&visitRegions).Error; err != nil {
		return nil, err
	}

	countryMap := make(map[string]*models.MetricsCountry)

	for _, visit := range visitRegions {
		country, ok := countryMap[visit.Country]
		if !ok {
			country = &models.MetricsCountry{
				Country:     visit.Country,
				TotalVisits: 0,
				Regions:     []models.MetricsRegion{},
			}
			countryMap[visit.Country] = country
		}
		country.TotalVisits += int(visit.Count)

		var regionPtr *models.MetricsRegion
		for i := range country.Regions {
			if country.Regions[i].Region == visit.Region {
				regionPtr = &country.Regions[i]
				break
			}
		}
		if regionPtr == nil {
			country.Regions = append(country.Regions, models.MetricsRegion{
				Region:      visit.Region,
				TotalVisits: 0,
				Cities:      []models.MetricsCity{},
			})
			regionPtr = &country.Regions[len(country.Regions)-1]
		}
		regionPtr.TotalVisits += int(visit.Count)

		found := false
		for i := range regionPtr.Cities {
			if regionPtr.Cities[i].City == visit.City {
				regionPtr.Cities[i].TotalVisits += int(visit.Count)
				found = true
				break
			}
		}
		if !found {
			regionPtr.Cities = append(regionPtr.Cities, models.MetricsCity{
				City:        visit.City,
				TotalVisits: int(visit.Count),
			})
		}
	}

	var result models.Metrics
	for _, country := range countryMap {
		result.TotalVisits += country.TotalVisits
		result.VisitRegions = append(result.VisitRegions, *country)
	}

	return &result, nil
}
