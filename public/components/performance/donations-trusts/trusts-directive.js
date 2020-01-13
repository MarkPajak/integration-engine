exports.trustsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-trusts/kpi-form-and-data.html'
  }
}

exports.trustsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-trusts/dashboard.html'
  }
  }	

exports.monthlyDonationstrusts = function() {
      return {    
         controller: 'monthly_trusts_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationstrusts= function() {
        return {
           controller: 'raw_trusts_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



  

exports.recordDonationstrusts  = function() {
         return {
             controller: 'donations_trusts_performance_form',
            templateUrl: './components/performance/donations-trusts/kpi-form.html'
      }
    }


  