



exports.kpihomeDashboard = function() {

  return {
	  
	  controller: 'kpi_home_controller',
   templateUrl: './components/performance/home/kpi_dashboard.html'
  }
  }
  
  
exports.dateSelect = function() {

  return {
	  
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/date_select.html'
  }
  }

		
		exports.pieChart = function() {
  return {
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/pie_chart.html'
  }
  }

		exports.lineChart = function() {
  return {
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/line_chart.html'
  }
  }	
  			exports.learningDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/retail/dashboard.html'
  }
	}

	exports.learningFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/learning/kpi-form-and-data.html'
  }
  }
	
		exports.rawLearning = function() {
  return {
   controller: 'raw_learning_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
exports.yearlyLearning = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		
		exports.recordLearning = function() {
  return {
   controller: 'record_learning_controller',
      templateUrl: './components/performance/learning/kpi-form.html'
  }
	}
	
		exports.monthlyLearning = function() {
  return {
   controller: 'monthly_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	
			
		
		
		exports.ageLearning = function() {
  return {
   controller: 'age_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	

			exports.retailDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/retail/dashboard.html'
  }
	}	
	
				exports.exhibitionspwytDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/exhibitions-pwyt/dashboard.html'
  }
	}
		
		
			exports.learningDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/learning/dashboard.html'
  }
	}	

			exports.visitsDashboard = function() {
  return {
 controller: 'dashboard_controller',
    templateUrl: './components/performance/visits/dashboard.html'
  }
	}	
	
				exports.donationsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations/dashboard.html'
  }
	}	
	
		
		
exports.welcomedeskFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/welcome-desk/kpi-form-and-data.html'
  }
}
	
exports.rawWelcomedesk = function() {
  return {
   controller: 'raw_welcomedesk_controller',
     templateUrl: './shared/templates/data_table.html'
  }
}

exports.dataWelcomedesk = function() {
  return {

    templateUrl: './components/performance/welcome-desk/data.html'
  }
}

exports.dataExhibitionspwyt = function() {
  return {

    templateUrl: './components/performance/exhibitions-pwyt/data.html'
  }
}

	
						exports.welcomedeskDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/welcome-desk/dashboard.html'
  }
	}	
	

	
exports.recordWelcomedesk = function() {
  return {
   controller: 'record_welcomedesk_controller',
      templateUrl: './components/performance/welcome-desk/kpi-form.html'
  }
}
exports.yearlyWelcomedesk = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'yearly_welcomedesk_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}	
	
