package web

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"cooking/models"
	"cooking/viewModels"
)

var recipeRouter Router

func recipePages(resp http.ResponseWriter, req *http.Request) {

	// This should be initialized only once, not on every call.
	recipeRouter.Add("GET", "/recipe/:title/:id", recipeViewOne)
	recipeRouter.Add("GET", "/recipe", recipeViewAll)
	recipeRouter.Add("POST", "/recipe/:title/:id/edit", recipeEdit)
	recipeRouter.Add("POST", "/recipe/:title/:id/save", recipeSave)
	// recipeRouter.Add("POST", "/blog/:title/:id/post", blogPost)
	// recipeRouter.Add("POST", "/blog/:title/:id/draft", blogDraft)
	recipeRouter.Add("POST", "/recipe/new", recipeNew)

	session := newSession(resp, req)
	found, route := recipeRouter.FindRoute(req.Method, req.URL.Path)
	if found {
		values := route.UrlValues(req.URL.Path)
		route.handler(session, values)
	} else {
		renderNotFound(session)
	}
}

func recipeViewOne(s session, values map[string]string) {
	id := idFromString(values["id"])
	log.Println(values)
	if id == 0 {
		renderError(s, "No Recipe ID was received", nil)
		return
	}

	log.Printf("Loading %d", id)
	blog, err := models.RecipeGetById(id)
	if err != nil {
		renderError(s, "Fetching by ID", err)
		return
	}

	vm := viewModels.FromRecipe(blog, s.toViewModel(), true)
	renderTemplate(s, "views/recipeView.html", vm)
}

func recipeViewAll(s session, values map[string]string) {
	log.Printf("Loading all...")
	if blogs, err := models.RecipeGetAll(); err != nil {
		renderError(s, "Error fetching all", err)
	} else {
		vm := viewModels.FromRecipes(blogs, s.toViewModel())
		renderTemplate(s, "views/recipeList.html", vm)
	}
}

func recipeSave(s session, values map[string]string) {
	id := idFromString(values["id"])
	blog := blogFromForm(id, s)
	if err := blog.Save(); err != nil {
		renderError(s, fmt.Sprintf("Saving blog ID: %d"), err)
	} else {
		url := blog.URL("")
		log.Printf("Redirect to %s", url)
		http.Redirect(s.resp, s.req, url, 301)
	}
}

func recipeNew(s session, values map[string]string) {
	newId, err := models.SaveNew()
	if err != nil {
		renderError(s, fmt.Sprintf("Error creating new blog"), err)
		return
	}
	log.Printf("Redirect to (edit for new) %d", newId)
	values["id"] = fmt.Sprintf("%d", newId)
	recipeEdit(s, values)
}

func recipeEdit(s session, values map[string]string) {
	id := idFromString(values["id"])
	if id == 0 {
		renderError(s, "No blog ID was received", nil)
		return
	}

	log.Printf("Loading %d", id)
	blog, err := models.RecipeGetById(id)
	if err != nil {
		renderError(s, fmt.Sprintf("Loading ID: %d", id), err)
		return
	}

	vm := viewModels.FromRecipe(blog, s.toViewModel(), false)
	renderTemplate(s, "views/recipeEdit.html", vm)
}

func idFromString(str string) int64 {
	id, _ := strconv.ParseInt(str, 10, 64)
	return id
}

func blogFromForm(id int64, s session) models.Recipe {
	var blog models.Recipe
	blog.Id = id
	blog.Name = s.req.FormValue("title")
	blog.Ingredients = s.req.FormValue("ingredients")
	blog.Directions = s.req.FormValue("directions")
	blog.Notes = s.req.FormValue("notes")
	blog.Starred = false
	blog.Shopping = false
	return blog
}
