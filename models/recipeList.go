package models

import "strings"

// https://procrypt.github.io/post/2017-06-01-sorting-structs-in-golang/
type RecipeList []Recipe

func (list RecipeList) Len() int {
	return len(list)
}

func (list RecipeList) Less(i, j int) bool {
	return strings.ToLower(list[i].Name) < strings.ToLower(list[j].Name)
}

func (list RecipeList) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}
