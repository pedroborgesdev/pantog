package services

import (
	"fmt"
	"pantog/models"
	"pantog/repository"
	"pantog/security"
	"pantog/validation"
)

type UserSerivce struct {
	userRepo  *repository.UserRepository
	validator *validation.UserValidation
	userHash  *security.StringHasher
	userJWT   *security.TokenJWT
}

func NewUserService() *UserSerivce {
	return &UserSerivce{
		userRepo:  repository.NewUserRepository(),
		validator: validation.NewUserValidation(),
	}
}

func (s *UserSerivce) RegisterUser(email, password, username string) error {
	if err := s.validator.ValidateRegister(email, password, username); err != nil {
		return err
	}

	_, err := s.userRepo.GetByEmail(email)

	if err == nil {
		return fmt.Errorf("email already registered")
	}

	password, err = s.userHash.MakeHash(password)
	if err != nil {
		return err
	}

	user := &models.User{
		Username: username,
		Email:    email,
		Password: password,
	}

	return s.userRepo.Register(user)
}

func (s *UserSerivce) LoginUser(email, password string) (string, error) {
	if err := s.validator.ValidateLogin(email, password); err != nil {
		return "", err
	}

	user, err := s.userRepo.GetByEmail(email)
	if user == nil {
		return "", fmt.Errorf("user not registered")
	}

	if err != nil {
		return "", err
	}

	result, err := s.userHash.CompareHash(user.Password, password)
	if err != nil {
		return "", err
	}

	if !result {
		return "", fmt.Errorf("password is incorrect")
	}

	jwtToken, err := s.userJWT.GenerateTokenJWT(email)
	if err != nil {
		return "", err
	}

	if jwtToken == "" {
		return "", fmt.Errorf("token jwt has'n generated")
	}

	return jwtToken, nil
}
