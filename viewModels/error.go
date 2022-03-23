package viewModels

type Error struct {
	Title   string
	Details string
}

func NewError(title string, err error) Error {
	details := ""
	if err != nil {
		details = err.Error()
	}
	return Error{Title: title, Details: details}
}

func NewErrorFromStr(title string, err string) Error {
	return Error{Title: title, Details: err}
}
