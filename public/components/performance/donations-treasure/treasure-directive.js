exports.treasureFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-treasure/kpi-form-and-data.html'
  }
}

exports.treasureDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-treasure/dashboard.html'
  }
  }	

exports.monthlyDonationstreasure = function() {
      return {    
         controller: 'monthly_treasure_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationstreasure = function() {
        return {
           controller: 'raw_treasure_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



  

exports.recordDonationstreasure  = function() {
         return {
             controller: 'donations_treasure_performance_form',
            templateUrl: './components/performance/donations-treasure/kpi-form.html'
      }
    }


  