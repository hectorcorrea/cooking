package web

import (
	"cooking/models"
	"cooking/viewModels"
	"net/http"
)

func searchPages(resp http.ResponseWriter, req *http.Request) {
	session := newSession(resp, req)
	if req.Method == "GET" {
		search(session)
	} else if req.Method == "POST" {
		searchDo(session)
	} else {
		renderNotFound(session)
	}
}

func search(s session) {
	vm := viewModels.Search{Text: ""}
	renderTemplate(s, "views/search.html", vm)
}

func searchDo(s session) {
	searchText := s.req.FormValue("searchText")
	recipes, err := models.Search(searchText)
	if err != nil {
		renderError(s, "Error on search", err)
	} else {
		recipes := viewModels.FromRecipes(recipes)
		vm := viewModels.FromResults(searchText, recipes)
		renderTemplate(s, "views/search.html", vm)
	}
}