exports.monthlyWelcomedesk = function() {
  return {
   controller: 'monthly_welcomedesk_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}	

exports.rawVisits = function() {
 return {
     controller: 'raw_visitor_numbers_controller',
     templateUrl: './shared/templates/data_table.html'
  }
}
	
exports.monthlyVisits = function() {
  return {
   controller: 'monthly_visitor_numbers_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}
	

				exports.yearlyVisits = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_visitor_numbers_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
exports.giftaidFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/gift-aid/kpi-form-and-data.html'
  }
 }
	
		exports.rawGiftaid = function() {
  return {
   controller: 'raw_giftaid_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
exports.dataGiftaid = function() {
  return {
 //  controller: 'raw_welcomedesk_controller',
    templateUrl: './components/performance/gift-aid/data.html'
  }
}

	
	
		
		exports.recordGiftaid = function() {
  return {
   controller: 'record_giftaid_controller',
      templateUrl: './components/performance/gift-aid/kpi-form.html'
  }
	}
	
			exports.monthlyAllgiftaid = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'monthly_all_giftaid_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyGiftaid = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'monthly_giftaid_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
					exports.yearlyDonations = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_donations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.rawDonations = function() {
  return {
   controller: 'raw_donations_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
exports.dataDonations = function() {
  return {
 //  controller: 'raw_welcomedesk_controller',
    templateUrl: './components/performance/donations/data.html'
  }
}

	
	
		exports.monthlyDonations = function() {
  return {
   controller: 'monthly_donations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
	exports.rawTurnstiles = function() {
  return {
   controller: 'raw_turnstiles_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyTurnstiles = function() {
  return {
   controller: 'monthly_turnstiles_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	

	exports.recordDonations = function() {
  return {
   controller: 'donations_performance_form',
    templateUrl: './components/performance/donations/kpi-form.html'
  }
}
exports.donationsFormdata = function() {
  return {

   templateUrl: './components/performance/donations/kpi-form-and-data.html'
  }
}

	
exports.kpiForm = function() {
  return {
   controller: 'visits_form',
    templateUrl: './components/performance/visits/kpi-form.html'
  }
}



exports.visitsFormdata = function() {
  return {

   templateUrl: './components/performance/visits/kpi-form-and-data.html'
  }
}

exports.retailFormdata = function() {
  return {
  
    templateUrl: './components/performance/retail/kpi-form-and-data.html'
  }
}


exports.retailKpiform = function() {
  return {
   controller: 'retail_performance_form',
    templateUrl: './components/performance/retail/kpi-form.html'
  }
}

					exports.yearlyRetailsales = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_retail_sales_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}

	exports.rawRetailsales = function() {
  return {
   controller: 'raw_retail_sales_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.rawRetailsalesfilter = function() {
  return {
    templateUrl: './components/performance/retail/raw-retail-data.html'
  }
	}
	
	
exports.monthlyRetailsales = function() {
  return {
   controller: 'monthly_retail_sales_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
	
	
	exports.exhibitionspwytFormdata = function() {
  return {
  
    templateUrl: './components/performance/exhibitions-pwyt/kpi-form-and-data.html'
  }
}


exports.recordExhibitionspwyt  = function() {
  return {
   controller: 'exhibitions_pwyt_performance_form',
    templateUrl: './components/performance/exhibitions-pwyt/kpi-form.html'
  }
}

		exports.monthlyExhibitionspwyt = function() {
  return {
  	    restrict: "E",
    scope: {},
   controller: 'monthly_exhibitions_pwyt_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}

	exports.rawExhibitionspwyt = function() {
  return {
   controller: 'raw_exhibitions_pwyt_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}

	
	
		exports.tegFormdata = function() {
  return {
  
    templateUrl: './components/performance/gallery-visits/kpi-form-and-data.html'
  }
}


exports.recordTeg  = function() {
  return {
   controller: 'teg_performance_form',
    templateUrl: './components/performance/gallery-visits/kpi-form.html'
  }
}

	

	exports.rawTeg = function() {
  return {
   controller: 'raw_teg_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyTeg = function() {
  return {

   controller: 'monthly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
				exports.exhibitionsTeg = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'exhibitions_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.yearlyTeg = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
			exports.weeklyTeg = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'weekly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.tegDashboard = function() {
  return {
     controller: 'dashboard_controller',
    templateUrl: './components/performance/gallery-visits/dashboard.html'
  }
	}
			
		exports.yearlyEvents = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_events_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		
		exports.monthlyEvents = function() {
  return {
   controller: 'monthly_events_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
			exports.eventsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/events/kpi-form-and-data.html'
  }
  }
  
  			exports.kpieventsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/kpi-events/kpi-form-and-data.html'
  }
  }
  
			exports.rawEventsfilter = function() {
  return {
    templateUrl: './components/performance/events/raw-events-data.html'
  }
	}
	
				exports.rawKpieventsfilter = function() {
  return {
    templateUrl: './components/performance/kpi-events/raw-events-data.html'
  }
	}
	
			exports.rawKpievents = function() {
  return {

         restrict: "E",
		
		   
   scope: {
		user: '='
		
        },
		
   controller: 'raw_kpi_events_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.monthlyKpievents = function() {
  return {
  
 restrict: "E",

	   
   scope: {
		user: '='
        },
		
   controller: 'monthly_kpi_events_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.rawEvents = function() {
  return {
   controller: 'raw_events_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
exports.communityEvents = function() {

  return {
  	    restrict: "E",
    scope: {},
   controller: 'yearly_participation_controller',
     templateUrl: './shared/templates/data_table.html'
  }
  
}
exports.targetAudience = function() {

  return {
  	    restrict: "E",
    scope: {},
   controller: 'target_audience_controller',
     templateUrl: './shared/templates/data_table.html'
  }
  
}	

		exports.recordKpievents = function() {
  return {
   controller: 'record_kpi_events_controller',
      templateUrl: './components/performance/kpi-events/kpi-form.html'
  }
	}
	
	
		
		exports.recordEvents = function() {
  return {
   controller: 'record_events_controller',
      templateUrl: './components/performance/events/kpi-form.html'
  }
	}
	
	exports.eventsDashboard = function() {
  return {
     controller: 'dashboard_controller',
    templateUrl: './components/performance/events/dashboard.html'
  }
	}
	
		exports.participationDashboard = function() {
  return {
     controller: 'dashboard_controller',
    templateUrl: './components/performance/participation/dashboard.html'
  }
	}
	
	
	
		exports.monthlyOperations = function() {
  return {
   controller: 'monthly_operations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	
	
			exports.operationsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/operations/kpi-form-and-data.html'
  }
  }
	
		exports.rawOperations = function() {
  return {
   controller: 'raw_operations_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
		exports.recordOperations = function() {
  return {
   controller: 'record_operations_controller',
      templateUrl: './components/performance/operations/kpi-form.html'
  }
	}
	

				exports.yearlyOperations = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_operations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
					exports.operationsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/operations/dashboard.html'
  }
	}	
	

	
						exports.exhibitionsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/exhibitions/dashboard.html'
  }
	}	
	
exports.giftaidDashboard = function() {
  return {
    controller: 'dashboard_controller',
    templateUrl: './components/performance/gift-aid/dashboard.html'
  }
	}	
		
	
			
	exports.exhibitionsSummary = function() {
  return {
  	    restrict: "E",
    scope: {},
   controller: 'exhibitions_summary_controller',
  templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
						exports.analyserDashboard = function() {
  return {
    controller: 'analyser_controller',
    templateUrl: './components/performance/analyser/dashboard.html'
  }
	}	
	
	
