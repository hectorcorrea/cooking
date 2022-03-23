package models

import (
	"fmt"
	"os"

	"github.com/hectorcorrea/texto/textdb"
)

type DbSettings struct {
	driver     string
	user       string
	password   string
	database   string
	connString string
}

var dbSettings DbSettings
var textDb textdb.TextDb

func InitDB() {
	rootDir := env("DB_ROOT_DIR", "./textdb")
	textDb = textdb.InitTextDb(rootDir)
}

func DbConnStringSafe() string {
	return fmt.Sprintf("rootDir:%s", textDb.RootDir)
}

func env(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		value = defaultValue
	}
	return value
}
