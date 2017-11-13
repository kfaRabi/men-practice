const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

module.exports = {
	isOwner: (req, res, next) => {
		const {_id} = req.params;		
		Idea.findOne({ _id }).then( idea => {
			const {user} = idea;
			if(user === req.user.id){
				return next();
			}
			else {
				req.flash("deleted", "Access Denied");
				res.redirect('/ideas');
			}
		});
	},
}