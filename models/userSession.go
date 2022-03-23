package models

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"time"
)

type UserSession struct {
	SessionId string
	ExpiresOn time.Time
	Login     string
}

func GetUserSession(sessionId string) (UserSession, error) {
	if sessionId == "" {
		return UserSession{}, errors.New("No ID was received")
	}

	return UserSession{}, errors.New("UserSession has already expired")
}

func NewUserSession(login string) (UserSession, error) {

	sessionId, err := newId()
	if err != nil {
		return UserSession{}, err
	}

	s := UserSession{
		SessionId: sessionId,
		Login:     login,
		ExpiresOn: time.Now().UTC().Add(time.Hour * 24),
	}

	return s, err
}

// source: https://www.socketloop.com/tutorials/golang-how-to-generate-random-string
func newId() (string, error) {
	size := 32
	rb := make([]byte, size)
	_, err := rand.Read(rb)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(rb), nil
}
