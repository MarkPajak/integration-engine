'use strict';
/* app */
var underscore = angular.module('underscore', []);
var _ = require('underscore');

var async = require('async');

underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);


var app = angular.module('app', [

    'ng',
    'ui.select',
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ngSanitize', //,
    'angularUtils.directives.dirPagination',
    'underscore', //,
    'ngScrollbar',
    'ngMaterial',
    'angularGrid',
    "ngSanitize",
    'formly',
    'formlyBootstrap',
    "chart.js",
    'daterangepicker',
    'ngDragDrop',
    'md.data.table',
    'ui.router',
    'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning',
    'ui.grid.autoResize', 'ngMessages', 'material.svgAssetsCache', 'moment-picker'

])



require('../shared/app-controllers')(app);
require('../shared/app-directives')(app);
require('../shared/app-services')(app);
require('../shared/app-filters')(app);
require('../shared/app-config')(app);