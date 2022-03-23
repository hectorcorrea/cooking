package web

import (
	"net/http"

	"cooking/viewModels"
)

type session struct {
	resp      http.ResponseWriter
	req       *http.Request
	cookie    *http.Cookie
	loginName string
	sessionId string
}

func newSession(resp http.ResponseWriter, req *http.Request) session {
	s := session{
		resp: resp,
		req:  req,
	}
	return s
}

func (s *session) logout() {
}

func (s session) toViewModel() viewModels.Session {
	return viewModels.NewSession(s.sessionId, s.loginName, false)
}
