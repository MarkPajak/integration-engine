exports.donorsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-donors/kpi-form-and-data.html'
  }
}

exports.donorsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-donors/dashboard.html'
  }
  }	



exports.monthlyDonationsdonors = function() {
      return {    
         controller: 'monthly_donors_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationsdonors = function() {
        return {
           controller: 'raw_donors_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



exports.recordDonationsdonors  = function() {
         return {
             controller: 'donations_donors_performance_form',
            templateUrl: './components/performance/donations-donors/kpi-form.html'
      }
    }


  