var notFound = function(req, res) {
  res.status(404).render('404.ejs', { status: 404, message: 'Page not found' });
}

var credits = function(req, res) {
  res.render('credits.ejs');
}

module.exports = {
  notFound: notFound,
  credits: credits
}
