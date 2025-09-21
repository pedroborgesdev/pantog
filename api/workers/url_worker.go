package workers

import (
	"pantog/config"
	"pantog/logger"
	"pantog/repository"

	"time"
)

type UrlWorker struct {
	urlRepo  *repository.UrlRepository
	stopChan chan bool
}

func NewUrlWorker() *UrlWorker {
	service := &UrlWorker{
		urlRepo:  repository.NewUrlRepository(),
		stopChan: make(chan bool),
	}

	go service.StartUrlWorker()

	logger.Log("DEBUG", "Url worker has been initialized", []logger.LogDetail{})

	return service
}

func (s *UrlWorker) StartUrlWorker() {
	RemoveAfter := config.AppConfig.UrlRemoveAfter
	Looptime := config.AppConfig.UrlWorkerLooptime

	ticker := time.NewTicker(time.Duration(Looptime) * time.Hour)

	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if err := s.RemoveUrlAfter(RemoveAfter); err != nil {
				logger.Log("ERROR", "Error to remove URL after days", []logger.LogDetail{
					{Key: "Error", Value: err.Error()},
				})
			} else {
				logger.Log("INFO", "URL has been removed after days", []logger.LogDetail{
					{Key: "removed_after", Value: RemoveAfter},
				})
			}
		case <-s.stopChan:
			return
		}
	}
}

func (s *UrlWorker) RemoveUrlAfter(remove_after int) error {
	err := s.urlRepo.RemoveAfter(remove_after)
	if err != nil {
		return err
	}
	return nil
}
