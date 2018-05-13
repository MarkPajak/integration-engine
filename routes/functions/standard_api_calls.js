var standard_API_calls = function (model,router){
					/* POST /todos */
				router.post('/', route_permissions.isAuthenticated, function(req, res, next) {
				 
console.log(req.body)


				 model.create(req.body, function (err, post) {
					if (err) return next(err);
					console.log('moment(post.date_value)',moment(post.date_value).format("hh"))
					
					if(moment(post.date_value).format("hh")=="12"){
						console.log("model updated",post.date_value)
					visits.update({ _id: post._id }, { $set : { date_value: post.date_value.setHours(post.date_value.getHours()+1) }}, res.json(post));
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
					if (err) return next(err);
					res.json(post);
				  });
				});

				/* PUT /todos/:id */
				router.put('/:id', route_permissions.isAuthenticated, function(req, res, next) {
				  model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
					if (err) return next(err);
					res.json(post);
				  });
				});


				/* DELETE /todos/:id */
				router.delete('/:id', route_permissions.isAdmin, function(req, res, next) {
				  model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
					if (err) return next(err);
					res.json(post);
				  });
				});

	return router;
	
	}
	
module.exports = standard_API_calls;