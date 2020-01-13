module.exports = function (app) {

    var directives = require('../shared/directives/directives');
    var timeline_settings_directives = require('../components/timeline-settings/timeline-settings-directive');
    var tech_support_directives = require('../components/tech-support/tech-support-directive');
    var users_directives = require('../components/user-admin/users-directive');
    var timeline_directives = require('../components/timeline/timeline-directive');
    var shopify_directives = require('../components/shopify/shopify-directive');
    var performance_directives = require('../components/performance/performance-directive');
    var iframe_directives = require('../components/iframe/iframe-directive');
    var turnstiles_directives = require('../components/turnstiles/turnstiles-directive');
    var resources_directives = require('../components/resource-bookings/directive');
    var giftaid_directives = require('../components/gift-aid/customers-directive');
    var directdebit_directives = require('../components/performance/donations-directdebit/directdebit-directive');
    var treasure_directives = require('../components/performance/donations-treasure/treasure-directive');
    var donors_directives = require('../components/performance/donations-donors/donors-directive');
    var donors_trusts = require('../components/performance/donations-trusts/trusts-directive');
    var donors_online = require('../components/performance/donations-online/online-directive');
    var donors_general = require('../components/performance/donations-general/donors-directive');




    var directiveArray=[
      timeline_settings_directives,
      directives,
      tech_support_directives,
      users_directives,
      timeline_directives,
      shopify_directives,
      performance_directives,
      iframe_directives,
      turnstiles_directives,
      resources_directives,
      giftaid_directives,
      directdebit_directives,
      treasure_directives,
      donors_directives,
      donors_trusts,
      donors_online,
      donors_general
    ]

  _.each(directiveArray, function(directives, names) {
    _.each(directives, function(directive, name) {
    app.directive(name, directive);
    });
});

  
    return module;
};