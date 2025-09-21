package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Estrutura de resposta da API
type GeoInfo struct {
	Query      string  `json:"query"`
	Country    string  `json:"country"`
	RegionName string  `json:"regionName"`
	City       string  `json:"city"`
	Zip        string  `json:"zip"`
	Lat        float64 `json:"lat"`
	Lon        float64 `json:"lon"`
	Timezone   string  `json:"timezone"`
	ISP        string  `json:"isp"`
	Org        string  `json:"org"`
	AS         string  `json:"as"`
	Status     string  `json:"status"`
	Message    string  `json:"message"`
}

func GetIpGeolocation(ip string) ([3]string, error) {
	var ipInfo [3]string

	url := fmt.Sprintf("http://ip-api.com/json/%s", ip)

	resp, err := http.Get(url)
	if err != nil {
		return ipInfo, fmt.Errorf("error ocurred on request")
	}
	defer resp.Body.Close()

	var geo GeoInfo
	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return ipInfo, fmt.Errorf("error to decode response")
	}

	if geo.Status != "success" {
		return ipInfo, fmt.Errorf(geo.Message)
	}

	ipInfo = [3]string{geo.Country, geo.RegionName, geo.City}
	return ipInfo, nil
}
