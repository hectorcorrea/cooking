package main

import (
	"database/sql"
	"flag"
	"fmt"
	"os"

	"github.com/go-sql-driver/mysql"

	"cooking/models"
	"cooking/web"
)

func main() {
	var address = flag.String("address", "localhost:9001", "Address where server will listen for connections")
	var importer = flag.Bool("import", false, "True to import data from MySQL")
	flag.Parse()
	if *importer == true {
		importAll()
		return
	}
	web.StartWebServer(*address)
}

func env(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		value = defaultValue
	}
	return value
}

func importAll() {
	models.InitDB()

	driver := "mysql"
	user := env("DB_USER", "root")
	password := env("DB_PASSWORD", "")
	database := env("DB_NAME", "cookingdb")
	connString := fmt.Sprintf("%s:%s@/%s?parseTime=true", user, password, database)

	debugString := fmt.Sprintf("%s:%s@/%s?parseTime=true", user, "***", database)
	fmt.Printf("%s\r\n", debugString)

	sqlDb, err := sql.Open(driver, connString)
	if err != nil {
		panic(err)
	}

	sqlSelect := `
			SELECT id, name, ingredients, directions, notes, createdOn
			FROM recipes`
	rows, err := sqlDb.Query(sqlSelect)
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		var id int64
		var name, ingredients, directions, notes sql.NullString
		var createdOn mysql.NullTime
		err := rows.Scan(&id, &name, &ingredients, &directions, &notes, &createdOn)
		if err != nil {
			panic(err)
		}

		fmt.Printf("%d\t%s\r\n", id, name.String)
		recipe := models.Recipe{
			Name:        name.String,
			Ingredients: ingredients.String,
			Directions:  directions.String,
		}
		recipe.Import()
	}

	defer rows.Close()
}
