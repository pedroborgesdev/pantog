package validation

import (
	"errors"
	"regexp"
)

var (
	ErrInvalidUrl    = errors.New("invalid url format")
	ErrInvalidParams = errors.New("invalid params format")
)

type UrlValidation struct {
	urlRegex    *regexp.Regexp
	paramsRegex *regexp.Regexp
}

func NewUrlValidation() *UrlValidation {
	return &UrlValidation{
		urlRegex:    regexp.MustCompile(`^[^\s]+$`),
		paramsRegex: regexp.MustCompile(`^[A-Za-z0-9-]+$`),
	}
}

func (v *UrlValidation) ValidateUrlToShort(url, params string) error {
	if err := v.validateUrl(url); err != nil {
		return err
	}

	if params != "" {
		if err := v.validateParams(params); err != nil {
			return err
		}
	}

	return nil
}

func (v *UrlValidation) validateUrl(name string) error {
	if !v.urlRegex.MatchString(name) {
		return ErrInvalidUrl
	}
	return nil
}

func (v *UrlValidation) validateParams(version string) error {
	if !v.paramsRegex.MatchString(version) {
		return ErrInvalidParams
	}
	return nil
}
