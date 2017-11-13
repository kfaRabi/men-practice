module.exports = {
	loginCheck: (req, res, next) => {
		if(req.isAuthenticated()){
			return next();
		}
		else{
			req.flash("deleted", "Please login to acces this page.");
			res.redirect('/users/login');
		}
	},
}