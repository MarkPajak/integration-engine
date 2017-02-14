describe('techsupportDirective', function() {
  var injector;
  var element;
  var scope;

  beforeEach(function() {
	  var injector= angular.injector(['ng','ngMock','ng','app']);
	  var $location = injector.get("$location");
	
  
    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<tech-support></tech-support>')(scope);
      scope.$apply();
    });
  });

it('should have a data table', function () {
 var data_table = $('.ui-grid-icon-ok').length;
  expect(data_table.text().length>0);
 });
});

describe('timelineDirective', function() {
  var injector;
  var element2;
  var scope;

  beforeEach(function() {
	  var injector= angular.injector(['ng','ngMock','ng','app']);
	  var $location = injector.get("$location");
	
  
    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element2 = $compile('<time-line></time-line>')(scope);
      scope.$apply();
    });
  });

it('should have a timeline', function () {
 var timeline = element2.find('.vis-group')[0];
  expect(timeline=="<div class=\"vis-group\"></div>");
 });
});



//test login / views


