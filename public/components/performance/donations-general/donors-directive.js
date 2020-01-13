exports.donationsgeneralFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-general/kpi-form-and-data.html'
  }
}

exports.donationsgeneralDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-general/dashboard.html'
  }
  }	



exports.monthlyDonationsgeneral = function() {
      return {    
         controller: 'monthly_donationsgeneral_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationsgeneral = function() {
        return {
           controller: 'raw_donationsgeneral_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



exports.recordDonationsgeneral  = function() {
         return {
             controller: 'donations_general_performance_form',
            templateUrl: './components/performance/donations-general/kpi-form.html'
      }
    }


  