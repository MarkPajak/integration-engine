var standard_API_calls = function (model,router){
					/* POST /todos */
				router.post('/', route_permissions.isAuthenticated, function(req, res, next) {
				  model.create(req.body, function (err, post) {
					if (err) return next(err);
					res.json(post);
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