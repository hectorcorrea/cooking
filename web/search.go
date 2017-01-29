package web

import (
	"cooking/models"
	"cooking/viewModels"
	"log"
	"net/http"
)

func searchPages(resp http.ResponseWriter, req *http.Request) {
	session := newSession(resp, req)
	if req.Method == "GET" {
		vm := viewModels.Search{Text: ""}
		renderTemplate(session, "views/search.html", vm)
	} else if req.Method == "POST" {
		doSearch(session)
	} else {
		renderNotFound(session)
	}
}

func doSearch(s session) {
	searchText := s.req.FormValue("searchText")
	recipes, err := models.Search(searchText)
	if err != nil {
		log.Printf("oops %s", err)
	} else {
		recipes := viewModels.FromRecipes(recipes, s.toViewModel())
		vm := viewModels.FromResults(searchText, recipes, s.toViewModel())
		renderTemplate(s, "views/search.html", vm)
	}
}
