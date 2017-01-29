package models

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
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
	blog.Ingredients = textWithLinebreaks(legacy.Ingredients)
	blog.Directions = textWithLinebreaks(legacy.Directions)
	blog.Notes = textWithLinebreaks(legacy.Notes)

	err = blog.Import()
	if err != nil {
		log.Printf("ERROR: %s", err)
	}
	return err
}

func textWithLinebreaks(text string) string {
	return strings.Replace(text, "<br/>", "\r\n", -1)
}
