
var _ = require('underscore');

var route_permissions = function (options){
	

	this.isAdmin = function (req, res, next) {
	console.log('isAuthenticated ',req.isAuthenticated())

	
	if (req.isAuthenticated()){
		if (req.user.group!="ADMIN"){ 
			 res.json("NOT ENOUGH PRIVELIGES");
		}
		else
		{
		console.log('isAuthenticated',req.user.group)
			return next();
		}
	}
	else
	{
		   res.json("NOT ENOUGH PRIVELIGES");
		
	}

	return false
}

this.isAuthenticated = function (req, res, next) {
	console.log('isAuthenticated ',req.isAuthenticated())

	
	if (req.isAuthenticated()){
	
			return next();
		
	}
	else
	{
		   res.json("NOT LOGGED IN");
		
	}

	return false
}

	}

module.exports = route_permissions;