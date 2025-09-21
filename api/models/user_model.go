package models

import "time"

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"size:255;not null"`
	Email     string    `json:"email" gorm:"size:255;not null;unique"`
	Password  string    `json:"password" gorm:"size:255;not null"`
	Premium   bool      `json:"premium" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	Urls []Url `json:"urls" gorm:"foreignKey:UserEmail;references:Email"`
}
