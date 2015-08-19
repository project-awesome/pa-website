module.exports = function(app, passport) {
	app.use(setUserCookie);
	//require('./page_routes')(app);
	require('./auth_routes')(app, passport);
	require('./api')(app);
	app.get('*', function(req, res) {
		res.render('pages/index');
	});
}

function setUserCookie(req, res, next) {
    if (req.isAuthenticated()) {
    	res.cookie('awesome_id', req.user.awesome_id, { maxAge: 900000, httpOnly: false });
    	res.cookie('email', req.user.email, { maxAge: 900000, httpOnly: false });
    	res.cookie('name', req.user.name, { maxAge: 900000, httpOnly: false });
    	res.cookie('role', req.user.role, { maxAge: 900000, httpOnly: false });
	} else {
		removeCookies(res);
	}
    return next();
}
function removeCookies(res) {
	res.clearCookie('awesome_id');
	res.clearCookie('email');
	res.clearCookie('name');
	res.clearCookie('role');
}

