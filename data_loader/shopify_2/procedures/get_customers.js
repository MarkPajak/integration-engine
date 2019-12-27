var shopify_product_status_app = function (keys,options){




    var mongoose = require('mongoose');
    var dbConfig = require('../../../db');
    //mongoose.connect(dbConfig.url);	
    var load_customers = require("../load_data/load_customers.js");
   
   
   
   
    var shopify_transaction = require("../load_data/shopify_transactions.js");
    var transactions_data_to_google_sheet = require("../analyse_data/google_sheet.js");
    var Save_to_csv = require("../export_data/save_data_to_csv.js");
    //var Order_form_to_google_sheet = require("../shopify/order_form_controller.js");
    var Load_cost_of_goods = require("../load_data/load_cost_of_goods.js");
    var Monthlytotals = require("../analyse_data/monthly_totals.js");
    
    var logger = require('../../../models/logging.js');
    
    
    var load_shopify_customersInstance = new load_customers(keys,options)
    var shopify_transactionInstance = new shopify_transaction(keys,options)
    var transactions_data_to_google_sheet = new transactions_data_to_google_sheet(keys,options)
    var data_save_to_csv = new Save_to_csv(keys,options);  
    //var order_form_sheet = new Order_form_to_google_sheet(keys,options);  
    var load_cost_of_goods = new Load_cost_of_goods(keys,options);  
    var monthlytotals = new Monthlytotals(keys,options); 
    
    var async = require('async');
    
    
    this.custoemrs = []
    
    var self =this
    this.go = function(done,cb){
    
    
    
        var shopifydata
        
            function callbackhandler(err, results) {
                console.log('It came back with this ' + results);
            }   
    
            function load_customers(callback) {
                console.log('>>>>>>>>>>>getting customers')
                load_shopify_customersInstance.get_customers( function(donex) {
                    console.log('getting customers callback',donex)
                    self.customers=donex
                    callback(null,donex)	
                })
            } 
    
           
    
            function save_to_csv(callback) {
            
                console.log('>>>>>>>>>>>add_data_to_sheet')
                data_save_to_csv.save_csv( self.customers,function(analytics_data) {
                    console.log('add_data_to_sheet callback')
                    callback(null,analytics_data)	
                })
            }  

            function monthly_totals(callback) {
                        
            console.log('>>>>>>>>>>>monthly_totals')
            monthlytotals.get_vendor_ids(keys,function(){
                console.log('ssmonthly_totals callback')
                        callback(null)	
    
                        })
            }  
            
    
            async.series([
                //count_all_products,
                //cost_of_goods,
                load_customers,
               // get_data,//,
                save_to_csv
                //add_data_to_sheet,
                //monthly_totals
                //order_form_to_google_sheet
                
            ], function (err, results) {
            
                done(shopifydata)
                if(err) console.log(err)
                });
    
    }
    
    
    
    
    }
    
    
    module.exports = shopify_product_status_app;
    
    
    
    
    