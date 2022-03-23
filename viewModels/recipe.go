package viewModels

import (
	"html/template"
	"strings"

	"cooking/models"
)

type Recipe struct {
	Id          string
	Name        string
	Slug        string
	Url         string
	Ingredients template.HTML
	Directions  template.HTML
	Notes       template.HTML
	CreatedOn   string
	UpdatedOn   string
	IsFavorite  bool
	IsShopping  bool
}

type RecipeList struct {
	Recipes []Recipe
}

func FromRecipe(blog models.Recipe, linebreaks bool) Recipe {
	var vm Recipe
	vm.Id = blog.Id
	vm.Name = blog.Name
	vm.Slug = blog.Slug
	vm.Url = blog.URL("")
	vm.Ingredients = toHTML(blog.Ingredients, linebreaks)
	vm.Directions = toHTML(blog.Directions, linebreaks)
	vm.Notes = toHTML(blog.Notes, linebreaks)
	vm.CreatedOn = blog.CreatedOn
	vm.UpdatedOn = blog.UpdatedOn
	vm.IsFavorite = false
	vm.IsShopping = false
	return vm
}

func FromRecipes(blogs []models.Recipe) RecipeList {
	var list []Recipe
	for _, blog := range blogs {
		list = append(list, FromRecipe(blog, true))
	}
	return RecipeList{Recipes: list}
}

func toHTML(text string, linebreaks bool) template.HTML {
	if linebreaks {
		text = strings.Replace(text, "\r\n", "<br/>", -1)
	}
	return template.HTML(text)
}
