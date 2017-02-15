
var Process_shopify_recent_product_analytics = require("./last_n_days.js");
var moment = require('moment');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

var selected_set = 0

var optionset = []
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-7, 'days').format()
	options.title = "last_7_days"
	console.log('options.created_at_min',options.created_at_min)
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-14, 'days').format()
	options.title = "last_14_days"
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-1, 'month').format()
	options.title = "last_month"
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-1, 'year').format()
	options.title = "last_year"
optionset.push(options)


var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,optionset[selected_set])