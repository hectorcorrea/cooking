package models

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/go-sql-driver/mysql"
)

type Recipe struct {
	Id          int64
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
	return fmt.Sprintf("Id: %d\nSlug: %s", r.Id, r.Slug)
}

func (r Recipe) URL(base string) string {
	return fmt.Sprintf("%s/recipe/%s/%d", base, r.Slug, r.Id)
}

func RecipeGetAll() ([]Recipe, error) {
	return getSearch("")
}

func RecipeGetById(id int64) (Recipe, error) {
	return getOne(id)
}

func Search(text string) ([]Recipe, error) {
	return getSearch(text)
}

func (b *Recipe) beforeSave() error {
	b.Slug = getSlug(b.Name)
	b.UpdatedOn = dbUtcNow()
	return nil
}

func getSlug(title string) string {
	slug := strings.Trim(title, " ")
	slug = strings.ToLower(slug)
	slug = strings.Replace(slug, "c#", "c-sharp", -1)
	var chars []rune
	for _, c := range slug {
		isAlpha := c >= 'a' && c <= 'z'
		isDigit := c >= '0' && c <= '9'
		if isAlpha || isDigit {
			chars = append(chars, c)
		} else {
			chars = append(chars, '-')
		}
	}
	slug = string(chars)

	// remove double dashes
	for strings.Index(slug, "--") > -1 {
		slug = strings.Replace(slug, "--", "-", -1)
	}

	if len(slug) == 0 || slug == "-" {
		return ""
	}

	// make sure we don't end with a dash
	if slug[len(slug)-1] == '-' {
		return slug[0 : len(slug)-1]
	}

	return slug
}

func SaveNew() (int64, error) {
	db, err := connectDB()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	sqlInsert := `
		INSERT INTO recipes(name, slug,
      ingredients, directions, notes, createdOn, starred, shopping)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
	result, err := db.Exec(sqlInsert, "new recipe", "new-recipe",
		"", "", "", dbUtcNow(), 0, 0)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func (b *Recipe) Save() error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()
	b.beforeSave()

	sqlUpdate := `
		UPDATE recipes
		SET name = ?, slug = ?,
      ingredients = ?, directions = ?, notes = ?, updatedOn = ?
		WHERE id = ?`
	_, err = db.Exec(sqlUpdate, b.Name, b.Slug,
		b.Ingredients, b.Directions, b.Notes, dbUtcNow(), b.Id)
	return err
}

func (b *Recipe) Import() error {
	db, err := connectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// Recalculate the slug value but not the updatedOn.
	b.Slug = getSlug(b.Name)

	sqlUpdate := `
		INSERT INTO recipes(id, name, slug,
			ingredients, directions, notes,
			starred, shopping, createdOn)
		VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err = db.Exec(sqlUpdate, b.Id, b.Name, b.Slug,
		b.Ingredients, b.Directions, b.Notes,
		0, 0, dbUtcNow())
	return err
}

func getOne(id int64) (Recipe, error) {
	db, err := connectDB()
	if err != nil {
		return Recipe{}, err
	}
	defer db.Close()

	sqlSelect := `SELECT name, slug, ingredients, directions, notes, createdOn, updatedOn
		FROM recipes
		WHERE id = ?`
	row := db.QueryRow(sqlSelect, id)

	var name, slug, ingredients, directions, notes sql.NullString
	var createdOn, updatedOn mysql.NullTime
	err = row.Scan(&name, &slug, &ingredients, &directions, &notes, &createdOn, &updatedOn)
	if err != nil {
		return Recipe{}, err
	}

	var recipe Recipe
	recipe.Id = id
	recipe.Name = stringValue(name)
	recipe.Slug = stringValue(slug)
	recipe.Ingredients = stringValue(ingredients)
	recipe.Directions = stringValue(directions)
	recipe.Notes = stringValue(notes)
	recipe.CreatedOn = timeValue(createdOn)
	recipe.UpdatedOn = timeValue(updatedOn)
	return recipe, nil
}

func getSearch(text string) ([]Recipe, error) {
	db, err := connectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var rows *sql.Rows
	sqlSelect := ""
	if text == "" {
		sqlSelect = `
			SELECT id, name, slug
			FROM recipes
			ORDER BY name`
		rows, err = db.Query(sqlSelect)
	} else {
		sqlSelect = `
			SELECT id, name, slug
			FROM recipes
			WHERE name LIKE ? OR
				ingredients LIKE ? OR
				directions LIKE ? OR
				notes LIKE ?
			ORDER BY name`
		likeText := "%" + text + "%"
		rows, err = db.Query(sqlSelect, likeText, likeText, likeText, likeText)
	}
	if err != nil {
		return nil, err
	}

	var recipes []Recipe
	var id int64
	var name, slug sql.NullString
	for rows.Next() {
		if err := rows.Scan(&id, &name, &slug); err != nil {
			return nil, err
		}
		recipe := Recipe{
			Id:   id,
			Name: stringValue(name),
			Slug: stringValue(slug),
		}
		recipes = append(recipes, recipe)
	}
	return recipes, nil
}
