//gets list of all products from shopify and adds them to database
var load_shopify_customers = function (keys,options){
    // NB variant=post.variants[0] assumption that multipekl variants not importent
    var async = require('async')
    var express = require('express');
    var router = express.Router();
    var shopifyAPI = require('shopify-node-api');
    var request = require('request');
    var moment = require('moment');
    var _ = require('underscore');
    var shop_id = keys.shopify_store
    var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+shop_id+"/admin/"
    call_date = moment(new Date()).add(-10, 'days').format("YYYY-MM-DD")
    var Gift_aid_customer = require('../../../models/shopify/Gift_aid_customer.js');
    var dbConfig = require('../../../db');
    //var mongoose = require('mongoose');
    // Connect to DB
    //mongoose.connect(dbConfig.url);
     var self=this
    var logger = require('../../../models/logging.js');
  

    function unquote(value) {
        if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"') return value.substring(1, value.length - 1);
        return value;
    }

    
    var nextpage


  
    function product_type_from_id(item,order){
        
    
    }

    var allcustomers=[]
    
    function customers(cb){
        
        
        var page = 500
        var limit = 200
        var pages_in_total = 5
        var current_page = 0
      
     
        url = url_base+"api/2019-10/customers.json?limit=250&query=note:%23"
      
        
        function getNextset(url) {
      
                
                var return_product_type = ""
               

                request({
                    url:url ,
                     json: true
                }, function (error, response, body) {
                if (error ) console.log(error)
         
             
                    if (!error && response.headers.link) {

                        

                    _.each(response.headers.link.split(","),function(row){
                        
                            if(row.split(";")[1].trim()=='rel="next"'){                               
                                url=row.split(";")[0].replace("<","").replace(">","").trim().replace("https://bristol-museums-shop.myshopify.com",url_base).replace("admin//","/")
                                 nextpage=true
                                }
                    })

                    async.forEach( body.customers, function(_customer,cbb) { 
                      
                            var customer={}
                            if(_customer.note!=null && _customer.note!="" ) {
                             
                                customer._id=_customer.id
                                    customer.first_name=_customer.first_name
                                    customer.last_name=_customer.last_name
                                    customer.note=_customer.note
                                    customer.house="NONE"
                                    customer.email=_customer.email
                                    customer.post_code="NONE"                                    
                                    customer.date =_customer.updated_at
                                  
                                    customer.last_order_id=_customer.last_order_id
                                    customer.last_order_url="https://bristol-museums-shop.myshopify.com/admin/orders/"+_customer.last_order_id 
                                   _last_order_url=url_base + "api/2019-10/orders/" +_customer.last_order_id +".json"
                                    if(_customer.addresses[0]){

                                        customer.house=_customer.addresses[0].address1
                                        customer.post_code=_customer.addresses[0].zip
                                    }
                                  
                                    customer.order=""
                                    customer.donation_amount=""
                                    request({
                                        url:  _last_order_url ,
                                         json: true
                                    }, function (_error, _response, _body) {
                                   
                                   if(_error) console.log(_error)
                                       
        
                                   if(_body.order){

                                    customer.date = _body.order.created_at  

                                     _.each(_body.order.line_items,function(row){    
                                               
                                       
                                        if( row.title.toLowerCase().indexOf("donation") !=-1 ){

                                            customer.donation_amount= row.quantity * row.price 
                                        
                                        }
                                         customer.order=  customer.order.concat( row.title + " * " +row.quantity+" | " )                                    
                                         
                                    })
                                }
                                
                                  allcustomers.push(customer)
                                  setTimeout(function (){
                                  cbb()
                                }, 1000);

                            })
                       
                            }
                            else{

                                cbb()
                            }
                     })
                   

             
                    if(body.customers.length!=0 &&  nextpage==true){
                        nextpage=false
                      
                        console.log(current_page)
                     setTimeout(function (){
						
							current_page++
					
						
                      
                        getNextset(url);
                    }, 2500);
                            
                        }      else      {
                        console.log('max reached',allcustomers)
                        cb(allcustomers)
                        }
                    }
                    
                })	
            }
                 
   getNextset(url)		
    
    }			
    
    
    self.get_customers = function(cb2){
    
        customers(cb2)
    
    }
    
    }
    
    module.exports = load_shopify_customers;
    