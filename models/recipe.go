package models

import (
	"fmt"

	"github.com/hectorcorrea/texto/textdb"
)

type Recipe struct {
	Id          string
	Name        string
	Slug        string
	Ingredients string
	Directions  string
	Notes       string
	CreatedOn   string
	UpdatedOn   string
	Starred     bool
	Shopping    bool
}

func (r Recipe) DebugString() string {
	return fmt.Sprintf("Id: %s\nSlug: %s", r.Id, r.Slug)
}

func (r Recipe) URL(base string) string {
	return fmt.Sprintf("%s/recipe/%s/%s", base, r.Slug, r.Id)
}

func RecipeGetAll() ([]Recipe, error) {
	return getSearch("")
}

func RecipeGetById(id string) (Recipe, error) {
	return getOne(id)
}

func Search(text string) ([]Recipe, error) {
	return getSearch(text)
}

func SaveNew() (string, error) {
	entry, err := textDb.NewEntry()
	if err != nil {
		return "", err
	}
	return entry.Id, nil
}

func (r *Recipe) Save() (Recipe, error) {
	entry, err := textDb.FindById(r.Id)
	if err != nil {
		return Recipe{}, err
	}

	entry.Title = r.Name
	entry.SetField("ingredients", r.Ingredients)
	entry.SetField("directions", r.Directions)
	entry.SetField("notes", r.Notes)
	entry, err = textDb.UpdateEntry(entry)
	if err != nil {
		return Recipe{}, err
	}

	return getOne(entry.Id)
}

func (b *Recipe) Import() error {
	// TODO
	return nil
}

func getOne(id string) (Recipe, error) {
	entry, err := textDb.FindById(id)
	if err != nil {
		return Recipe{}, err
	}
	recipe := recipeFromEntry(entry)
	return recipe, nil
}

func recipeFromEntry(entry textdb.TextEntry) Recipe {
	var recipe Recipe
	recipe.Id = entry.Id
	recipe.Name = entry.Title
	recipe.Slug = entry.Slug
	recipe.Ingredients = entry.GetField("ingredients")
	recipe.Directions = entry.GetField("directions")
	recipe.Notes = entry.GetField("notes")
	recipe.CreatedOn = entry.CreatedOn
	recipe.UpdatedOn = entry.UpdatedOn
	return recipe
}

func getSearch(text string) ([]Recipe, error) {
	// TODO: implement search
	var recipes []Recipe
	for _, entry := range textDb.All() {
		recipe := recipeFromEntry(entry)
		recipes = append(recipes, recipe)
	}
	return recipes, nil
}
