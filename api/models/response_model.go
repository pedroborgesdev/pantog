package models

import "time"

type Metrics struct {
	TotalVisits int `json:"visits"`

	VisitRegions []MetricsCountry `json:"location"`
	// VisitPlatform []MetricsVisitPlatformCount `json:"platform"`
	// VisitBrowser  []MetricsVisitBrowserCount  `json:"browser"`
}

type MetricsCountry struct {
	Country     string          `json:"country"`
	TotalVisits int             `json:"visits"`
	Regions     []MetricsRegion `json:"regions"`
}

type MetricsRegion struct {
	Region      string        `json:"region"`
	TotalVisits int           `json:"visits"`
	Cities      []MetricsCity `json:"cities"`
}

type MetricsCity struct {
	City        string `json:"city"`
	TotalVisits int    `json:"visits"`
}

type MetricsUrlList struct {
	Urls []MetricsUrlBasicInfo `json:"urls"`
}

type MetricsUrlBasicInfo struct {
	Shortened   string    `json:"shortened"`
	TotalVisits string    `json:"visits"`
	CreatedAt   time.Time `json:"created_at"`
}
