
var Kpi_aggregate = require('../../models/Kpi_log.js');
var retail_sales = require('../../models/performance/Retail_sales.js');
var donation_boxes = require('../../models/performance/Donations.js');
var welcome_desk = require('../../models/performance/Welcomedesk.js');
var async = require('async');

var Monthly_stats =  require('./kpi_aggregate.js');
var Monthly_stats_dev =  require('./kpi_aggregate_dev.js');
var WelcomeDesk_stats_dev =  require('./kpi_aggregate_donations.js');

monthly_stats=new Monthly_stats(Kpi_aggregate,"visits_data",'$value' )
retail_stats=new Monthly_stats(retail_sales,"retail_sales",'$net_sales' )
retail_atv=new Monthly_stats_dev(retail_sales,"retail_data_atv") //divide on aggregate
retail_no_transactions=new Monthly_stats(retail_sales,"retail_transactions",'$no_transactions' )
donations=new Monthly_stats(donation_boxes,"donation_boxes",'$donation_box_amount' )

welcome_desk_go=new WelcomeDesk_stats_dev(welcome_desk,"welcome_desk") //sum on aggregate

function callbackhandler(err, results) {
			console.log('It came back with this ' + results);
		} 
		
		
		function _monthly_stats(callback) {
			console.log('>>>>>>>>>>>monthly_stats')
			monthly_stats.go(function(){
		
				callback()	
			})
		} 

			function _retail_stats(callback) {
			console.log('>>>>>>>>>>>retail_stats')
			retail_stats.go(function(){
					
				callback()	
			})
		}
		
			function _donations(callback) {
			console.log('>>>>>>>>>>>_donations')
			donations.go(function(){
					
				callback()	
			})
		}
		
			function _welcome_desk_go(callback) {
			console.log('>>>>>>>>>>>_welcome_desk_go')
			welcome_desk_go.go(function(){
					
				callback()	
			})
		}

	function _retail_atv(callback) {
			console.log('>>>>>>>>>>>retail_atv')
			retail_atv.go(function(){
		
				callback()	
			})
		}

	function _retail_no_transactions(callback) {
			console.log('>>>>>>>>>>>retail_no_transactions')
			retail_no_transactions.go(function(){
		
				callback()	
			})
		}		
		

	
		async.series([
			_monthly_stats//,
			//_retail_stats,
			//_retail_atv,
			//_retail_no_transactions,
			//_donations,
			//_welcome_desk_go
			
			
		], function (err, results) {
		
			
			if(err) console.log(err)
			});	