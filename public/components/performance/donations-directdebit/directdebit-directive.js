exports.directdebitFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/donations-directdebit/kpi-form-and-data.html'
  }
}

exports.directdebitDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations-directdebit/dashboard.html'
  }
  }	

exports.monthlyDonationsdirectdebit = function() {
      return {    
         controller: 'monthly_directdebit_controller',
         templateUrl: './shared/templates/data_table.html'
      }
  }

exports.rawDonationsdirectdebit = function() {
        return {
           controller: 'raw_directdebit_controller',
           templateUrl: './shared/templates/data_table.html'
        }
}



  

exports.recordDonationsdirectdebit  = function() {
         return {
             controller: 'donations_directdebit_performance_form',
            templateUrl: './components/performance/donations-directdebit/kpi-form.html'
      }
    }


  