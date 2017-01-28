package models

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
)

type LegacyRecipe struct {
	Key         int    `json:"key"`
	Name        string `json:"name"`
	Ingredients string `json:"ingredients"`
	Directions  string `json:"directions"`
	Notes       string `json:"notes"`
	Starred     bool   `json:"isStarred"`
	Shopping    bool   `json:"isShoppingList"`
}

func (b LegacyRecipe) String() string {
	return fmt.Sprintf("%d, %s", b.Key, b.Name)
}

func ImportOne(fileName string) error {
	log.Printf("Importing %s", fileName)
	raw, err := ioutil.ReadFile(fileName)
	if err != nil {
		log.Printf("ERROR: %s", err)
		return err
	}

	var legacy LegacyRecipe
	err = json.Unmarshal(raw, &legacy)
	if err != nil {
		log.Printf("ERROR: %s", err)
		return err
	}

	log.Printf("\timporting metadata for: %s", legacy)
	blog := Recipe{}
	blog.Id = int64(legacy.Key)
	blog.Name = legacy.Name
	blog.Ingredients = legacy.Ingredients
	blog.Directions = legacy.Directions
	blog.Notes = legacy.Notes

	err = blog.Import()
	if err != nil {
		log.Printf("ERROR: %s", err)
	}
	return err
}
