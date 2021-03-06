var fs = require('fs');


var standard_API_calls = function (model,router){
					/* POST /todos */
				router.post('/', route_permissions.isAuthenticated, function(req, res, next) {
				 

				 model.create(req.body, function (err, post) {
					console.log(model.collection.name) 
					 var fileContent = JSON.stringify(req.body);

// The absolute path of the new file with its name
var filepath = "./routes/trigger_files/"+model.collection.name+".txt";

fs.writeFile(filepath,  JSON.stringify(fileContent, null, 2) , (err) => {
    if (err){

console.log(err)
		throw err;
	}

    console.log("The file was succesfully saved!");
}); 
					 
					if (err) return next(err);
				//	console.log('moment(post.date_value)',moment(post.date_value).format("hh"))
					
					if(moment(post.date_value).format("hh")=="12"){
						
						console.log("model updated",post.date_value)
						
					model.update({ _id: post._id }, { $set : { date_value: post.date_value.setHours(post.date_value.getHours()+1) }}, res.json(post));
					}
					else
					{
					res.json(post);	
						
					}
					
					
					
				  });
				});

				/* GET /todos/id */
				router.get('/:id', route_permissions.isAuthenticated, function(req, res, next) {
				  model.findById(req.params.id, function (err, post) {
					if (err){
					console.log(err)
					return next(err);
					}
					res.json(post);
				  });
				});

				/* PUT /todos/:id */
				router.put('/:id', route_permissions.isAuthenticated, function(req, res, next) {
				  model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
						if (err){
					console.log(err)
					return next(err);
					}
					res.json(post);
				  });
				});


				/* DELETE /todos/:id */
				router.delete('/:id', route_permissions.isAdmin, function(req, res, next) {
				  model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
						if (err){
					console.log(err)
					return next(err);
					}
					res.json(post);
				  });
				});

	return router;
	
	}
	
module.exports = standard_API_calls;