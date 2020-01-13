exports.onlineFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-online/kpi-form-and-data.html'
  }
}

exports.onlineDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-online/dashboard.html'
  }
  }	

exports.monthlyDonationsonline = function() {
      return {    
         controller: 'monthly_online_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationsonline = function() {
        return {
           controller: 'raw_online_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



  

exports.recordDonationsonline  = function() {
         return {
             controller: 'donations_online_performance_form',
            templateUrl: './components/performance/donations-online/kpi-form.html'
      }
    }


  