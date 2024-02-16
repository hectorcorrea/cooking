package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"cooking/models"
	"cooking/web"
)

func main() {
	var address = flag.String("address", "localhost:9001", "Address where server will listen for connections")
	var export = flag.Bool("export", false, "True to export data")
	flag.Parse()
	if *export {
		exportData()
	} else {
		web.StartWebServer(*address)
	}
}

func exportData() {
	models.InitDB()
	recipes, err := models.RecipeGetAll()
	if err != nil {
		panic(err)
	}

	allRecipesMarkdown := `<div style="page-break-after: always;"></div>`
	allRecipesMarkdown += "\r\n"
	for _, recipe := range recipes {

		if recipe.Slug == "house-services" || recipe.Slug == "jell-o" {
			fmt.Printf("Skipping: %s\r\n", recipe.Slug)
			continue
		}

		fmt.Printf("Processing: %s\r\n", recipe.Slug)
		md := fmt.Sprintf("# %s\r\n", recipe.Name)
		md += "\r\n"

		ingredients := strings.Split(recipe.Ingredients, "\r\n")
		if len(ingredients) > 0 {
			md += fmt.Sprintf("## Ingredients\r\n")
			for _, ingredient := range ingredients {
				if len(strings.TrimSpace(ingredient)) > 0 {
					md += fmt.Sprintf("* %s\r\n", ingredient)
				}
			}
			md += "\r\n"
		}

		steps := strings.Split(recipe.Directions, "\r\n")
		if len(steps) > 0 {
			md += fmt.Sprintf("## Directions\r\n")
			for _, step := range steps {
				md += fmt.Sprintf("%s\r\n\r\n", step)
			}
		}

		if len(strings.TrimSpace(recipe.Notes)) > 0 {
			md += fmt.Sprintf("## Notes\r\n%s\r\n", recipe.Notes)
		}

		allRecipesMarkdown += md + "\r\n\r\n"
		allRecipesMarkdown += `<div style="page-break-after: always;"></div>`
	}

	os.WriteFile("./export/all_recipes.md", []byte(allRecipesMarkdown), 0644)
	return
}
