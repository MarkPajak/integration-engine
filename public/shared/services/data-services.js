var status = require('http-status');
         
  exports.Monthly_products_published =  function($resource){
	  
	  
	return $resource('/shopify_product/monthly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
           
  exports.Monthly_products_sold_online =  function($resource){
	  
	  
	return $resource('/shopify_transactions/monthly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Yearly_learning =  function($resource){
	  
	return $resource('/learning/total/:session_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
    

	

  } 
exports.Yearly_operations =  function($resource){
	  
	return $resource('/operations/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Monthly_operations  =  function($resource){
	  
	  
	return $resource('/operations/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
          exports.Yearly_visits =  function($resource){
	  
	return $resource('/kpi_aggregate/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Monthly_visits =  function($resource){
	  
	  
	return $resource('/kpi_aggregate/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
  
  exports.Weekly_visits =  function($resource){
	  
	  
	return $resource('/kpi_aggregate/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
    exports.Yearly_events =  function($resource){
	  
	  
	return $resource('/events/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  exports.Monthly_events =  function($resource){
	  
	  
	return $resource('/events/all/:event_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
  exports.Yearly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
    

	

  } 
  
    exports.Monthly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
  
  }
  
  
    exports.Weekly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/weekly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
  
  }
  
  
      exports.Monthly_exhibitions_pwyt =  function($resource){
	  
	return $resource('/exhibitions_pwyt/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
        exports.Monthly_teg =  function($resource){
	  
	return $resource('/gallery_visits/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
          exports.Yearly_teg =  function($resource){
	  
	return $resource('/gallery_visits/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
          exports.Weekly_teg =  function($resource){
	  
	return $resource('/gallery_visits/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Yearly_retail_sales =  function($resource){
	  
	return $resource('/retail_sales/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  exports.Monthly_retail_sales =  function($resource){
	  
	return $resource('/retail_sales/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Weekly_retail_sales =  function($resource){
	  
	  
	return $resource('/retail_sales/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
        exports.Monthly_all_giftaid =  function($resource){
	  
	  
	return $resource('/allgiftaid/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
      exports.Monthly_giftaid =  function($resource){
	  
	  
	return $resource('/giftaid/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
         exports.Yearly_donations =  function($resource){
	  
	return $resource('/donations/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Monthly_donations =  function($resource){
	  
	  
	return $resource('/donations/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
     exports.Weekly_donations =  function($resource){
	  
	  
	return $resource('/donations/weekly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
      exports.Monthly_learning =  function($resource){
	  
	  
	return $resource('/learning/all/:session_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
	  }   
      exports.Age_learning =  function($resource){
	  
	  
	return $resource('/learning/age',{ }, {
		openGates: {method:'GET', isArray: true}
			
  }); 

  } 

    exports.Monthly_turnstiles =  function($resource){
	  
	  
	return $resource('/turnstiles_logging/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
      exports.turnstile_app =  function($resource){
	  
	  
	return $resource('/open_turnstile',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
  
  
  exports.Raw_events =  function($resource){
	 
		 
            return $resource('/events/:id/:museum_id/:date_value/:on_site_off_site/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   exports.Raw_welcomedesk =  function($resource){
	 
	
	
		
            return $resource('/welcomedesk/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
       exports.Resources =  function($resource){
	 
		 
            return $resource('/resources/:id/:name/:type/:date_value/:exact/:museum_id', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
      exports.Bookings =  function($resource){
	 
		 
            return $resource('/bookings/:id/:group/:start_date/:end_date', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
     exports.Raw_operations =  function($resource){
	 
		 
            return $resource('/operations/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
    exports.Raw_teg =  function($resource){
	 
		 
            return $resource('/gallery_visits/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   //PERFORMACE 
   
    exports.day_turnstiles =  function($resource){
	 
		 
            return $resource('/turnstiles_logging/daily', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 exports.Raw_turnstiles =  function($resource){
	 
		 
            return $resource('/turnstiles_logging/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
 //PERFORMACE 
 exports.Raw_visits =  function($resource){
	 
	 
		 
            return $resource('/raw_visits/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   //PERFORMACE 
 exports.Raw_giftaid =  function($resource){
	 
		 
            return $resource('/giftaid/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 exports.Retail_sales =  function($resource){
	 
		 
            return $resource('/retail_sales/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 
   exports.Raw_exhibitions_pwyt =  function($resource){
	 
		 
            return $resource('/exhibitions_pwyt/:id/:museum_id/:date_value/:donation_box_no/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
  exports.Raw_donations =  function($resource){
	 
		 
            return $resource('/donations/:id/:museum_id/:date_value/:donation_box_no/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
   
  exports.Raw_learning =  function($resource){
	 
		 
            return $resource('/learning/:id/:museum_id/:date_value/:session_type/:age_group/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
  
      exports.check_com_port =  function($resource){
	  
		 
          return $resource('/check_com_port/test', null,
		  { 'get':    {method:'GET', isArray: true} , // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray: true} ,// get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
   
      exports.check_ticket_database =  function($resource){
	  
		 
          return $resource('/check_ticket_database/test', null,
		  { 'get':    {method:'GET', isArray: true} , // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray: true} ,// get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
   exports.check_ticket_file =  function($resource){
	  
		 
          return $resource('/check_ticket_file/test', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET'}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
 
  
 exports.shopify_app_test =  function($resource){
	  
		 
          return $resource('/shopify_product_status_app/test', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET'}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }


   exports.shopify_app =  function($resource){
	  
	  
	   return $resource('/shopify_product_status_app',{ }, {
    getData: {method:'GET', isArray: true}
  });
       

  }
  
exports.AuthService = function($http) {

   var currentUser;

  return {
    login: function() { },
    logout: function() {  },
    isLoggedIn: function() {
        return $http.get('/user_data')	
	},
    currentUser: function() { 
	$http.get('/user_data').then(function(result){
			currentUser = result;
		});
	}
   
  };

};



exports.Tallys = function($resource){
	

          return $resource('/tallys/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.Timeline =  function($resource){
		
		 
          return $resource('/timeline/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.delete_leave_by_id = function(Team,$rootScope){
 
 
 var delete_leave_by_id = {};
 
 
 delete_leave_by_id._delete  = function(leave_id){
 
 ids_to_delete=[]
 ids_to_delete.push(leave_id)
 
 		 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
		
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
											
											$rootScope.me_Data=team[i]
							
							
		
		 
						
           
        
						
				})
			})
 
 
 }
 
  return delete_leave_by_id;
 }
 
  exports.Tech_support =  function($resource){
	  
		 
          return $resource('/tech_support/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
    exports.log_messages =  function($resource){
	  
		 
          return $resource('/logging_messages/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
 exports.Leave =  function($resource){
	  
		 
          return $resource('/leave/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
  exports.Shopify_aggregate =  function($resource){
		
			 
          return $resource('/shopify_aggregate/:id', null,
		  { 'get':    {method:'GET'}  // get individual record
	
          });
}
  
   exports.Timeline_data =  function($resource){
		
			 
          return $resource('/timeline_data_settings/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}
  
 exports.Timeline =  function($resource){
		
			 
          return $resource('/timeline/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}


 exports.Emu_events =  function($http){
		
		   var  all,events = [];
    var getData = function() {
	console.log('getting events')
        return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON')
        .then(function(response) {
          return response.data.events
        });
    }
    return {
        getData: getData 
    };
		  
		  
		  var events = [];
			
	$http.get('http://museums.bristol.gov.uk/sync/data/events.JSON')
    .then(function(response) {
      events = response;
    }); 
          
	  return {events: events};	  
;
}
		
 exports.Team =  function($resource){
	 
		 
          return $resource('/team/:id', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
  exports.Todos =  function($resource){
        
        
          return $resource('/todos/:id', null, {
            'update': { method:'PUT' }
          });
  }
		
		
	