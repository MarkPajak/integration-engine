var mongoose = require('mongoose');
var dbConfig = require('../../db');
mongoose.connect(dbConfig.url);	
var shopify_transaction = require("./shopify_transactions.js");
var transactions_data_to_google_sheet = require("./google_sheet.js");
var moment = require('moment');

var optionset = []
	var options = []
	options.created_at_min =  moment(new Date()).add(-7, 'days').format()
	options.title = "last_7_days"
	console.log('options.created_at_min',options.created_at_min)
optionset.push(options)
	var options = []
	options.created_at_min =  moment(new Date()).add(-14, 'days').format()
	options.title = "last_14_days"
optionset.push(options)
	var options = []
	options.created_at_min =  moment(new Date()).add(-1, 'month').format()
	options.title = "last_month"
optionset.push(options)
	var options = []
	options.created_at_min =  moment(new Date()).add(-1, 'year').format()
	options.title = "last_year"
optionset.push(options)


var selected_set = 3

var shopify_transactionInstance = new shopify_transaction(optionset[selected_set])
 
 shopify_transactionInstance.count_all_orders( function(done) {
	 //n.b. triggered via an async callback	
	 console.log('shopify_transactionInstance callback')
	
	 var save_data_to_google_sheetInstance = new transactions_data_to_google_sheet(optionset[selected_set])
	  console.log('save_data_to_google_sheetInstance callback')
	
	 save_data_to_google_sheetInstance.get_data()
	   
 });
 
 
 
  





 
 
