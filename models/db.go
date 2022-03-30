package models

import (
	"fmt"
	"os"

	"github.com/hectorcorrea/textodb"
)

var db textodb.TextoDb

func InitDB() {
	rootDir := env("DB_ROOT_DIR", "./data")
	db = textodb.InitTextDb(rootDir)
}

func DbConnStringSafe() string {
	return fmt.Sprintf("rootDir:%s", db.RootDir)
}

func env(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		value = defaultValue
	}
	return value
}
