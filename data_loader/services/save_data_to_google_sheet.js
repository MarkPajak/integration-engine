var save_data_to_google_sheet = function (options){
var self = this;
 
 var async = require('async');
  var moment = require('moment');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('underscore');
  var doc = new GoogleSpreadsheet( options.google_sheet_id);
 var duplicate = false

var sheet_name = options.title+"_"+moment(new Date()).format('DD_MM_YYYY')


self.add_data_to_sheet = function(google_data){
var selected_sheet;
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('../../secret/google_drive.json');
  
    doc.useServiceAccountAuth(creds, step);
  },
   function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
     
	   
	  _.each(info.worksheets,function(sheet) {
		if(sheet.title==sheet_name)  {
		console.log('sheet exists')
		 duplicate = true
		 selected_sheet=sheet
		 step();
		}		//async 
	  })
   	if(duplicate==false){
         doc.addWorksheet({
      title: sheet_name
    }, function(err, sheet) {
	console.log('sheet addWorksheet')
  selected_sheet = sheet
  //sheet =info.worksheets[i];
	console.log('adding to sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
	   }  
     
    });
  },
  


   function clear_sheet(step) {
   if(duplicate==true){
			console.log('clear_sheet ')
		 selected_sheet.clear( function(){setTimeout(function(){step() }, 2000)})
	}
	else
	{
		step() 
	}

   
   },
     function resize_sheet(step) {
	 console.log('resize sheet')
	  if(duplicate==true){
			console.log('clear_sheet ')
   selected_sheet.resize([1000,30], function(){setTimeout(function(){step() }, 2000)})
		} else
		 {
	step() 
	}
   },
     function setHeaderRow(step) {
console.log('addig headsers')
		 var headers = []
		 headers.push("product_type")
		 headers.push("price")
		 headers.push("sales_value")
		 headers.push("name")
		 headers.push("count")	
		 headers.push("inventory_quantity")
		 headers.push("order_status")
		 headers.push("barcode")
		 headers.push("sku")
		  headers.push("vendor")
		 headers.push("date_report_run")
		
		selected_sheet.setHeaderRow(headers, function(){setTimeout(function(){step() }, 2000)})
   },
 
  function workingWithRows(step) {
   console.log('workingWithRows')
	
			var i=0
			iterate()
			function iterate(){
				
				if(i<=google_data.length){
					if(	google_data[i]){			
						selected_sheet.addRow(google_data[i])
					setTimeout(function(){iterate() }, 1000);
					i++
					}
				}
				else{
				
				}
			}
			
			
  }

]);

}

}

module.exports = save_data_to_google_sheet;