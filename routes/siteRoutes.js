var notFound = function(req, res) {
  res.status(404).render('404.ejs', { status: 404, message: 'Page not found' });
}

module.exports = {
  notFound: notFound
}
