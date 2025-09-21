package validation

import (
	"errors"
	"regexp"
)

var (
	ErrInvalidEmail    = errors.New("invalid email format")
	ErrInvalidPassword = errors.New("invalid password format")
	ErrInvalidUsername = errors.New("invalid username format")
)

type UserValidation struct {
	emailRegex     *regexp.Regexp
	usernameRegex  *regexp.Regexp
	lowercaseRegex *regexp.Regexp
	uppercaseRegex *regexp.Regexp
	digitRegex     *regexp.Regexp
	specialRegex   *regexp.Regexp
}

func NewUserValidation() *UserValidation {
	return &UserValidation{
		emailRegex:     regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`),
		usernameRegex:  regexp.MustCompile(`^[a-zA-Z0-9_-]{5,}$`),
		lowercaseRegex: regexp.MustCompile(`[a-z]`),
		uppercaseRegex: regexp.MustCompile(`[A-Z]`),
		digitRegex:     regexp.MustCompile(`[0-9]`),
		specialRegex:   regexp.MustCompile(`[^a-zA-Z0-9_-]`),
	}
}

func (v *UserValidation) ValidateRegister(email, password, username string) error {
	if err := v.validateEmail(email); err != nil {
		return err
	}

	if err := v.validatePassword(password); err != nil {
		return err
	}

	if err := v.validateUsername(username); err != nil {
		return err
	}

	return nil
}

func (v *UserValidation) ValidateLogin(email, password string) error {
	if err := v.validateEmail(email); err != nil {
		return err
	}

	if err := v.validatePassword(password); err != nil {
		return err
	}

	return nil
}

func (v *UserValidation) validateEmail(email string) error {
	if !v.emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}
	return nil
}

func (v *UserValidation) validatePassword(password string) error {
	if len(password) < 8 ||
		!v.lowercaseRegex.MatchString(password) ||
		!v.uppercaseRegex.MatchString(password) ||
		!v.digitRegex.MatchString(password) ||
		!v.specialRegex.MatchString(password) {
		return ErrInvalidPassword
	}
	return nil
}

func (v *UserValidation) validateUsername(username string) error {
	if !v.usernameRegex.MatchString(username) {
		return ErrInvalidUsername
	}
	return nil
}
