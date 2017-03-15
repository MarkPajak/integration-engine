var order_forms_to_google_sheet = function (options){
var self = this;
 
 
var async = require('async');
var moment = require('moment');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('underscore');
var doc = new GoogleSpreadsheet( options.google_sheet_id);
var duplicate = false
var logger = require('../../models/logging.js');


self.add_data_to_sheet = function(keys,all_google_data,alldone){

var i=0

function done (){

if(i<=all_google_data.length){
i++
do_one(all_google_data[i])

}
else{
alldone()
}
}
done()


function do_one(google_data){
var sheet_name = "order_form_"+google_data._id//+"_"+moment(new Date()).format('DD_MM_YYYY')

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
     		var log = new logger({								
								date:  moment(new Date()).format(),
								username:keys.user,
								message: 'Loaded doc: '+info.title+' by '+info.author.email					
						});	
						log.save(function (err) {})
	   
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
	 if(sheet){
  selected_sheet = sheet
  //sheet =info.worksheets[i];
 
	console.log('adding to sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
	  }
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
			console.log('clear_sheet')
   selected_sheet.resize([1000,30], function(){setTimeout(function(){step() }, 2000)})
		} else
		 {
	step() 
	}
   },
     function setHeaderRow(step) {
		console.log('headers')
		 var headers = []
		 headers.push("order_status")
		 headers.push("name")
		 headers.push("count")
		 headers.push("sku")
		 headers.push("barcode")
		 headers.push("box_quantity")
		 headers.push("quantity")	
		
		selected_sheet.setHeaderRow(headers, function(){setTimeout(function(){step() }, 2000)})
   },
 
  function workingWithRows(step3) {
  
	products=google_data.products
	 console.log('workingWithRows',products)
			var i=0
			iterate()
			function iterate(){
				
				if(i<=products.length){
					if(	products[i]){			
						selected_sheet.addRow(products[i])
					setTimeout(function(){iterate() }, 1000);
					i++
					}
					else{				
						step()
						}
				}
				else{				
				done
				}
			}
			
			
  }


]

 
);

}

}

}

module.exports = order_forms_to_google_sheet;