package viewModels

type Search struct {
	Text    string
	Recipes RecipeList
	Count   int
}

func FromResults(text string, list RecipeList) Search {
	search := Search{
		Text:    text,
		Recipes: list,
		Count:   len(list.Recipes),
	}
	return search
}
