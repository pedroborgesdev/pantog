// workers/geo_worker.go
package workers

import (
	"encoding/json"
	"pantog/cache"
	"pantog/logger"
	"pantog/models"
	"pantog/repository"
	"pantog/utils"
	"time"

	"github.com/avct/uasurfer"
	"github.com/gin-gonic/gin"
)

type ClientWoker struct {
	urlRepo  *repository.UrlRepository
	stopChan chan bool
}

type GeoRequest struct {
	IP        string `json:"ip"`
	Shortened string `json:"shortened"`
	UserAgent string `json:"user_agent"`
}

const redisQueue = "geo_queue"

func NewClientWorker(c *gin.Context) {
	service := &UrlWorker{
		urlRepo:  repository.NewUrlRepository(),
		stopChan: make(chan bool),
	}

	go func() {
		ticker := time.NewTicker(2 * time.Second)

		for {
			<-ticker.C

			result, err := cache.Client.BRPop(cache.Ctx, 5*time.Second, redisQueue).Result()
			if err != nil {
				continue
			}

			var req GeoRequest
			if err := json.Unmarshal([]byte(result[1]), &req); err != nil {
				logger.Log("ERROR", "error in cache queue", []logger.LogDetail{
					{Key: "reason", Value: err.Error()},
				})
				continue
			}

			go func(r GeoRequest) {
				ipInfo, err := utils.GetIpGeolocation(r.IP)
				if err != nil {
					logger.Log("ERROR", "error to get ip geolocation", []logger.LogDetail{
						{Key: "reason", Value: err.Error()},
					})
				}

				userAgent := r.UserAgent
				ua := uasurfer.Parse(userAgent)

				osName := ua.OS.Name.String()
				browserName := ua.Browser.Name.String()

				platform := models.VisitPlatformCount{
					Platform:     osName,
					UrlShortened: r.Shortened,
				}

				browser := models.VisitBrowserCount{
					Browser:      browserName,
					UrlShortened: r.Shortened,
				}

				region := models.VisitRegionCount{
					City:         ipInfo[2],
					Region:       ipInfo[1],
					Country:      ipInfo[0],
					UrlShortened: r.Shortened,
				}

				service.urlRepo.RecordClientInfo(&region, &platform, &browser)

			}(req)
		}
	}()
}

func EnqueueClientRequest(ip, shortened, userAgent string) {
	req := GeoRequest{IP: ip, Shortened: shortened, UserAgent: userAgent}
	data, _ := json.Marshal(req)
	_ = cache.Client.LPush(cache.Ctx, redisQueue, data).Err()
}
