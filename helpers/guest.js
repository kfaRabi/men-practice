module.exports = {
	isGuest: (req, res, next) => {		
		if(req.isAuthenticated()){
			req.flash("success", "Hey, You are loged in.");
			res.redirect('/ideas');
		}
		else {
			return next();
		}
	},
}