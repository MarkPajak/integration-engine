var async = require('async')

exports.tech_support_controller = function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope,  trello, tech_get_trello_board, date_calc,Tech_support
    ) {
	$scope.rows=[]
	$scope._rows=[]
	//http://ui-grid.info/docs/#/tutorial/201_editable
	Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}

	
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope.rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope.rows;
						})
						
						})
		var lists = []
		var list = []
		list.id="5710a18fc2c7adc11a382e94"
			lists.push(list)
		var list = []
		list.id="57c6f2715e4ad081f42204ec"
			lists.push(list)
		var list = []
		list.id="57558712bec1ad7712beb29e"
			lists.push(list)
		
		trello.auth() 				
					
	$scope.gridOptions=[]
	$scope.gridOptions.columnDefs = [   ]
	$scope.gridOptions = {
	columnDefs: [
	{ field: 'list' ,resizable: true},
	{ field: 'date_created' ,type:'date'}, 	
	{ field: 'last_updated' ,type:'date'}, 	
	{ field: 'name' , width: "450",height:"50",resizable: true},   
	{ field: 'weekday_duration' ,displayName: 'Age',type:'number'}, 
	{ field: 'category' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'AV' ,value:'AV'},	 
      { id:'TECHNICIANS',value:'TECHNICIANS'},
	  { id:'ELECTRICIAN',value:'ELECTRICIAN'},
	   { id:'CONSERVATORS',value:'CONSERVATORS'},
	  { id:'EXTERNAL',value:'EXTERNAL'},
	  { id:'UNASSIGNED',value:'UNASSIGNED'}
	
    ] },
	{ field: 'type' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'SOFTWARE' ,value:'SOFTWARE'},	 
      { id:'HARDWARE',value:'HARDWARE'},
	  { id:'CONTENT',value:'CONTENT'},
	  { id:'WEAR',value:'WEAR'},
	
    ] },
	    { field: 'difficulty' ,resizable: true,type:'number'},  
	    { field: 'aknowledged',type:'date' ,resizable: true},  
		 { field: 'resolution' ,resizable: true}  
	],
	
	enableGridMenu: true,
	enableSelectAll: true,
	enableCellSelection: true,
	enableCellEditOnFocus: true,
	exporterCsvFilename: 'myFile.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	onRegisterApi: function(gridApi){
	vm.gridApi = gridApi;

	},
	pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
            // pageSizes: list of available page sizes.
            pageSizes: [250, 500, 1000], 
            //pageSize: currently selected page size. 
            pageSize: 250,
            //totalServerItems: Total items are on the server. 
            totalServerItems: 0,
            //currentPage: the uhm... current page.
            currentPage: 1
        },
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post

	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
	var query = {'id':rowEntity._id};
			Tech_support.update(query, {
					myArray
					}, function(err, affected, resp) {

var comment_text = [colDef.field] + ": " + newValue
					var data = {text:comment_text}
				
					Trello.post("cards/"+rowEntity._id+"/actions/comments",data)
					
					
			})
  });
    },
	
  };
  
 
		
	get_list = function (id,list_id,cb) {
	
		//card might have been moved to done!
		var query = {'id':id};
		Trello.get("cards/"+id+"?fields=idList,dateLastActivity", function(card) {
		Trello.get("lists/"+card.idList+"?fields=name", function(list) {
			console.log(list.name+card.dateLastActivity)
			Tech_support.update(query, {
					list:list.name,
					last_updated:card.dateLastActivity
					},cb())	
		 })
		 })
		 
	 
	 }



		$scope.rows = []
		$scope.column_headings=[]
		
	tech_get_trello_board.get_data(lists, function() {

				console.log('updated latest lists from trello')
				Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
				
				
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope._rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope._rows;
						})
						
						})
						
						})
					
}






