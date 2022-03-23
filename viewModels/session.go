package viewModels

// We make everything public here because it's a view model
// (unlike web.session in which everything is private)
type Session struct {
	Id        string
	LoginName string
	IsAuth    bool
}

func xxxNewSession(id, loginName string, isAuth bool) Session {
	return Session{}
}
