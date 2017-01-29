package main

import (
	"flag"
	"log"

	"cooking/models"
	"cooking/web"
)

func main() {
	var address = flag.String("address", "localhost:3002", "Address where server will listen for connections")
	var importer = flag.String("import", "", "Name of file to import legacy blog from")
	flag.Parse()
	if *importer != "" {
		importOne(*importer)
		return
	}
	web.StartWebServer(*address)
}

func importOne(fileName string) {
	if err := models.InitDB(); err != nil {
		log.Fatal("Failed to initialize database: ", err)
	}
	log.Printf("Database: %s", models.DbConnStringSafe())
	models.ImportOne(fileName)
}
