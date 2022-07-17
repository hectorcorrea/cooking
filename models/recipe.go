package models

import (
	"fmt"
	"sort"
	"strings"

	"github.com/hectorcorrea/textodb"
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
	recipes := getSearch("")
	return recipes, nil
}

func RecipeGetById(id string) (Recipe, error) {
	return getOne(id)
}

func Search(text string) ([]Recipe, error) {
	recipes := getSearch(text)
	return recipes, nil
}

func SaveNew() (string, error) {
	entry, err := db.NewEntry()
	if err != nil {
		return "", err
	}
	return entry.Id, nil
}

func (r *Recipe) Save() (Recipe, error) {
	entry, err := db.FindById(r.Id)
	if err != nil {
		return Recipe{}, err
	}

	entry.Title = r.Name
	entry.SetField("ingredients", r.Ingredients)
	entry.SetField("directions", r.Directions)
	entry.SetField("notes", r.Notes)
	entry, err = db.UpdateEntry(entry)
	if err != nil {
		return Recipe{}, err
	}

	return getOne(entry.Id)
}

func (b *Recipe) Import() error {
	entry, err := db.NewEntry()
	if err != nil {
		return err
	}

	b.Id = entry.Id
	b.Save()
	return nil
}

func getOne(id string) (Recipe, error) {
	entry, err := db.FindById(id)
	if err != nil {
		return Recipe{}, err
	}
	recipe := recipeFromEntry(entry)
	return recipe, nil
}

func recipeFromEntry(entry textodb.TextoEntry) Recipe {
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

func getSearch(text string) RecipeList {
	var recipes RecipeList
	for _, entry := range db.All() {
		recipe := recipeFromEntry(entry)
		if recipe.Contains(text) {
			recipes = append(recipes, recipe)
		}

	}

	sort.Sort(recipes)
	return recipes
}

// The most inefficient search but it will do for now.
func (r *Recipe) Contains(text string) bool {
	textClean := strings.TrimSpace(strings.ToLower(text))
	if stringContains(r.Name, textClean) {
		return true
	}

	if stringContains(r.Ingredients, textClean) {
		return true
	}

	if stringContains(r.Directions, textClean) {
		return true
	}

	if stringContains(r.Notes, textClean) {
		return true
	}
	return false
}

func stringContains(text string, substring string) bool {
	return strings.Contains(strings.ToLower(text), substring)
}
