

module.exports = function(config) {
  config.set({
    files: [
'../node_modules/jquery/dist/jquery.js',
'../node_modules/jqueryui/jquery-ui.min.js',
'../node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
'../node_modules/angular/angular.js',
'../node_modules/angular-animate/angular-animate.js',
'../node_modules/angular-route/angular-route.js',
'../node_modules/angular-resource/angular-resource.js',
'../node_modules/angular-utils-pagination/dirPagination.js',
'../node_modules/angular-aria/angular-aria.min.js',
'../node_modules/ng-scrollbar/dist/ng-scrollbar.min.js',
'../node_modules/angular-material/angular-material.js',
'../node_modules/angular-sanitize/angular-sanitize.min.js',
'../node_modules/angular-mocks/angular-mocks.js',
'../node_modules/angulargrid/angulargrid.min.js',
'../node_modules/underscore/underscore.js',
'../node_modules/api-check/dist/api-check.min.js',
'../node_modules/angular-formly/dist/formly.min.js',
'../node_modules/bootstrap-daterangepicker/moment.min.js',
'../node_modules/bootstrap-daterangepicker/daterangepicker.js',
'../lib/angular-daterangepicker.js',
'../node_modules/angular-ui-router/release/angular-ui-router.js',
'../lib/md5.js',
'../node_modules/angular-bootstrap/ui-bootstrap.min.js',
'../node_modules/chart.js/dist/Chart.js',
'../lib/angular-chart.js',
'../node_modules/sweetalert/dist/sweetalert.min.js',
'../lib/sweetalert.multi.js',
'../node_modules/sweetalert/dist/sweetalert.css',
'../node_modules/vis/dist/vis.js',
'../node_modules/angular-dragdrop/src/angular-dragdrop.min.js',
'../node_modules/angular-ui-grid/ui-grid.js',
'../node_modules/angular-material-data-table/dist/md-data-table.min.js',
'../node_modules/angular-cookies/angular-cookies.min.js',
'../node_modules/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',

'./test-directive.js',
'../public/bin/core.js',
    ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Google Chrome']
  });
};
