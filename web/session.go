package web

import (
	"net/http"
)

type session struct {
	resp http.ResponseWriter
	req  *http.Request
}

func newSession(resp http.ResponseWriter, req *http.Request) session {
	return session{resp: resp, req: req}
}
