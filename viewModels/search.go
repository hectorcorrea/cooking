package viewModels

type Search struct {
	Text    string
	Recipes RecipeList
	Count   int
	Session
}

func FromResults(text string, list RecipeList, session Session) Search {
	search := Search{
		Text:    text,
		Session: session,
		Recipes: list,
		Count:   len(list.Recipes),
	}
	return search
}
