package models

import "time"

type Url struct {
	Shortened string    `gorm:"primaryKey;size:255"`
	Original  string    `json:"original" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	VisitRegions   []VisitRegionCount   `gorm:"foreignKey:UrlShortened;references:Shortened"`
	VisitPlatforms []VisitPlatformCount `gorm:"foreignKey:UrlShortened;references:Shortened"`
	VisitBrowsers  []VisitBrowserCount  `gorm:"foreignKey:UrlShortened;references:Shortened"`

	UserEmail string `json:"user_email" gorm:"size:255;not null"`
}

type VisitRegionCount struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	UrlShortened string `gorm:"size:255;index"`
	City         string `json:"city" gorm:"not null"`
	Region       string `json:"region" gorm:"not null"`
	Country      string `json:"country" gorm:"not null"`
	Count        uint   `json:"count" gorm:"default:0"`

	Url Url `gorm:"foreignKey:UrlShortened;references:Shortened"`
}

type VisitPlatformCount struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	UrlShortened string `gorm:"size:255;index"`
	Platform     string `json:"platform" gorm:"not null"`
	Count        uint   `json:"count" gorm:"default:0"`

	Url Url `gorm:"foreignKey:UrlShortened;references:Shortened"`
}

type VisitBrowserCount struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	UrlShortened string `gorm:"size:255;index"`
	Browser      string `json:"browser" gorm:"not null"`
	Count        uint   `json:"count" gorm:"default:0"`

	Url Url `gorm:"foreignKey:UrlShortened;references:Shortened"`
}
