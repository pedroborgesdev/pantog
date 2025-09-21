package dto

type UrlShortRequest struct {
	Url    string `json:"url" binding:"required"`
	Params string `json:"params"`
}

type UrlRedirectRequest struct {
	Url string `json:"url" binding:"required"`
}
