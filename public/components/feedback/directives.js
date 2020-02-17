exports.rawFeedback= function() {
    return {
     controller: 'raw_feedback_controller',
       templateUrl: './shared/templates/data_table.html'
    }
      }
 		exports.rawNominate = function() {
    return {
     controller: 'raw_nominate_controller',
       templateUrl: './shared/templates/data_table.html'
    }
      }
      exports.feedbackData = function() {
        return {
        // controller: 'raw_nominate_controller',
           templateUrl: './components/feedback/feedback-data.html'
        }
          }
          exports.nominateData = function() {
            return {
            // controller: 'raw_nominate_controller',
            templateUrl: './components/feedback/nominate-data.html'
              }

           
            }