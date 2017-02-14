var save_data_to_google_sheet = function (options){
var self = this;
 
 
 
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('underscore');
// spreadsheet key is the long id in the sheets URL
 //var doc = new GoogleSpreadsheet('16xVCAAGMeO8JpMG3xefqztrOMCFFVoLuv2jB1UGGQLY');

var doc = new GoogleSpreadsheet('1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0');
var sheet;



self.add_data_to_sheet = function(google_data){

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('../../secret/google_drive.json');
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      
	  	  
	  _.each(info.worksheets, function(sheetx,i) {
		  if(sheetx.title == options.title){
				sheet =info.worksheets[i];
				console.log('adding to sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
		  }
	  })

       step()
    });
	
  },
  
   function clear_sheet(step) {
    console.log('clear_sheet ')
   sheet.clear( function(){setTimeout(function(){step() }, 250)})
   
   },
     function resize_sheet(step) {
	 console.log('resize sheet')
    sheet.resize([1000,30], function(){setTimeout(function(){step() }, 2000)})
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
		 headers.push("date_report_run")
		
		sheet.setHeaderRow(headers, function(){setTimeout(function(){step() }, 2000)})
   },
 
  function workingWithRows(step) {
   console.log('workingWithRows')
	
			var i=0
			iterate()
			function iterate(){
				
				if(i<=google_data.length){
					if(	google_data[i]){			
						sheet.addRow(google_data[i])
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