package main

import (
	"flag"

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
	// TODO
}
