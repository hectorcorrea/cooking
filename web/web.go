package web

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	"cooking/models"
	"cooking/viewModels"
)

func StartWebServer(address string) {
	log.Printf("Listening for requests at %s\n", "http://"+address)

	models.InitDB()
	log.Printf("Database: %s", models.DbConnStringSafe())

	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/favicon.ico", fs)
	http.Handle("/favicon.png", fs)
	http.Handle("/robots.txt", fs)
	http.Handle("/public/", http.StripPrefix("/public/", fs))
	http.HandleFunc("/search", searchPages)
	http.HandleFunc("/recipe/", recipePages)
	http.HandleFunc("/", homePage)

	err := http.ListenAndServe(address, nil)
	if err != nil {
		log.Fatal("Failed to start the web server: ", err)
	}
}

func homePage(resp http.ResponseWriter, req *http.Request) {
	session := newSession(resp, req)
	if req.URL.Path == "/" {
		search(session)
	} else {
		cacheResponse(resp)
		renderNotFound(session)
	}
}

func cacheResponse(resp http.ResponseWriter) {
	fiveMinutes := time.Minute * 5
	later := time.Now().Add(fiveMinutes)
	cacheControl := fmt.Sprintf("public, max-age=%.f", time.Duration(fiveMinutes).Seconds())
	resp.Header().Add("Cache-Control", cacheControl)
	resp.Header().Add("Expires", later.UTC().String())
}

func renderNotFound(s session) {
	// TODO: log more about the Request
	path := s.req.URL.Path
	log.Printf(fmt.Sprintf("Not found (%s)", path))
	t, err := template.New("layout").ParseFiles("views/layout.html", "views/notFound.html")
	if err != nil {
		log.Printf("Error rendering not found page :(")
		// perhaps render a hard coded string?
	} else {
		s.resp.WriteHeader(http.StatusNotFound)
		t.Execute(s.resp, nil)
	}
}

func renderError(s session, title string, err error) {
	// I don't like that we have a reference to sql in here.
	// The web should not be aware of the DB.
	// TODO: create an abstraction so that we can remove the db reference?
	if err == sql.ErrNoRows {
		renderNotFound(s)
		return
	}

	// TODO: log more about the Request
	log.Printf("ERROR: %s - %s", title, err)
	vm := viewModels.NewError(title, err)
	t, err := template.New("layout").ParseFiles("views/layout.html", "views/error.html")
	if err != nil {
		log.Printf("Error rendering error page :(")
		// perhaps render a hard coded string?
	} else {
		s.resp.WriteHeader(http.StatusInternalServerError)
		t.Execute(s.resp, vm)
	}
}

func loadTemplate(s session, viewName string) (*template.Template, error) {
	t, err := template.New("layout").ParseFiles("views/layout.html", viewName)
	if err != nil {
		renderError(s, fmt.Sprintf("Loading view %s", viewName), err)
		return nil, err
	} else {
		log.Printf("loaded template %s", viewName)
		return t, nil
	}
}

func renderTemplate(s session, viewName string, viewModel interface{}) {
	t, err := loadTemplate(s, viewName)
	if err != nil {
		log.Printf("Error loading: %s, %s ", viewName, err)
	} else {
		err = t.Execute(s.resp, viewModel)
		if err != nil {
			log.Printf("Error rendering: %s, %s ", viewName, err)
		}
	}
}
