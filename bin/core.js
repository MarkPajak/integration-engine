(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * @license AngularJS v1.6.1
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* global ngTouchClickDirectiveFactory: false */

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

ngTouch.provider('$touch', $TouchProvider);

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

/**
 * @ngdoc provider
 * @name $touchProvider
 *
 * @description
 * The `$touchProvider` allows enabling / disabling {@link ngTouch.ngClick ngTouch's ngClick directive}.
 */
$TouchProvider.$inject = ['$provide', '$compileProvider'];
function $TouchProvider($provide, $compileProvider) {

  /**
   * @ngdoc method
   * @name  $touchProvider#ngClickOverrideEnabled
   *
   * @param {boolean=} enabled update the ngClickOverrideEnabled state if provided, otherwise just return the
   * current ngClickOverrideEnabled state
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   *
   * @kind function
   *
   * @description
   * Call this method to enable/disable {@link ngTouch.ngClick ngTouch's ngClick directive}. If enabled,
   * the default ngClick directive will be replaced by a version that eliminates the 300ms delay for
   * click events on browser for touch-devices.
   *
   * The default is `false`.
   *
   */
  var ngClickOverrideEnabled = false;
  var ngClickDirectiveAdded = false;
  // eslint-disable-next-line no-invalid-this
  this.ngClickOverrideEnabled = function(enabled) {
    if (angular.isDefined(enabled)) {

      if (enabled && !ngClickDirectiveAdded) {
        ngClickDirectiveAdded = true;

        // Use this to identify the correct directive in the delegate
        ngTouchClickDirectiveFactory.$$moduleName = 'ngTouch';
        $compileProvider.directive('ngClick', ngTouchClickDirectiveFactory);

        $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
          if (ngClickOverrideEnabled) {
            // drop the default ngClick directive
            $delegate.shift();
          } else {
            // drop the ngTouch ngClick directive if the override has been re-disabled (because
            // we cannot de-register added directives)
            var i = $delegate.length - 1;
            while (i >= 0) {
              if ($delegate[i].$$moduleName === 'ngTouch') {
                $delegate.splice(i, 1);
                break;
              }
              i--;
            }
          }

          return $delegate;
        }]);
      }

      ngClickOverrideEnabled = enabled;
      return this;
    }

    return ngClickOverrideEnabled;
  };

  /**
  * @ngdoc service
  * @name $touch
  * @kind object
  *
  * @description
  * Provides the {@link ngTouch.$touch#ngClickOverrideEnabled `ngClickOverrideEnabled`} method.
  *
  */
  // eslint-disable-next-line no-invalid-this
  this.$get = function() {
    return {
      /**
       * @ngdoc method
       * @name  $touch#ngClickOverrideEnabled
       *
       * @returns {*} current value of `ngClickOverrideEnabled` set in the {@link ngTouch.$touchProvider $touchProvider},
       * i.e. if {@link ngTouch.ngClick ngTouch's ngClick} directive is enabled.
       *
       * @kind function
       */
      ngClickOverrideEnabled: function() {
        return ngClickOverrideEnabled;
      }
    };
  };

}

/* global ngTouch: false */

    /**
     * @ngdoc service
     * @name $swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  var POINTER_EVENTS = {
    'mouse': {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    'touch': {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel'
    },
    'pointer': {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
      cancel: 'pointercancel'
    }
  };

  function getCoordinates(event) {
    var originalEvent = event.originalEvent || event;
    var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
    var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function getEvents(pointerTypes, eventType) {
    var res = [];
    angular.forEach(pointerTypes, function(pointerType) {
      var eventName = POINTER_EVENTS[pointerType][eventType];
      if (eventName) {
        res.push(eventName);
      }
    });
    return res.join(' ');
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     * The pointer types that should be used can be specified via the optional
     * third argument, which is an array of strings `'mouse'`, `'touch'` and `'pointer'`. By default,
     * `$swipe` will listen for `mouse`, `touch` and `pointer` events.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }` and the raw
     * `event`. `cancel` receives the raw `event` as its single parameter.
     *
     * `start` is called on either `mousedown`, `touchstart` or `pointerdown`. After this event, `$swipe` is
     * watching for `touchmove`, `mousemove` or `pointermove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove`, `touchmove` and `pointermove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend`, `mouseup` or `pointerup`.
     *
     * `cancel` is called either on a `touchcancel` or `pointercancel`  from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, pointerTypes) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      pointerTypes = pointerTypes || ['mouse', 'touch', 'pointer'];
      element.on(getEvents(pointerTypes, 'start'), function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        if (eventHandlers['start']) {
          eventHandlers['start'](startCoords, event);
        }
      });
      var events = getEvents(pointerTypes, 'cancel');
      if (events) {
        element.on(events, function(event) {
          active = false;
          if (eventHandlers['cancel']) {
            eventHandlers['cancel'](event);
          }
        });
      }

      element.on(getEvents(pointerTypes, 'move'), function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          if (eventHandlers['cancel']) {
            eventHandlers['cancel'](event);
          }
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          if (eventHandlers['move']) {
            eventHandlers['move'](coords, event);
          }
        }
      });

      element.on(getEvents(pointerTypes, 'end'), function(event) {
        if (!active) return;
        active = false;
        if (eventHandlers['end']) {
          eventHandlers['end'](getCoordinates(event), event);
        }
      });
    }
  };
}]);

/* global ngTouch: false,
  nodeName_: false
*/

/**
 * @ngdoc directive
 * @name ngClick
 * @deprecated
 * sinceVersion="v1.5.0"
 * This directive is deprecated and **disabled** by default.
 * The directive will receive no further support and might be removed from future releases.
 * If you need the directive, you can enable it with the {@link ngTouch.$touchProvider $touchProvider#ngClickOverrideEnabled}
 * function. We also recommend that you migrate to [FastClick](https://github.com/ftlabs/fastclick).
 * To learn more about the 300ms delay, this [Telerik article](http://developer.telerik.com/featured/300-ms-click-delay-ios-8/)
 * gives a good overview.
 *
 * @description
 * A more powerful replacement for the default ngClick designed to be used on touchscreen
 * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
 * the click event. This version handles them immediately, and then prevents the
 * following click event from propagating.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * This directive can fall back to using an ordinary click event, and so works on desktop
 * browsers as well as mobile.
 *
 * This directive also sets the CSS class `ng-click-active` while the element is being held
 * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <example module="ngClickExample" deps="angular-touch.js" name="ng-touch-ng-click">
      <file name="index.html">
        <button ng-click="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </file>
      <file name="script.js">
        angular.module('ngClickExample', ['ngTouch']);
      </file>
    </example>
 */

var ngTouchClickDirectiveFactory = ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
  var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
  var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
  var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
  var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

  var ACTIVE_CLASS_NAME = 'ng-click-active';
  var lastPreventedTime;
  var touchCoordinates;
  var lastLabelClickCoordinates;


  // TAP EVENTS AND GHOST CLICKS
  //
  // Why tap events?
  // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
  // double-tapping, and then fire a click event.
  //
  // This delay sucks and makes mobile apps feel unresponsive.
  // So we detect touchstart, touchcancel and touchend ourselves and determine when
  // the user has tapped on something.
  //
  // What happens when the browser then generates a click event?
  // The browser, of course, also detects the tap and fires a click after a delay. This results in
  // tapping/clicking twice. We do "clickbusting" to prevent it.
  //
  // How does it work?
  // We attach global touchstart and click handlers, that run during the capture (early) phase.
  // So the sequence for a tap is:
  // - global touchstart: Sets an "allowable region" at the point touched.
  // - element's touchstart: Starts a touch
  // (- touchcancel ends the touch, no click follows)
  // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
  //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
  // - preventGhostClick() removes the allowable region the global touchstart created.
  // - The browser generates a click event.
  // - The global click handler catches the click, and checks whether it was in an allowable region.
  //     - If preventGhostClick was called, the region will have been removed, the click is busted.
  //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
  //       other elements without ngTap on them work normally.
  //
  // This is an ugly, terrible hack!
  // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
  // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
  // encapsulates this ugly logic away from the user.
  //
  // Why not just put click handlers on the element?
  // We do that too, just to be sure. If the tap event caused the DOM to change,
  // it is possible another element is now in that position. To take account for these possibly
  // distinct elements, the handlers are global and care only about coordinates.

  // Checks if the coordinates are close enough to be within the region.
  function hit(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  }

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  function checkAllowableRegions(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) {
        touchCoordinates.splice(i, i + 2);
        return true; // allowable region
      }
    }
    return false; // No allowable region; bust it.
  }

  // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
  // was called recently.
  function onClick(event) {
    if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
      return; // Too old.
    }

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0), negative coordinates, or coordinates equal to triggering label
    // click event
    if (x < 1 && y < 1) {
      return; // offscreen
    }
    if (lastLabelClickCoordinates &&
        lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y) {
      return; // input click triggered by label click
    }
    // reset label click coordinates on first subsequent click
    if (lastLabelClickCoordinates) {
      lastLabelClickCoordinates = null;
    }
    // remember label click coordinates to prevent click busting of trigger click event on input
    if (nodeName_(event.target) === 'label') {
      lastLabelClickCoordinates = [x, y];
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();

    // Blur focused form elements
    if (event.target && event.target.blur) {
      event.target.blur();
    }
  }


  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  function onTouchStart(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] === x && touchCoordinates[i + 1] === y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  }

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  function preventGhostClick(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  }

  // Actual linking function.
  return function(scope, element, attr) {
    var clickHandler = $parse(attr.ngClick),
        tapping = false,
        tapElement,  // Used to blur the element after a tap.
        startTime,   // Used to check if the tap was held too long.
        touchStartX,
        touchStartY;

    function resetState() {
      tapping = false;
      element.removeClass(ACTIVE_CLASS_NAME);
    }

    element.on('touchstart', function(event) {
      tapping = true;
      tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
      // Hack for Safari, which can target text nodes instead of containers.
      if (tapElement.nodeType === 3) {
        tapElement = tapElement.parentNode;
      }

      element.addClass(ACTIVE_CLASS_NAME);

      startTime = Date.now();

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = touches[0];
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    });

    element.on('touchcancel', function(event) {
      resetState();
    });

    element.on('touchend', function(event) {
      var diff = Date.now() - startTime;

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = (originalEvent.changedTouches && originalEvent.changedTouches.length) ?
          originalEvent.changedTouches :
          ((originalEvent.touches && originalEvent.touches.length) ? originalEvent.touches : [originalEvent]);
      var e = touches[0];
      var x = e.clientX;
      var y = e.clientY;
      var dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));

      if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
        // Call preventGhostClick so the clickbuster will catch the corresponding click.
        preventGhostClick(x, y);

        // Blur the focused element (the button, probably) before firing the callback.
        // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
        // I couldn't get anything to work reliably on Android Chrome.
        if (tapElement) {
          tapElement.blur();
        }

        if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
          element.triggerHandler('click', [event]);
        }
      }

      resetState();
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Actual click handler.
    // There are three different kinds of clicks, only two of which reach this point.
    // - On desktop browsers without touch events, their clicks will always come here.
    // - On mobile browsers, the simulated "fast" click will call this.
    // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
    // Therefore it's safe to use this directive on both mobile and desktop.
    element.on('click', function(event, touchend) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (touchend || event)});
      });
    });

    element.on('mousedown', function(event) {
      element.addClass(ACTIVE_CLASS_NAME);
    });

    element.on('mousemove mouseup', function(event) {
      element.removeClass(ACTIVE_CLASS_NAME);
    });

  };
}];

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * To disable the mouse click and drag functionality, add `ng-swipe-disable-mouse` to
 * the `ng-swipe-left` or `ng-swipe-right` DOM Element.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeLeftExample" deps="angular-touch.js" name="ng-swipe-left">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeLeftExample', ['ngTouch']);
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeRightExample" deps="angular-touch.js" name="ng-swipe-right">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeRightExample', ['ngTouch']);
      </file>
    </example>
 */

function makeSwipeDirective(directiveName, direction, eventName) {
  ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]);

      var startCoords, valid;

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      var pointerTypes = ['touch'];
      if (!angular.isDefined(attr['ngSwipeDisableMouse'])) {
        pointerTypes.push('mouse');
      }
      $swipe.bind(element, {
        'start': function(coords, event) {
          startCoords = coords;
          valid = true;
        },
        'cancel': function(event) {
          valid = false;
        },
        'end': function(coords, event) {
          if (validSwipe(coords)) {
            scope.$apply(function() {
              element.triggerHandler(eventName);
              swipeHandler(scope, {$event: event});
            });
          }
        }
      }, pointerTypes);
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



})(window, window.angular);

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/angular-touch/angular-touch.js","/../../node_modules/angular-touch")
},{"b55mWE":6,"buffer":5}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
require('./angular-touch');
module.exports = 'ngTouch';

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/angular-touch/index.js","/../../node_modules/angular-touch")
},{"./angular-touch":1,"b55mWE":6,"buffer":5}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/async/lib/async.js","/../../node_modules/async/lib")
},{"b55mWE":6,"buffer":5}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js","/../../node_modules/gulp-browserify/node_modules/base64-js/lib")
},{"b55mWE":6,"buffer":5}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/buffer/index.js","/../../node_modules/gulp-browserify/node_modules/buffer")
},{"b55mWE":6,"base64-js":4,"buffer":5,"ieee754":8}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/process/browser.js","/../../node_modules/gulp-browserify/node_modules/process")
},{"b55mWE":6,"buffer":5}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Generated by CoffeeScript 1.10.0
module.exports = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range not Satisfiable',
  417: 'Expectation Failed',
  422: 'Unprocessable Entity',
  424: 'Failed Dependency',
  429: 'Too Many Requests',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not Supported',
  507: 'Insufficient Storage',
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  UNPROCESSABLE_ENTITY: 422,
  FAILED_DEPENDENCY: 424,
  TOO_MANY_REQUESTS: 429,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/http-status/lib/index.js","/../../node_modules/http-status/lib")
},{"b55mWE":6,"buffer":5}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"b55mWE":6,"buffer":5}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.boardCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {



    $scope.team = ["Zahid", "Tom", "Fay", "Mark", "Darren", "Lacey", "David"];
	  $scope.chart_title="Leader Board"
	$scope.labels= $scope.team
    
		$scope.removeTally = function(id) {
			Tallys.remove({id:id})
		}
		  Tallys.query({}, function(team) {
			_.each(team, function(row) {
				//$scope.removeTally(row._id)
				})	
			})	
			
			
 trello.auth()
 
 
 
 
 
    var series_a = []
	_series = [];
	__series = [];
	
	$scope.series = [];

		_.each($scope.team, function(member) {
       _series[member] = []
    })
	
	
	var plot_graph = function() {

    var _data = []
	 var _series = []
		_.each($scope.team, function(member) {
        _series[member] = []
    })
	

	
   
	
    Tallys.query({}, function(tallys) {
		
		tallys.sort(function(a, b){
		return a.date + b.date;
		});

		
        _.each(tallys, function(row) {			
			
            for (var member in _series) {
                if (_series.hasOwnProperty(member)) {
				if(row.name){
                    if (row.name.toLowerCase() == member.toLowerCase()) {
                        _series[member].push({
                            x: row.date,
                            y: row.points
                        })
                    }
					}
                }
			
            }


        })
		

    })
	
	
	

    for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            _data.push(_series[member]);
        }
    }
	
	$scope.data=_data
	
	}
  
  for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            __series.push(member);
        }
    }
	
	$scope.series= __series
  

 
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
		
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'day',
                unitStepSize: 1,
                time: {
                    displayFormats: {
                        'day': 'MMM DD'
                    }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0
	$scope.loadMoreShots = function(count,display_data) {

		angular.forEach(display_data, function(list, index) {
						
		get_trello_board.get_data(list)

				   .then(function() {
					  count++
				if(display_data.length==count+1){
	
				   $scope.listscores()
					 plot_graph()
				}

				   });
				   
	})

};

	
	
        //trello.auth()
$scope.loadMoreShots(0,$rootScope['team'])

setInterval(function(){$scope.loadMoreShots(0,$rootScope['team']); }, 1 *250 * 1000);


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
            console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		
			$scope.lists = []
			
				
	$scope.listscores = function() {	
		$scope._lists = []
		   Team.query({}, function(team) {
				_.each(team, function(row) {
								list=[]
								list.title = row.name
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope._lists.push(list)
				})
				$scope.lists=$scope._lists
				
		})
		
	}

		
			
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/dashboard-controller.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.deadCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,kiosk_activity
    ) {

   
	 $scope.machine_types = [];
	
	 


  $scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

  $scope.machine_types = ['apple', 'orange', 'pear', 'naartjie'];

  // selected fruits
  $scope.machine_types_selection = ['apple', 'pear'];

  // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(type) {
    var idx = $scope.machine_types_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.machine_types_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.machine_types_selection.push(type);
	  
			
			
			plot_graph()
    }
  }; 

  $scope.changedCatValue = function(category) {
						 
 }  


  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

  // toggle selection for a given fruit by name
  $scope.toggleCatSelection = function toggleSelection(type) {
    var idx = $scope.category_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.category_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.category_selection.push(type);
	  
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
			
			plot_graph()
    }
  }; 

    
  $scope.changedCatValue = function(category) {
						 
 }

    $scope.data = []
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var plot_graph = function() {
	
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
		
		 kiosk_activity.async_all($scope.category_selection).then(function(data) { //2. so you can use .then()
		 
		 		console.log('data',data)
	$scope.listscores(data.data['off_today'])
	$scope.listslivecores(data.data['on_today'])	
				
				
			})				
	}

    plot_graph() 
		$scope.live_lists = []
	
		$scope.listslivecores = function(list) {	
		console.log('list',list)
		 
				_.each(list, function(row) {
					
					console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.live_lists.push(list)
				})
		
		
	}
		$scope.lists=[]
	$scope.listscores = function(list) {	
		console.log('list',list)
		 
				_.each(list, function(row) {
					
					//console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}

				
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/dead-controller.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.downtimeCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,kiosk_activity
    ) {


console.log('controller load')

var REFERENCE = moment(); // fixed just for testing, use moment();
 $scope.TODAY = REFERENCE.clone().startOf('day');
	$scope.YESTERDAY = REFERENCE.clone().subtract(0, 'days').startOf('day');
	$scope.A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');



   	$scope.datePicker=[];
	$scope.datePicker.date = {startDate: $scope.A_WEEK_OLD._d, endDate: $scope.TODAY._d};


$scope.machine_types = [];
$scope.type="all";
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   


$scope.machinesx=$scope.kiosk = $routeParams.kiosk ||["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	plot_graph('type')

})	
	  
$scope.$watch('daterangepicker.dates', function() {
console.log('daterangepicker')
	plot_graph()
})

	  

$scope.$watch('machine', function() {

			
			plot_graph('machine')	
})
  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

 

 
var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var firstTime=true
	
	
	
	
	
	var plot_graph = function(mode) {
	$scope.data=[];
	$scope.series=[];
	$scope.day_series=[];
	$scope._series=[];
	$scope.week_day_series=[];
	
	if(!mode){
	$scope.machinesx=[]	
}	


$scope.categories=[]

		 kiosk_activity.async_all($scope.categories,$scope.machine_types,$scope.datePicker.date).then(function(data) { //2. so you can use .then()
		 				
				_.each(data.data['kiosk_list'], function(data) {
					//if(firstTime==true){
					
					
					
					if(($scope.type=="all") || ($scope.type==data.type && mode!="machine")){
						//$scope.machine_types=[]
						
						$scope.machinesx.push(data.kiosk)
					}
					//}
						
					if($scope.type=="all" ||$scope.type==data.type){
								if($scope.machine=="all" ||$scope.machine==data.kiosk){
										$scope._series[data.kiosk] = []
										$scope.week_day_series[data.kiosk] = []
										
								}
					}
						 				 
				})	
	 
			_.each(data.data['machine_types'], function(data) {
				if(firstTime==true){
					$scope.machine_types.push(data.machine_type)
					}
				
				})	
				
				firstTime=false
				 $scope.categories=[]
				
					_.each(data.data['categories'], function(data) {
					
					 $scope.categories.push(data.category)
				})	
				
				  _.each(data.data['all'], function(row) {
					  
						if($scope._series[row.kiosk]){
							$scope._series[row.kiosk].push({
								x: row.date,
								y: row.count
							})
							}
							
							
				})
				$scope.week_days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
				
				_.each( $scope.week_days, function(day_of_week) {
				  _.each(data.data['week_day'], function(row) {
					  
						if($scope.week_day_series[row.kiosk] && (row.kiosk==$scope.machine || $scope.machine=="all")){
							
							
								if(row.date==day_of_week){								
									$scope.week_day_series[row.kiosk].push(	row.count)
								}
							
						}
							
						})	
							
				})

				  for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {
						
							$scope.series.push(member);
						}
					}

					for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {

							$scope.data.push($scope._series[member]);
						}
					}	

				
_data=[]
					for (var member in $scope.week_day_series) {
					
						if ($scope.week_day_series.hasOwnProperty(member)) {
						$scope.day_series.push(member);

							_data.push( $scope.week_day_series[member])
							
						}
					}

  					$scope.day_labels = $scope.week_days;
					$scope.day_data = _data
					
			})				
	}

		
$scope.day_onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.day_datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
   
	

  
  
  

    $scope.onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
	tension:0,
	 bezierCurve: false,
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'hour',
				
                unitStepSize: 0.05,
                  time: {
        displayFormats: {
           'day': 'MMM DD'
        }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
           // console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
		//console.log('list',list)
		 
				_.each(list, function(row) {
					
					//console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}

	 kiosk_activity.comments_all().then(function(data) { //2. so you can use .then()
	 
	  satisfact_pie(data)
	 })
	
		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				var series_a=[]
				var labels=[]
			
					$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				_.each(comments.data['satisfaction_tally'] , function( row) {
				
			
			if($scope.kiosks.indexOf(row.kiosk)==-1){
				$scope.kiosks.push(row.kiosk)
					series_a[row.kiosk]=[]
				$scope[row.kiosk]=[]
				labels[row.kiosk]=[]
				
				
			}
				
			
				
		
			
				series_a[row.kiosk].push( Math.round(row.count ))
				labels[row.kiosk].push( row.satisfaction )
				
				
				
				console.log(labels)
				})
			
				_.each($scope.kiosks , function( kiosk, i) {
					
					$scope.pie_labels[i] = labels[kiosk];
					$scope.datax[i] = series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: false },
										tooltips: {
													enabled: true,
													mode: 'single',
													callbacks: {
														
														label: function(tooltipItems, data) { 
														
														var label =data.labels[tooltipItems.index]
															return label+ " " + data.datasets[0].data[tooltipItems.index] + '';
															
														}	
												
													}
										}
					}
		})

				
				
				
		}		
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/downtime-controller.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.kiosk_activity = function ($http) {

	
  return {
    async_categories: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/downtime.php');  //1. this returns promise
    },
	 async_all: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
	
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/downtime-services.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.feedbackCtrl =    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,feedback
    ) {


var REFERENCE = moment(); // fixed just for testing, use moment();
$scope.TODAY = REFERENCE.clone().startOf('day');
$scope.YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
$scope.A_WEEK_OLD = REFERENCE.clone().subtract(2, 'days').startOf('day');
$scope.datePicker=[];
$scope.datePicker.date = {startDate: $scope.A_WEEK_OLD._d, endDate: $scope.TODAY._d};
$scope.machine_types = [];
$scope.type="INTERPRETATION-KIOSK";
$scope.feedback=[];
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

$scope.selected="all";
$scope.changeMachine = function(machine) {
			
			$scope.feedback=[];
			$scope.data=[];
			$scope.series=[];
			$scope.category=[];
			$scope.selected=machine;
			
			plot_graph(machine)	;		 
 }   




$scope.machinesx=["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	//plot_graph('type')

})	
	  
$scope.$watch('datePicker', function() {
plot_graph();
})
	  


  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];
  $scope.category_selection = [];

 

 
	var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="KIOSK FEEDBACK"

    var series_a = []
	
	var firstTime=true
	
	$scope.satisfaction_count=0
				satisfied=[]
				satisfied.push("satisfied")
				satisfied.push("very satisfied")
	
	
	var plot_graph = function(mode) {
	$scope.data=[];
	$scope.series=[];
	$scope.day_series=[];
	$scope._series=[];
	$scope.week_day_series=[];
	
	if(!mode){
	$scope.machinesx=[]	
}	


$scope.categories=[]

		 feedback.feedback($scope.categories,$scope.datePicker.date).then(function(data) { //2. so you 
		 		
				  		$scope.machinesx.push("OVERALL SATISFACTION")
				_.each(data.data['kiosk_list'], function(data) {
					if($scope.type=="INTERPRETATION-KIOSK" && firstTime==true){
					mode="OVERALL SATISFACTION"
						$scope.machinesx.push(data.kiosk)
					}
												 
				})	
				firstTime=false
			
				
				_.each(data.data['all'], function(data) {
					if(data.description !="" && data.kiosk==$scope.selected){
					$scope.feedback.push(data)
					console.log(data.description)
					}
								 
				})
				
			satisfact_pie(data) 
			if(mode=="OVERALL SATISFACTION"){
			overall_satisfact_pie(data) 
			}

			})				
	}

		
$scope.day_onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.day_datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
   
	

  
  
  

    $scope.onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
	tension:0,
	 bezierCurve: false,
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'hour',
				
                unitStepSize: 0.05,
                  time: {
        displayFormats: {
           'day': 'MMM DD'
        }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
          
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
	
		 
				_.each(list, function(row) {
					
					
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}
	
		  function overall_satisfact_pie(comments) {
     
               $scope.kiosks=[]
			   $scope.kiosks.push("OVERALL SATISFACTION")
				$scope.machine = "OVERALL SATISFACTION"
				$scope.series_a=[]
				$scope.labels=[]
				$scope.series_a["OVERALL SATISFACTION"]=[]
				$scope.labels["OVERALL SATISFACTION"]=[]
				$scope.satisfaction_tally=0
				$scope.satisfaction_count=0
			_.each(comments.data['overall_satisfaction'] , function( row) {
$scope.satisfaction_tally+=Math.round(row.count )

				$scope.series_a["OVERALL SATISFACTION"].push( Math.round(row.count ))
				$scope.labels["OVERALL SATISFACTION"].push( row.satisfaction )
				
				
				
				if(satisfied.indexOf(row.satisfaction)!=-1)
				{
					$scope.satisfaction_count+=Math.round(row.count )
				}

					$scope.pie_labels.push( $scope.labels["OVERALL SATISFACTION"]);
					$scope.pie_data.push($scope.series_a["OVERALL SATISFACTION"]);

				
		})		
						
			$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
			}


		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				$scope.series_a=[]
			$scope.labels=[]
			
				$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				$scope.satisfaction_count=0
				$scope.satisfaction_tally=0
				
			_.each(comments.data['satisfaction_tally'] , function( row) {
		
				if($scope.kiosks.indexOf(row.kiosk)==-1){
					if($scope.selected.indexOf(row.kiosk)!=-1){
						
						
						
						$scope.kiosks.push(row.kiosk)
						console.log('cats')
						$scope.series_a[row.kiosk]=[]
						$scope[row.kiosk]=[]
						$scope.labels[row.kiosk]=[]
					}
				}
				
				if($scope.selected.indexOf(row.kiosk)!=-1){
				$scope.series_a[row.kiosk].push( Math.round(row.count ))
				$scope.labels[row.kiosk].push( row.satisfaction )
				if(satisfied.indexOf(row.satisfaction)!=-1)
						{
						
							$scope.satisfaction_count+=Math.round(row.count )
						}
				$scope.satisfaction_tally+=Math.round(row.count )
				$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
						
				}
				
			

				})
			
			
				
				
				
				_.each($scope.kiosks , function( kiosk, i) {
				
		
					$scope.machine = kiosk
					$scope.pie_labels[i] = $scope.labels[kiosk];
					$scope.pie_data[i] = $scope.series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: true },
										tooltips: {
													enabled: true,
													mode: 'single',
													callbacks: {
														
														label: function(tooltipItems, data) { 
														
														var label =data.labels[tooltipItems.index]
															return label+ " " + data.datasets[0].data[tooltipItems.index] + '';
															
														}	
												
													}
										}
					}
		})

				
				
				
		}		
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/feedback-controller.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.feedback =function ($http) {

  return {
    async_categories: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/downtime.php');  //1. this returns promise
    },
	 async_all: function(categories,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	
	
		 feedback: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/feedback-services.js","/../components/machine-monitor")
},{"b55mWE":6,"buffer":5}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.member_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline,$mdEditDialog
		,Leave,delete_leave_by_id
    ) {

$scope.me=$routeParams.member

$me_Data=[]

      Leave.query({}, function(team) {
            _.each(team, function(row,index) {
          
			
			
            })
        })


Team.query({}, function(team) {
            _.each(team, function(team,i) {
			
			if(team.username.toLowerCase()==$scope.me.toLowerCase()){
			console.log(team)
			
			
			number_days_leave_taken = 0
			
			function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

team.leave_taken = sortByKey(team.leave_taken, 'leave_start');

			
		 _.each(team.leave_taken, function(leave,w) {
	var leave_count=0
	if(leave._type=="Full Day"){
	leave_count=1
	}
	if(leave._type=="Half Day"){
	leave_count=0.5
	}
			 if(leave.start_date>=team.leave_start && leave.end_date<=team.leave_year_end){
				number_days_leave_taken+=(leave.weekday_duration)*leave_count
				team.leave_taken[w].tally=(team.number_days_leave-number_days_leave_taken)*leave_count
			 }
			 else
			{
			
				console.log(leave.start_date>=team.leave_start )
				console.log('leave.start_date'+leave.start_date )
				console.log('row.leave_start'+team.leave_start )
				
				console.log(leave.end_date<=team.leave_year_end)
				console.log('leave.end_date'+leave.end_date )
				console.log('row.leave_year_end'+team.leave_year_end )
					 
			}
	
		 })
		team.number_days_leave_remaining=team.number_days_leave-number_days_leave_taken
			
			
			$scope.me_Data=team
			}
			
})
 })


   $scope.removeLeave = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */

 // var promise = $mdEditDialog.small({

    //modelValue: dessert.comment,
    //placeholder: 'Add a comment',
   // save: function (input) {
//	event.target.innerHTML=input.$modelValue
	
	
	console.log(dessert)
	delete_leave_by_id._delete(dessert._id)
	/*
			var query = {'id':dessert._id};
			Team.update(query, {
					[event.target.attributes[0].nodeValue]:new Date(input.$modelValue)
					}, function(err, affected, resp) {
					console.log(resp)
			})
			*/
  /*
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  */
  }
  
  

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/member/member-controller.js","/../components/member")
},{"b55mWE":6,"buffer":5}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.TallyController =  function($scope, Tallys) {


    $scope.editing = [];
    $scope.tallys = Tallys.query();

	
	
	
	
    $scope.save = function() {
        if (!$scope.newTally || $scope.newTally.length < 1) return;
        var tally = new Tallys({
            name: $scope.newTally,
            completed: false
        });

        tally.$save(function() {
            $scope.tallys.push(tally);
            $scope.newTally = ''; // clear textbox
        });
    }

    $scope.update = function(index) {
        var tally = $scope.todos[index];
        Tallys.update({
            id: tally._id
        }, tally);
        $scope.editing[index] = false;
    }

    $scope.edit = function(index) {
        $scope.editing[index] = angular.copy($scope.tallys[index]);
    }

    $scope.cancel = function(index) {
        $scope.tallys[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
    }

    $scope.remove = function(index) {
        var tally = $scope.tallys[index];
        Tallys.remove({
            id: tally._id
        }, function() {
            $scope.tallys.splice(index, 1);
        });
    }
}
exports.TodoDetailCtrl =   function($scope, $routeParams, Todos, $location) {

    $scope.todo = Todos.get({
        id: $routeParams.id
    });

    $scope.remove = function() {
        Todos.remove({
            id: $scope.todo._id
        }, function() {
            $location.url('/');
        });
    }
}
exports.trello =   function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {


        trello.auth()
		
		$scope.removeTeam = function(id) {
			Team.remove({id:id})
		}
		  Team.query({}, function(team) {
			_.each(team, function(row) {
				$scope.removeTeam(row._id)
				})	
			})	

	
	
		
				
        
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
            screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
            console.log('start screensaver')
            screen_saver_loop.start_screen_saver();
        }

        console.log($routeParams.view)

        var display_data = $rootScope[$routeParams.view]




        $scope.lists = []
        loadMoreShots = function(display_data) {

            angular.forEach(display_data, function(list, index) {


                var promise = get_trello_board.get_data(list)
				
				.then(function(response) {
					cards=response.response
					console.log('cards',cards)
                    list._cards = []
                    tally = 0
                    card_count = 0

                    angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points = (card_count / (list.average/1 + 1)).toFixed(2)
					console.log('card_count',card_count)
					console.log('list.average ',list.average )
					console.log('list.average ',(list.average + 1))
					console.log('list.points ',list.points)	
						
								 // (card_count / (list.average + 1)).toFixed(1)	
					
					var team = new Team({
					  name: list.title,
					  score:list.points,
					   card_count:card_count,
					  bonus:"",
					  penalty:list.average 
					});
					 team.$save(function() {                       
                        $scope.team.push(team);
                    });
					
                    var tally = new Tallys({
                        name: list.title,
                        date: new Date(),
                        points: list.points
                    });
                    $scope.tallys = Tallys.query();


                    tally.$save(function() {
                        console.log(tally)
                        $scope.tallys.push(tally);
                        $scope.newTodo = ''; // clear textbox
                    });


                    $scope.lists.push(list)
                })

            })
        }

        loadMoreShots(display_data)


        detect_dragging.drag_handler()
        $scope.go = function(path) {

            if ($rootScope.isDragging == false) {
                if (path > 0) {
                    $location.path("id/" + path + "/" + $routeParams.kiosk);
                    detect_dragging.drag_handler()
                } else {
                    //$location.path(path + "/" + $routeParams.kiosk);
                }
            }
        };


        $scope.pageClass = 'page-contact';

        $scope.save = function() {
            if (!$scope.newTally || $scope.newTally.length < 1) return;
            var tally = new Tallys({
                name: $scope.newTally,
                date: new Date()
            });

            tally.$save(function() {
               
                $scope.todos.push(tally);
                $scope.newTodo = ''; // clear textbox
            });
        }
    }
	
	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/app-controllers.js","/../components/team")
},{"b55mWE":6,"buffer":5}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.form_to_trellox =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {



        trello.auth()
		
		console.log($rootScope.team)
		
		boards=[]
		
		 angular.forEach($rootScope.team, function(team,i) {
				 board={
				  "name": team.title,
				  "value": team.id
				  }
				 boards.push(board)
		 })
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  name: "",
	  file:"",
	  list_id:"",
	  description:""
    };
    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };
    
    vm.fields = [
     /*
	  {

                            type: 'radio',
                            key: 'satisfaction',							
                            templateOptions: {
                              label: "Explain the problem",  
                                
                                options: [
									 {
										"name": "very satisfied",
										"value": "very satisfied"
									  },
									  {
										"name": "satisfied",
										"value": "satisfied"
									  },
									  {
										"name": "neither satisfied nor disatisfied",
										"value": "neither satisfied nor disatisfied"
									  },
									  {
										"name": "disatisfied",
										"value": "disatisfied"
									  },
									  {
									  
										"name": "very disatisfied",
										"value": "very disatisfied"
									  }
                                ]
							}
	  },
	  */
	  {
        key: 'list_id',
        type: 'select',
        templateOptions:{
            label: 'Post to board',
            options: boards,
             }
		
		},
	  {
        key: 'name',
        type: 'textarea',
        templateOptions: {
          label: 'Task',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	  {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description',
          placeholder: 'This will be the card description',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	    {
        key: 'file',
        type: 'file',
        templateOptions: {
          label: 'File',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
/*
      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
		
      },
	  
      {
        key: 'whyNot',
        type: 'textarea',
        expressionProperties: {
          'templateOptions.placeholder': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad... It really is awesome! Wasn\'t that cool?';
            } else {
              return 'Type in here... I dare you';
            }
          },
          'templateOptions.disabled': 'formState.awesomeIsForced'
        },
        hideExpression: 'model.awesome',
        templateOptions: {
          label: 'Why Not?',
          placeholder: 'Type in here... I dare you'
        },
        watcher: {
          listener: function(field, newValue, oldValue, formScope, stopWatching) {
            if (newValue) {
              stopWatching();
              formScope.model.awesome = true;
			  formScope.model.satisfaction = undefined;
			  formScope.model.kiosk=app_settings.kiosk;
              formScope.model.whyNot = undefined;
              field.hideExpression = null;
              formScope.options.formState.awesomeIsForced = true;
            }
          }
        }
      },
	  */
     
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
    ];
// Setup
var TOKEN = "";
var KEY = "";
var CARD = "";
var FILE = "";
    // function definition
    function onSubmit() {
	
		formData=(vm.model);
		var myList = formData.list_id;
		var creationSuccess = function(data) {
		  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
		
		if( exampleInputFile.files[0]){
				var formData = new FormData();

				  formData.append("token", Trello.token());
				  formData.append("key", Trello.key());

				formData.append("file", exampleInputFile.files[0]);
				console.log(formData)
				var request = new XMLHttpRequest();
				 request.open("POST", "https://api.trello.com/1/cards/" + data.id + "/attachments");
				  request.send(formData);
		
		vm.options.resetModel()		
		};
		}
			var error = function(err) {
		console.log(err.responseText)
		};
		
		var newCard = {
		  name: formData.name, 
		  file: formData.file, 
		  desc: formData.description,
		  // Place this card at the top of our list 
		  idList: myList,
		  pos: 'top'
		};
		console.log('Trello',Trello)
		Trello.post('/cards/', newCard, creationSuccess,error);  
		var trellokey=formData.key
var trelloroken=formData.token
	


    }  
 }
 
 

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/form-controller.js","/../components/team")
},{"b55mWE":6,"buffer":5}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.leave_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline
		,Leave
    ) {



  $scope.override=true
  $scope.ids_to_delete=[]
		
	function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}
		
		$scope.datePicker=[];
		$scope.datePicker.date = {startDate: "", endDate: ""};
		$scope.dateRange = {
            startDate: null,
            endDate: null
        };
		check_dates=function(viewValue){
		 
		 var overlap = []
						if(viewValue!=""){
							Team.query({}, function(team) {
						_.each(team, function(_team,i) {
						
						_.each(_team.leave_taken, function(leave,i) {
							
							 
								
							
							StartDate1=		new Date(leave.start_date)
							EndDate1=		new Date(leave.end_date)
							StartDate2=		new Date($scope.datePicker.date.startDate._d)
							EndDate2=		new Date($scope.datePicker.date.endDate._d)
						
							
							if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
										
										
											overlap.type = leave._type
											overlap.name = leave.name
											overlap.id = leave._id
											overlap.group = moment(StartDate1).format("MMM Do YYYY")  +"-"+moment(EndDate1).format("MMM Do YYYY") 
											$scope.overlapalert.push(overlap)
										
							if(viewValue==_team._id){
							console.log('will be overwritten'+leave._id)
								$scope.ids_to_delete.push(overlap.id)
							 }
							
									
							 }
							 
							  })
							 
						   })
						   })
						   }
    }
		$scope.overlapalert=[]

		$scope.dateRangeOptions = {
        locale : {
            format : 'DD/MM/YYYY'
        },
        eventHandlers : {
            'apply.daterangepicker' : function() {  
      
				console.log("checking Dates"); 
$scope.overlapalert=[]
        Timeline.query({}, function(team) {
		
		
            _.each(team, function(row,index) {

		var timeline=(row);
		if(!row.end_date){row.end_date=row.start_date}
		
		StartDate1=		new Date(timeline.start_date)
		EndDate1=		new Date(timeline.end_date)
		
		StartDate2=		new Date($scope.datePicker.date.startDate._d)
		EndDate2=		new Date($scope.datePicker.date.endDate._d)
	
		
		
		if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
					console.log(row)
					var overlap = []
						overlap.type = row._type
						overlap.name = row.name
						overlap.group = row.group
						
						$scope.overlapalert.push(overlap)
		}
		

	
			
            })
        })				
				
            }
        }
    };
	
	
		
		boards=[]
		leave_type=[]
		leave_type.push({"name": "Full Day","value": "Full Day"})
		leave_type.push({"name": "Half Day","value":"Half Day"})
		leave_type.push({"name": "Flexi PM","value":"Flexi PM"})
		leave_type.push({"name": "Flexi AM","value":"Flexi AM"})
		leave_type.push({"name": "Flexi Day","value":"Flexi Day"})
		
		
		 Team.query({}, function(team) {
            _.each(team, function(team,i) {
		
				 board={
				  "name": team.username,
				  "value": team._id
				  }
				 boards.push(board)
		 })
		  })
		
		  check_names = function () {
				console.log('check names')
			
 
			}
		   $scope.override_button = function () {
				console.log('override')
				$scope.override=false
 
			}
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  username: "",
	  notes:"",
	  team:"",
	  start_date:"",
	  end_date:"",
	  _type:""
    };
 
    vm.fields = [
  
  
	  {
        key: 'username',
        type: 'select',
	 expressionProperties : {
       'templateOptions.onChange': function($viewValue, $modelValue, $scope) {
	   
	   
	  check_dates($viewValue)
	   
	   
       }},
        templateOptions:{
            label: 'Name',
            options: boards,
             }
		
		},
		  {
        key: '_type',
        type: 'select',
        templateOptions:{
            label: 'Type',
            options: leave_type,
             }
		
		},
	   
 
	  {
        key: 'notes',
        type: 'textarea',
        templateOptions: {
          label: 'Notes',
          placeholder: '',
          description: ''
        },
    
      }

  
    ];

	
	
    // function definition
    function onSubmit() {

		formData=(vm.model);
			console.log(formData)
		
		formData.start_date = moment($scope.datePicker.date.startDate._d).startOf('day')
		formData.end_date = moment($scope.datePicker.date.endDate._d)
		
		var leave = new Leave(formData);
		
	
			 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
					
						if(_team._id==formData.username){
							
							leave.team_member= _team._id
							
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( $scope.ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											leave.$save(function(resp) {
													console.log('response',resp) 
													team[i].leave_taken.push(resp._id);
										
								
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
							
							
		 vm.options.resetModel()
		// $scope.datePicker.date=[]
		 $scope.overlapalert=[]
		 
						
           
            });
						}
				})
			})
	
			

   
	

    }  
 }
 
 

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/leave-controller.js","/../components/team")
},{"b55mWE":6,"buffer":5}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog
    ) {



  $scope.rows = [];
  
  $scope.counter = 0;
  
  $scope.addRow = function() {
   var team = new Team({
                name:  $scope.counter
            });
			
	 team.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
  
  
     Team.query({}, function(team) {
	  _.each(team, function(row,index) {
		  
		
		  
		number_days_leave_taken = 0
		 _.each(row.leave_taken, function(leave) {
	
			 if(leave.start_date>=row.leave_start && leave.end_date<=row.leave_year_end){
				number_days_leave_taken+=leave.weekday_duration
			 }
			 else
			{
	
					 
			}
		 })
		row.number_days_leave_remaining=row.number_days_leave-number_days_leave_taken
		  
		$scope.rows.push(row)
		 $scope.counter++;
	 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = event.target.attributes[0].nodeValue;
myArray.push(obj);
   
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Team.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/team-controller.js","/../components/team")
},{"b55mWE":6,"buffer":5}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var async = require('async')

exports.tech_support_controller = function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope,  trello, tech_get_trello_board, date_calc,Tech_support
    ) {
	$scope.rows=[]
	$scope._rows=[]
	//http://ui-grid.info/docs/#/tutorial/201_editable
	Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}

	
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope.rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope.rows;
						})
						
						})
		var lists = []
		var list = []
		list.id="5710a18fc2c7adc11a382e94"
			lists.push(list)
		var list = []
		list.id="57c6f2715e4ad081f42204ec"
			lists.push(list)
		var list = []
		list.id="57558712bec1ad7712beb29e"
			lists.push(list)
		
		trello.auth() 				
					
	$scope.gridOptions=[]
	$scope.gridOptions.columnDefs = [   ]
	$scope.gridOptions = {
	columnDefs: [
	{ field: 'list' ,resizable: true},
	{ field: 'date_created' ,type:'date'}, 	
	{ field: 'last_updated' ,type:'date'}, 	
	{ field: 'name' , width: "450",height:"50",resizable: true},   
	{ field: 'weekday_duration' ,displayName: 'Age',type:'number'}, 
	{ field: 'category' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'AV' ,value:'AV'},	 
      { id:'TECHNICIANS',value:'TECHNICIANS'},
	  { id:'ELECTRICIAN',value:'ELECTRICIAN'},
	   { id:'CONSERVATORS',value:'CONSERVATORS'},
	  { id:'EXTERNAL',value:'EXTERNAL'},
	  { id:'UNASSIGNED',value:'UNASSIGNED'}
	
    ] },
	{ field: 'type' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'SOFTWARE' ,value:'SOFTWARE'},	 
      { id:'HARDWARE',value:'HARDWARE'},
	  { id:'CONTENT',value:'CONTENT'},
	  { id:'WEAR',value:'WEAR'},
	
    ] },
	    { field: 'difficulty' ,resizable: true,type:'number'},  
	    { field: 'aknowledged',type:'date' ,resizable: true},  
		 { field: 'resolution' ,resizable: true}  
	],
	
	enableGridMenu: true,
	enableSelectAll: true,
	enableCellSelection: true,
	enableCellEditOnFocus: true,
	exporterCsvFilename: 'myFile.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	onRegisterApi: function(gridApi){
	vm.gridApi = gridApi;

	},
	pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
            // pageSizes: list of available page sizes.
            pageSizes: [250, 500, 1000], 
            //pageSize: currently selected page size. 
            pageSize: 250,
            //totalServerItems: Total items are on the server. 
            totalServerItems: 0,
            //currentPage: the uhm... current page.
            currentPage: 1
        },
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post

	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
	var query = {'id':rowEntity._id};
			Tech_support.update(query, {
					myArray
					}, function(err, affected, resp) {

var comment_text = [colDef.field] + ": " + newValue
					var data = {text:comment_text}
				
					Trello.post("cards/"+rowEntity._id+"/actions/comments",data)
					
					
			})
  });
    },
	
  };
  
 
		
	get_list = function (id,list_id,cb) {
	
		//card might have been moved to done!
		var query = {'id':id};
		Trello.get("cards/"+id+"?fields=idList,dateLastActivity", function(card) {
		Trello.get("lists/"+card.idList+"?fields=name", function(list) {
			console.log(list.name+card.dateLastActivity)
			Tech_support.update(query, {
					list:list.name,
					last_updated:card.dateLastActivity
					},cb())	
		 })
		 })
		 
	 
	 }
alert('cheese')


		$scope.rows = []
		$scope.column_headings=[]
		
	tech_get_trello_board.get_data(lists, function() {

				console.log('updated latest lists from trello')
				Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
				
				
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope._rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope._rows;
						})
						
						})
						
						})
					
}







}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/tech-support-controller.js","/../components/tech-support")
},{"async":3,"b55mWE":6,"buffer":5}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var async = require('async')
exports.tech_get_trello_board = function (date_calc,$http,Tech_support) {	

	var self = this
    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
	

	
	
    trello.get_data = function (listx,cb) {
		console.log('trello.get_data')
		var self = this
		var lists = listx.length
		var count = 0
		
		
	 async.forEach(listx, function(list, callback2) { 
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			list_id=list.id
		   Trello.get("lists/"+list.id+"/cards", function(cards) {
			console.log('get list data')		
					var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
				 async.forEach(cards, function(card, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
       
	   
	   	//calculate date created
					idBoard = card.id;
						
console.log('trello card',card)
					support_card = {
						id:card.id,
						name: card.name,
						list_id:card.idList,
						last_updated:card.dateLastActivity,
						tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
						dateLastActivity: card.dateLastActivity,
						link:card.shortUrl,
						date_created:new Date(1000*parseInt(idBoard.substring(0,8),16))
					}
					
					

				
	   
					Tech_support.update({id:card.id}, support_card,callback())

					}, function(err) {
						if (err) return next(err);
						console.log('done updating mongo')
							callback2()	
					});
	
		});	
				}, function(err) {
						if (err) return next(err);
					console.log('all done ')	
				cb()
					});		


    };


		

    return trello;

}


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/trello-services.js","/../components/tech-support")
},{"async":3,"b55mWE":6,"buffer":5}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog,Timeline_data
    ) {



  $scope.rows = [];
   $scope.column_headings = []

  $scope.counter = 0;
  
  $scope.addRow = function() {
   var data_row = new Timeline_data({
                name:  $scope.counter
            });
			
	 data_row.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
   Timeline_data.query({}, function(data) {
  _.each(data, function(data_settings,index) {

		  Timeline_data.remove({
               // id: data_settings._id
            });
		
	})	
		})	  
  
  		var data_settings = new Timeline_data({ 
					type:"text",
					data_feed_url:"https://www.gov.uk/bank-holidays.json",
					googlesheet_name:"england-and-wales",
					track:"public holidays",
					group:"public holidays",
					use_moment:false,
					value_column:"title",
					title_column:"title",
					events_sub_child:"events",
					start_column:"date",
					group_id:"public holidays"+"public holidays",
					date_column:"date"
		})
	//data_settings.$save();
		
			var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')
	
	
	
	
	var data_settings = new Timeline_data({ 
					type:"numerical",
					data_feed_url:"http://museums.bristol.gov.uk/sync/data/stats.JSON",
					googlesheet_name:"stats",
					track:"emu stats",
					use_moment:false,
					value_column:"value",
					group_column:"module",
					group_id:"module",
					group_id_column:"module",
					date_column:"date",
					subgroup_column:"action",
					start_column:"start_date",
					end_column:"end_date",
					val_1:0,
					val_2:10,
					val_3:100,
					val_4:500,
					val_5:1000,
					val_6:2000,
					val_7:3000,
					val_8:4000,
					val_9:5000,
					val_10:10000
	})
 //data_settings.$save();
  
  	
	
		var data_settings = new Timeline_data({ 
					type:"numerical",
					use_moment:true,
					googlesheet_id:"1ENJ87VM90o15jcZ1yavlVf7F1fg4xePoluyrm2uWlgE",
					googlesheet_name:"pivot",
					track:"Shopify",
					group:"Shopify",
					group_id:"Shopify",
					value_column:"value",
					date_column:"date",
					val_1:0,
					val_2:300,
					val_3:600,
					val_4:900,
					val_5:1100,
					val_6:1200,
					val_7:1400,
					val_8:1500,
					val_9:2000,
					val_10:3000
	})
	//data_settings.$save();
	 
	 	
		var data_settings = new Timeline_data({ 
					type:"text",
					googlesheet_id:"1VsSxPQ6rGrP3FWdveX3wwdUlnB1t_Sk2NG6aE0kX92M",
					googlesheet_name:"Sheet1",
					use_moment:false,
					track:"Arts and Events",
					colour:"green",
					title_column:"Event_Title",
					start_column:"Event_Start",
					group_column:"Event_Location",
					end_column:"Event_End",
					value_column:"value",
					subgroup_column:"name",
					date_column:"date"
	})
	data_settings.$save();
  
     Timeline_data.query({}, function(team) {
		 
		   for (var key in team[0]) {
			   
			var dont_shows=[
			"__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
		   ]
			
			   if(dont_shows.indexOf(key)==-1){
				$scope.column_headings.push(key)
			   }				
			}	
			
		  _.each(team, function(row,index) {  
			$scope.rows.push(row)
			 $scope.counter++;
		 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

console.log(event)
  
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
 
 
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Timeline_data.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
					console.log(err)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline-settings/timeline-settings-controller.js","/../components/timeline-settings")
},{"b55mWE":6,"buffer":5}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_controller=     function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
		
	 $scope.isloggedin=false	
  AuthService.isLoggedIn().then(function(user){
	  $scope.isloggedin=true	
  })
	
	$scope.average_install_length = 0
	$scope.locked=[]
	$scope.unlock=false
	$scope.password=false
	$scope.lockstatus=true
	$scope.locked['true']={status:" locked",value:false}
	$scope.locked['false']={status:" unlocked",value:true}
	$scope.average_derig_length = 0
	$rootScope.addednames=[]
	$rootScope.track_groups=[]
	$rootScope.added_track_groups=[]
	$rootScope.datePicker=[];
	$rootScope.datePicker.date = {startDate:null, endDate: null};
	
	
$scope.dateRangeOptions = {
        locale : {
            format : 'DD/MM/YYYY'
        },
        eventHandlers : {
            'apply.daterangepicker' : function() {  
               date=$rootScope.datePicker.date
			   	days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
				
				
			   if(date){
			//if($rootScope.selected_t_id==event.items[0]){	
					html=timeline_functions.event_html($scope.selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",$rootScope.selected_notes + "(" +days+" days)" )
					var options={id:$scope.selected_timeline_id,content:html,start:moment(date.startDate)._d,end:moment(date.endDate)._d,start_date:moment(date.startDate)._d,end_date:moment(date.endDate)._d}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
		
			}}				
            }
        }
    
				$scope.$watch('selected_notes', function(selected_note) {

					date=$rootScope.datePicker.date
					days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			
					html=timeline_functions.event_html($scope.selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",selected_note,days)
					var options={id:$scope.selected_timeline_id,content:html,notes:selected_note}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
			})
			
		
			
			$scope.$watch('selected_item', function(selected_item) {

			date=$rootScope.datePicker.date
			days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			//if($rootScope.selected_t_id==event.items[0]){	
					html=timeline_functions.event_html(selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",$rootScope.selected_notes ,days)
					var options={id:$scope.selected_timeline_id,content:html,name:selected_item}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
			})
	 
	$scope.$watch('stack', function(stack) {
		
		
		 if(typeof(stack)!="undefined"){
			 
			   options={stack:stack}
		timeline_functions.updateOptions(options)
		  }
        })

        $scope.editing = [];
        $scope.timeline = Timeline.query();


		
		
        $scope.removeTimeline = function(id) {
            Timeline.remove({
                id: id
            })
        }
        Timeline.query({}, function(team) {
            _.each(team, function(row,index) {
		
		 
		 var timeline = $scope.timeline[index];
		 if(timeline.group=="Bristol Archives"){
            Timeline.remove({
                id: timeline._id
            }, function() {
               // $scope.timeline.splice(index, 1);
            });
			}
			
            })
        })
		
	
        $scope.save = function() {
		
            if (!$scope.newTimeline || $scope.newTimeline.length < 1) return;
            var timeline = new Timeline({
                name: $scope.newTimeline,
                completed: false
            });

            timeline.$save(function() {
		
                $scope.timeline.push(timeline);
                $scope.newTimeline = ''; // clear textbox
            });
        }

        $scope.update = function(index) {
            var timeline = $scope.timeline[index];
            Timeline.update({
                id: timeline._id
            }, timeline);
            $scope.editing[index] = false;
        }

        $scope.edit = function(index) {
            $scope.editing[index] = angular.copy($scope.timeline[index]);
        }

        $scope.cancel = function(index) {
            $scope.timeline[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        }

        $scope.remove = function(index) {
            var timeline = $scope.timeline[index];
            Timeline.remove({
                id: timeline._id
            }, function() {
                $scope.timeline.splice(index, 1);
            });
        }

        $scope.datePicker = "";
        $scope.datePicker.date = {
            startDate: null,
            endDate: null
        };
        $scope.machine_types = [];
        $scope.type = "all";
        $scope.changedValue = function(type) {
            $scope.data = []
            $scope.series = []
            $scope.category = []
            $scope.type = type
            plot_graph()
        }


        $scope.machinesx = ["all"]
        $scope.filterCondition = {
            machine: 'neq'
        }
        $scope.$watch('type', function(type) {
            $scope.machinesx = ["all"]


        })

  

        $scope.$watch('machine', function() {



            })
            // selected fruits
        $scope.machine_types_selection = [];



        $scope.categories = [];

        // selected fruits
        $scope.category_selection = [];




        var _data = [];
        $scope.data = []
        $scope.day_data = []
        $scope.team = [];
        $scope.labels = $scope.team
        $scope.chart_title = "Machine activity"

        var timeline

     

            var groups = new vis.DataSet();
            var dates = new vis.DataSet();
			var dates = new vis.DataSet();
			var second_dates = new vis.DataSet();
            var all_groups = []
            var i = 0

      

      install_days_tally = 0
	  install_instance_tally=0 
	  derig_tally = 0
	 derig_days_tally=0
            Timeline.query({}, function(team) {
			 
                _.each(team, function(data) {
				
				
				data.days=timeline_functions.days(data.start_date,data.end_date)
					var end_date
                    if ( data.group != "") {
						if( data.start_date!=""){
					if(typeof(data.end_date)!="undefined"){
						end_date=(moment(data.end_date).format("MMM Do YY"))
						}
						if(data._type=="INSTALL"){
						install_instance_tally++
						 install_days_tally +=data.days
						}
						else if(data._type=="DERIG"){
						derig_tally++						
						  derig_days_tally +=data.days
						  }
						if( 	$rootScope.added_track_groups.indexOf(data._type)==-1){	
						
						 $rootScope.added_track_groups.push(data._type)
						  //	$rootScope.track_groups.push({"track":data._type})
						}
							
							
						   second_dates.add({
								_id: data._id,
								className:data.className,
								select_group :false,
								name:data.name,
								_type:data._type,
								track:data._type,
								content: timeline_functions.event_html(data.name,"","",moment(data.start_date).format("MMM Do YY") , end_date ||"",data.notes ,data.days),
								group: data.group||"NA",
								order:data._type,
								notes: data.notes,
								title:data.notes,
								start: data.start_date,
								days:data.days,
								end: data.end_date 
							})
						}
                    }
                })
			  timeline_functions.get_events().then(function(data) {
			  			
			var checked_event_types=[]
			
			if($("#add_emu_exhibitions").is(':checked')){
				
				checked_event_types.push('Exhibition')
				checked_event_types.push('Gallery')
				
			}
		
			
			//if($("#whats_on").is(':checked')){
				checked_event_types.push('Family')
				checked_event_types.push('Tour')
				checked_event_types.push('Walk')
				checked_event_types.push('Rides')
				checked_event_types.push('Tours')
				checked_event_types.push('Talk')
				checked_event_types.push('Lecture')
				checked_event_types.push('Special Event')
				checked_event_types.push('Event')
				
			//}
			
			   _.each(data.data, function(events) {
			   _.each(events, function(event) {
												
											//if( event.startDate!=""){
												
											//if( checked_event_types.indexOf(event.type)>=0){	
											if( event.type=="Exhibition"||event.type=="Gallery"){
											var end_date=new Date(event.endDate)
											
											if(event.endDate==""||event.endDate==event.startDate){
										
											var end_date=new Date(event.startDate)
											//end_date.setDate(end_date.getDate() + 1)
										
											}
											var group =	"NA"
											if( event.type=="Exhibition"||event.type=="Gallery"){
											 group =	event.event_space||"NA" 
											}
											else{
												 group =	event.type ||"NA"
											}
													
												var eventimages = false
												if(event.images[0]){
												eventimages=event.images[0].irn
												}
												var htmlContent =  timeline_functions.event_html(event.name,true&&event.images[0],eventimages,event.startDate,event.endDate)
													if( 	$rootScope.added_track_groups.indexOf(event.venue)==-1){
												$rootScope.added_track_groups.push(event.venue)														
													$rootScope.track_groups.push({"track":event.venue})
													}
													select_group = true
													if($routeParams.track){
													select_group = false
													if($routeParams.track=="Arts and Events"){
													//select_group = true
													}
													}
													
													
													dates.add({
																		group		:	group, 
																		select_group :select_group,
																		title		:	event.name,
																		name:event.name,
																		type		: "background",
																		content		:	htmlContent,
																		order:event.venue+event.event_space,
																		track:event.venue,
																		start		:	new Date(event.startDate), 
																		end			:	event.endDate, 
																		className 	:	"green",
																		event_type  :   "WHATS ON"
																		})
																		
											//}
											}

			  })
			    })
			
			_.each(second_dates._data, function(date) {
			dates.add(date)
			})
			$scope.total_install_derig=install_days_tally+derig_days_tally
			$scope.average_install_length=Math.round(install_days_tally/install_instance_tally)
			$scope.average_derig_length=Math.round(derig_days_tally/derig_tally)
				  timeline_functions.setup(Timeline,groups,dates)
				  
				

		$scope.team_leave()
	
	

	
	$scope.learning_bookings()
	$scope.loans()
	$scope.shopify()
	
	var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')

	   Timeline_data.query({}, function(data) {
	_.each(data, function(data_settings) {
		console.log('data_settings',data_settings)
		$scope.timeline_googlesheets_functions(data_settings)
	})	
	   })

	
		$scope.$watch('lockstatus', function (status) {
		
  timeline_functions.prettyPrompt('say the magic word', '',"", function(value) {
	
                            if (value!="" && md5(value)=="f1a81d782dea6a19bdca383bffe68452") {
								$scope.unlock=true
	timeline_functions.unlock(true)
							}
							else
							{
							//$scope.lockstatus=true	
								$scope.unlock=false
							timeline_functions.unlock(false)
								
							}
  })
		
  }, true);
	
	$scope.$watch('track_groups|filter:{selected:true}', function (nv) {
    var selection = nv.map(function (track_groups) {
      return track_groups.track;
    });
	timeline_functions.changeTracks(selection)
	//$( ".draggable,.iconbar" ).css({ 'top':'0px' });
  }, true);
	
		 $scope.$watch('groups|filter:{selected:true}', function (nv) {
    var selection = nv.map(function (group) {
      return group.content;
    });
	timeline_functions.changeGroups(selection)
	$( ".draggable,.iconbar" ).css({ 'top':'0px' });
  }, true);
			
            })
			
		$scope.exportCSV= function(){
		data_to_export=$rootScope.timeline.itemsData.getDataSet()
		
		visibles=$rootScope.timeline.getVisibleItems()
		events=[]
		
		  _.each(data_to_export._data, function(event,index) {
		
		  if(visibles.indexOf(event.id)!=-1){
		  console.log("in")
		  var _event ={  
						 id			:event.id,
						 name		:event.name,
						 start_date	:moment(event.start).format("DD/MM/YYYY"),
						 end_date	:moment(event.end).format("DD/MM/YYYY"),
					     event_type	:event.track
					   
						}
			 events.push(_event)
				}
		  
		   
		  
		  })
				
		timeline_functions.export_JSON_to_CSV(events, "Timeline dates", true)
	}
	$scope.leaveChanged= function(leave){
				
		
	}
	

				
			$scope.team_leave= function(){
			
			if( $scope.isloggedin){
			
			console.log($scope.user)
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_leave_functions.get_eventss().then(function(data) {
					 
						timeline_leave_functions.add_leave(data, function(leave_dates){
							 
							 $rootScope.leave_groups = timeline_functions.loadgroups(leave_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							
							 _.each(leave_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
					
			}
			
			}
			
			$scope.shopify= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  Shopify_aggregate.query({}, function(datax) {
					
						timeline_shopify_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
			}
				$scope.loans= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_loans_functions.get_events().then(function(datax) {
					
						timeline_loans_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
			}
			
		
			
			
			$scope.timeline_googlesheets_functions= function(data_settings){
			
					 var groups =$rootScope.groups
					 $rootScope.timeline.setGroups(groups);
					 
				

					timeline_googlesheets_functions.get_events(data_settings)
				  		  
			}
			
		
			
			
			$scope.learning_bookings= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_learning_functions.get_events().then(function(datax) {
					
						timeline_learning_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
			}
			

			

  
		       
            $scope.list1 = {
                title: 'PROVISIONAL DATE'
            };
            $scope.list2 = {
                title: 'INSTALL'
            };
            $scope.list3 = {
                title: 'DERIG'
            };

            $scope.onDropComplete = function(data, evt) {
                // console.log("drop success, data:", data);
            }
			
		


        })

    };

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-controller.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_googlesheets_functions =  function (timeline_functions,$http,Timeline,$rootScope,$routeParams) {

  return {
	  
	  get_events: function(data_settings) {
	  var self = this
	  
	   if(data_settings.data_feed_url){
		   
	  return $http.get(data_settings.data_feed_url).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
		else
		{
		 
	  return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id="+data_settings.googlesheet_id).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
   },
  
  	add_events: function (data_settings,eventss, fn){
	
							
									var visevents = new vis.DataSet();
									var self=this
									var today = new Date()
								
												$.each(eventss.data[data_settings.googlesheet_name].events || eventss.data[data_settings.googlesheet_name], function( index, event ) {	
												//$.each(eventss.data['england-and-wales'].events, function( index, event ) {	
													if($rootScope.added_track_groups.indexOf(data_settings.track)==-1){	
														$rootScope.added_track_groups.push(data_settings.track)	
														$rootScope.track_groups.push({"track":data_settings.track})
													}
												
												if(data_settings.type=="numerical"){
												
												scale_class="";	
												
										
												
												if(event[data_settings.value_column] >data_settings.val_1 && event[data_settings.value_column]<=data_settings.val_2){scale_class="scale_01"}
												
												if(event[data_settings.value_column] >data_settings.val_2 && event[data_settings.value_column]<=data_settings.val_3){scale_class="scale_02"}
												
												if(event[data_settings.value_column] >data_settings.val_3 && event[data_settings.value_column]<=data_settings.val_4){scale_class="scale_03"}
												
												if(event[data_settings.value_column] >data_settings.val_4 && event[data_settings.value_column]<=data_settings.val_5){scale_class="scale_05"}

												if(event[data_settings.value_column] >data_settings.val_5 && event[data_settings.value_column]<=data_settings.val_6){scale_class="scale_06"}
												
												if(event[data_settings.value_column] >data_settings.val_6 && event[data_settings.value_column]<=data_settings.val_7){scale_class="scale_07"}
												
												if(event[data_settings.value_column] >data_settings.val_7 &&event[data_settings.value_column]<=data_settings.val_8){scale_class="scale_08"}
												if(event[data_settings.value_column] >data_settings.val_8 && event[data_settings.value_column]<=data_settings.val_9){scale_class="scale_09"}
													if(event[data_settings.value_column] >data_settings.val_9 && event[data_settings.value_column]<=data_settings.val_10){scale_class="scale_09"}
												if(event[data_settings.value_column] >data_settings.val_10){scale_class="scale_10"}
																						
													
													
													if(data_settings.use_moment==true){
													
													start_date=moment(event[data_settings.date_column])._d
													end_date=moment(event[data_settings.date_column])._d
													end_date.setDate(end_date.getDate() + 1)
													
													}
													else
													{
														
													start_date=event[data_settings.start_column]
													end_date=event[data_settings.end_column]
													
														
													}
																								
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}
														
														visevents.add( {content:"" ,
																		select_group:select_group,
																		group:event[data_settings.group_column]|| data_settings.group,
																		group_id:event[data_settings.group_id_column]||data_settings.track ,
																		name:event[data_settings.value_column].toFixed(2),
																		title:event[data_settings.value_column].toFixed(2),
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		subgroup: event[data_settings.subgroup_column],
																		start:start_date,
																		end:end_date,
																		className 	:	scale_class
																		})
													
														
														
												}
												
												else
													
												{
													
														
													if(data_settings.use_moment==true){
														start_date=moment(event[data_settings.date_column])._d
														end_date=moment(event[data_settings.date_column])._d
														end_date.setDate(end_date.getDate() + 1)
													}else
													{
													start_date=new Date(event[data_settings.start_column])
													//end_date=new Date(start_date) //required e.g. art and events
													var end_date=new Date(start_date).setDate( start_date.getDate() + 1);
													
													end_date=new Date(start_date) //required e.g. art and events
													end_date.setDate( start_date.getDate() + 1);
													}
													
													
													
												
													
									var event_image=false
											var event_image_irn
											if(event.images){
											if(event.images[0]){
												event_image=true
												event_image_irn=event.images[0].irn
												}
											}
												
													var htmlContent =  self.event_html(event[data_settings.title_column],event_image,event_image_irn,start_date,end_date)
												
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}  
													
													
													//if(!data_settings.checked_event_types || (event[data_settings.group_column]!="" && data_settings.checked_event_types.indexOf(event[data_settings.group_column])!=-1 && new Date(event[data_settings.start_column]))){
												
														this_event={content:htmlContent ,
																		select_group:select_group,
																		group_id:event[data_settings.group_column]+data_settings.track || data_settings.track,
																		name:event[data_settings.title_column] ||"NA"  ,
																		title:event[data_settings.title_column] ||"NA"  ,
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		start:start_date,
																		className :data_settings.colour
																		}
																		
														
														if(data_settings.subgroup_column!=""){
															this_event.subgroup=event[data_settings.subgroup_column]
														}
														if(data_settings.group!=""){
															this_event.group=data_settings.group
														}
														if(data_settings.group_column){
															this_event.group= event[data_settings.group_column]
														}
														
														
														
														
														//if(data_settings.end_column){
															this_event.end=end_date
													//}
														if(this_event.start && this_event.group )	{		
														visevents.add(this_event)
														}
														else{
															console.log('no start or group',this_event)
														}
														
														
												//}
												}
													})
									
										return	fn(visevents)

		},
		
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-googlesheets-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_learning_functions = function ($http,Timeline,$rootScope) {
	
	

  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/~brlsmp4/learning/scripts/php/api/api.php?table=bookings"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("school visits")==-1){
												$rootScope.added_track_groups.push("school visits")														
													$rootScope.track_groups.push({"track":"school visits"})
													}
												console.log('eventss',eventss)
												$.each(eventss.data, function( index, event ) {	
																	end_date=new Date(event.event_date) 
																	end_date.setDate( end_date.getDate() + 1);
														if(	event.school_name!=""){											
														visevents.add( {content:event.school_name  ,
																		name:event.school_name  ,
																		group:event.site,
																		group_id:event.site+"school visits",
																		//id:event.id,
																		event_type:"public holidays",
																		track:"school visits",
																		order: "school visits",
																		className:"orange",
																		start:event.event_date,
																		end:end_date,
																		subgroup:"na",
																		notes 	:	event.booking_form_info
																		})
																		}
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-learning-bookings-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_leave_functions =  function ($http,Timeline,$rootScope) {

  return {
  
     get_eventss: function() {
      return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id=1v69qKCc-8FYx8VuKPZMr1QkTMfJsh7qZTZJ7q7o3YTg");  //1. this returns promise
    },
  
  
  
  	add_leave: function (eventss, fn){
	
								
									  var visevents = new vis.DataSet();
									var self=this
									


							
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
										
												
												$.each(eventss.data.tally, function( index, leave_record ) {	
																						
															if(leave_record.NAME!=oldName){
																	if(name.start_date!=""){
																	
																			names.push(name)
																			name=[]
																	}
																			oldName =leave_record.NAME
																			lastfrom_date=leave_record.DATE
																			 mylastfrom_date = new Date(leave_record.DATE);
																			name.start_date= new Date(leave_record.DATE);
																			name.name=leave_record.NAME
																			name.group=leave_record.TYPE
																			
																			
																			var end_date = new Date(lastfrom_date);
																			end_date.setDate(end_date.getDate() + 1);
																			name.end_date=end_date
																	
															}else
															{			
																														
														
															    //where dates are consecutive
																if(new Date(mylastfrom_date) - new Date(leave_record.DATE)==-86400000)	{
																	 mylastfrom_date = new Date(leave_record.DATE);
																	 
																	name.end_date=new Date(leave_record.DATE) 
																	name.end_date.setDate( name.end_date.getDate() + 1);
																}
																else{
																
																names.push(name)
																name=[]	
																name.name=leave_record.NAME
																name.group=leave_record.TYPE
																name.start_date=new Date(leave_record.DATE)	
																var non_consecutive_end_date = new Date(leave_record.DATE);
																name.end_date=non_consecutive_end_date.setDate( non_consecutive_end_date.getDate() + 1);
																
																
																}
	
																	
															}
																				
																
												})
										  

												$.each(names, function( index, value ) {
												
											
											
											
												if(value.name!=""){
													if(value.start_date){
														
														
												/*
												if($("#av_leave").is(':checked') && value.group=="CONTENT DESIGN" ||
												$("#user_research_leave").is(':checked') && value.group=="USER RESEARCH"  ||
												$("#digital_manager_leave").is(':checked') && value.group=="MANAGER"  ||
												$("#digitisation_leave").is(':checked') && value.group=="DIGITISATION"  ||
												$("#technicians_leave").is(':checked') && value.group=="TECHNICIAN"  
												){		
												*/
													if( 	$rootScope.added_track_groups.indexOf("leave")==-1){	
													 $rootScope.added_track_groups.push("leave")	
												$rootScope.track_groups.push({"track":"leave"})
													}
														visevents.add( {content:value.name  ,
																		group:value.group,
																		group_id:value.group+"leave",
																		id:value.id,
																		name:value.name  ,
																		event_type:"leave",
																		track:"leave",
																		order: "leave",
																		subgroup: value.name,
																		start:value.start_date,
																		end:value.end_date,
																		className 	:	"orange"
																		})
																	
														
												//}
														}
														}
														})
													
													
										  					
										
										return	fn(visevents)
									
								
									
								
												
								
		
		
		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	/*
    setup: function(Timeline,groups,dates) {
	var self=this
	
   function prettyConfirm(title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            }

            function prettyPrompt(title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            }
			
			 function selected_data(event) {
			
			
						$rootScope.selected_t_id=event.items[0]
						$rootScope.selected =timeline.itemsData.getDataSet().get(event.items[0])
						$rootScope.selected_item=$rootScope.selected.name
						$rootScope.selected_notes=$rootScope.selected.notes
						$rootScope.datePicker.date={startDate:new Date($rootScope.selected.start),endDate:new Date ($rootScope.selected.end)}
						$rootScope.selected_id=$rootScope.selected._id
					
	
            }

            function logEvent(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            }
        

  var container = document.getElementById('example-timeline');
  
  		 function loadgroups(items){
	
			var _groups=[]
			var addednames=[]
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, addednames)==-1){
					addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group=="Temporary Exhibition Gallery"){ content="M SHED: "+value.group}
					if( value.group=="Window on Bristol"){ content="M SHED: "+value.group}
					if( value.group=="First Floor Foyer"){ content="M SHED: "+value.group}
					
					 _groups.push({
										id			:	value.group,
										display		:	'shown',
										event_type	:	value.event_type,
										content		:   content,
										event_typeSORT	: content
									})
				}
				}
			})

			
			return _groups		

		}
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				


                timeline = new vis.Timeline(container);
				groups=loadgroups(dates)
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
               // timeline.setGroups(groups);
				$rootScope.changeGroups=function(selected){
				
					var selection = []
					selection=$rootScope.myGroup.selected
				
					var list = groups.get({
						filter: function(item) {
							return (item.id in selection && selection[item.id]==item.id);
						}
					})
						timeline.setGroups(list);
						enable_event_drop()
				}
						
				var list = groups.get({
						filter: function(item) {
							return (item.display == "shown");
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				timeline.on('select', function (properties) {
						selected_data( properties)

				});
										
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
                    logEvent(event, properties);
                });

			enable_event_drop=function(event){
		
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                            event.preventDefault()
                          time=(timeline.getEventProperties(event).time)
						group=(timeline.getEventProperties(event).group)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
                            if (value) {
                               	add_item(group,time,value,"blue",30)
							}
							})
							}
							else
							{
								add_item(group,time,ui.draggable[0].innerHTML,"red",7)
							}
							
							function add_item(group,time,value,colour,days){
							 date_dropped=(moment(time).startOf('day')._d)
							
                            var id = ui.draggable[0].id
                            var dateDroppedOn =time
                            target_date = time
							
                            var new_date = {
                                content: value,
								name:value,
                                group: group,
                                className:colour||"",
                                start_date: new Date(moment(date_dropped).startOf('day')._d),
                                end_date: new Date (moment(date_dropped).add(days, 'days')._d)

                            }
                            var _timeline = new Timeline(new_date)
                                .$save(function(_item) {
                                    new_date.start = new Date(_item.start_date)
									type:ui.draggable[0].innerHTML,
                                    new_date.end = new Date(_item.end_date)
                                    new_date._id = _item._id

                                    timeline.itemsData.getDataSet().add(new_date)
									console.log(new_date)
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
                                    }, 1 * 1000);

                                });
							
							
							}
                        }



                    }
                })
				}
				enable_event_drop()
              
    }
	*/ 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-leave-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_loans_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("loans")==-1){
												$rootScope.added_track_groups.push("loans")														
													$rootScope.track_groups.push({"track":"loans"})
													}
												console.log('eventss',eventss)
												$.each(eventss.data, function( index, event ) {	
																	start_date=new Date(event.start_date)
																	end_date=new Date(event.end_date) 																	
																	end_date.setDate( end_date.getDate() + 1);
														if(	event.title!="" && start_date!=""){											
														visevents.add( {content:event.title  ,
																		name:event.title  ,
																		group:event.direction,
																		//id:event.id,
																		event_type:"loans",
																		track:"loans",
																		order: "loans",
																		className:"green",
																		start:start_date,
																		end:end_date,
																		subgroup:"na",
																		notes 	:	event.event_type
																		})
																		}
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-loans-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],28:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.timeline_functions = function ($http,Timeline,$rootScope) {
	

  return {
  
  
  export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
  
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    console.log('arrData',arrData)
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            // console.log('row += index',row += index)
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


},
  
  
     prettyConfirm: function (title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            },

           prettyPrompt: function (title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            },
			
			
	

            logEvent:function(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            },
  
  enable_event_drop:function(event){
		var self = this
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                            event.preventDefault()
                            time=(timeline.getEventProperties(event).time)
							group=(timeline.getEventProperties(event).group)
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
                            if (value) {
                               	add_item(group,time,value,"blue",30)
							}
							})
							}
							else
							{
								add_item(group,time,ui.draggable[0].innerHTML,"red",7)
							}
							
							function add_item(group,time,value,colour,days){
							 date_dropped=(moment(time).startOf('day')._d)
							
                            var id = ui.draggable[0].id
                            var dateDroppedOn =time
                            target_date = time
							_days=self.days(moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d)
                            var new_date = {
                                content: self.event_html(value,"","",moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d, "",_days),
								name:value,
                                group: group,
                                className:colour||"",
								_type:ui.draggable[0].innerHTML,
                                start_date: new Date(moment(date_dropped).startOf('day')._d),
                                end_date: new Date (moment(date_dropped).add(days, 'days')._d),
								days:_days

                            }
                            var _timeline = new Timeline(new_date)
                                .$save(function(_item) {
                                    new_date.start =_item.start_date
                                    new_date.end = _item.end_date
                                    new_date._id = _item._id
									new_date._type=ui.draggable[0].innerHTML,
                                    timeline.itemsData.getDataSet().add(new_date)
									
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
                                    }, 1 * 1000);

                                });
							
							
							}
                        }



                    }
                })
				},
	  
	  unlock: function(unlock){
		
                          
								timeline.setOptions({'editable':unlock});
			
							
		  	
	  
	  },
	  
	   	changeTracks: function(selection){

				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
				var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.track)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},  
		changeGroups: function(selection){

				var groups = new vis.DataSet($rootScope.groups);
				//var group = new vis.DataSet( $rootScope.leave_groups);
				var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.content)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},
  
  
  days: function (start,end){
  
				var a = moment(start);
				var b = moment(end);
				return b.diff(a,'days');
  
  },
  
  		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group.toLowerCase()=="temporary exhibition gallery"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="window on bristol"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="first floor foyer"){ content="<b>M SHED:</b> "+value.group}
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:value.track,
										order:value.order,
										event_type		:	value.event_type,
										content			:   content,
										event_typeSORT	: content,
										 selected: value.select_group 
									})
				}
				}
			})

			console.log(_groups)
			return _groups		

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ,days){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																	if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}	
																htmlContent+=name
																	if(days>0 &&end_date){
																		//htmlContent+='<div class="days">'
																		htmlContent+=" - "+ days + " days"
																		//htmlContent+='</div>';
																}
																htmlContent+='</div>';
																
																htmlContent+="<span> ";
																htmlContent+=start_date 
																if(end_date) {htmlContent+= "-" + end_date};
																htmlContent+="<span>";
																htmlContent+= '</div>'
																htmlContent+='<div class="notes">'
																htmlContent+="<p>"+notes
																
																											
													htmlContent+= '</div>'
													
			return htmlContent

			},
				selected_data:	 function (event) {
			 var self=this
			 //newly selected - get ID to update
					console.log('get ID to update')
					selected_timeline_id=event.items[0]
			//fetch the timeline dataSetitem 
					selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
			//update the data entry form
			console.log(selected_item)
			
			$rootScope.selected_timeline_id=selected_timeline_id
			$rootScope.selected_item=selected_item.name
			$rootScope.selected_type=selected_item._type
			if(selected_item.days>0){
			$rootScope.selected_days=" - " +selected_item.days + " days"
			}
			$rootScope.selected_id=selected_item._id
			$rootScope.selected_notes=selected_item.notes
			$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
			

            },
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
		timeline.itemsData.getDataSet().update(options)
		}
			
	},
	
    setup: function(Timeline,groups,dates) {
	var self=this
	

         var options = {
					min: new Date(2014, 0, 1),                // lower limit of visible range
					max: new Date(2022, 0, 1),                // upper limit of visible range
					zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
					zoomMax: 1000 * 60 * 60 * 24 * 31 * 500 ,    // about six months in milliseconds
                    width: '100%',
					maxHeight:"900px",
					moveable:true,
					itemsAlwaysDraggable:true,
					
					 snap: function (date, scale, step) {
					return date;
				   },
						
					//groupEditable:true,
					stack:false,
					orientation:{"axis":"top"},
                    editable: false,  
					 groupOrder:'order',					
                    onMove: function(item, callback) {
$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}
                        var _timeline = new Timeline({
                          //  content: item.content,
							 content:  self.event_html(item.name,"","",item.start, item.end,item.notes ),
                            group: item.group,
                            start_date: item.start,
                            end_date: item.end,
                            _id: item._id
                        })
                       
                        Timeline.update({
                            id: item._id
                        }, _timeline);

                        callback(item);

                    },
                    onUpdate: function(item, callback) {

                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
                                var _timeline = new Timeline({
                                    content:  self.event_html(value,"","",item.start, item.end,item.notes ,days),
									name: item.name,
                                    group: item.group,
                                    start_date: item.start,
                                    end_date: item.end,
									days:self.days(item.start,item.end)

                                })
                               
                                Timeline.update({
                                    id: item._id
                                }, _timeline);
                                callback(item);
                            } else {
                                callback(null); // cancel updating the item
                            }
                        });

                    },
                    onAdd: function(item, callback) {


                        self.prettyPrompt('Add note', 'Add some notes to this date:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted new item
								
								days=self.days(item.start, moment(item.start).add(5, 'days'))
																		
     
                                var _timeline = new Timeline({
                                        content: self.event_html(value,"","",item.start, moment(item.start).add(5, 'days'),"" ,days),
										name:value,
                                        group: item.group,
										type:"note",
                                        start_date: item.start,
										className:"green"
                                       // end_date: moment(item.start).add(5, 'days'),
										//days:self.days(item.start, moment(item.start).add(5, 'days'))

                                    })
                                    .$save(function(_item) {
                                       // item.end = new Date(_item.end_date)
                                        item._id = _item._id
										  editable: true,
                                        //callback(item);
                                        console.log('add');
                                    });
                            } else {
                                callback(null); // cancel item creation
                            }
                        })


                    },
                    onRemove: function(item, callback) {

                        if (item._id) {
                            Timeline.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };

  var container = document.getElementById('example-timeline');
  
  
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				


                timeline = new vis.Timeline(container);
				groups=self.loadgroups(dates)
				$rootScope.rawData=dates
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
           
						
				var list = groups.get({
						filter: function(item) {
							return (item);
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				$rootScope.groups=list
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				//self.changeGroups($rootScope.groups.selected)
				
				timeline.on('select', function (properties) {
						self.selected_data( properties)

				});
				
				
					$rootScope.timeline=timeline					
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
                    self.logEvent(event, properties);
                });

			
				self.enable_event_drop()
              
    }
	 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],29:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_shopify_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("Shopify product types")==-1){
												$rootScope.added_track_groups.push("Shopify product types")														
													$rootScope.track_groups.push({"track":"Shopify product types"})
													}
												console.log('shop products',eventss)
												$.each(eventss, function( index, event ) {	
													console.log('shop event',event)
												
															scale_class="";	
												
										
												var val_1 = 0
												var val_2 =2
												var val_3 =4
												var val_4 =6
												var val_5 =8
												var val_6  = 10
												var val_7 = 20
												var val_8 = 30
												var val_9 = 40												
												var val_10 = 50
												
												var count = "count"
												

												if(event[count] >val_1 && event[count]<=val_2){scale_class="scale_01"}												
												if(event[count] >val_2 && event[count]<=val_3){scale_class="scale_02"}												
												if(event[count] >val_3 && event[count]<=val_4){scale_class="scale_03"}											
												if(event[count] >val_4 && event[count]<=val_5){scale_class="scale_05"}
												if(event[count] >val_5 && event[count]<=val_6){scale_class="scale_06"}												
												if(event[count] >val_6 && event[count]<=val_7){scale_class="scale_07"}												
												if(event[count] >val_7 &&event[count]<=val_8){scale_class="scale_08"}
												if(event[count] >val_8 && event[count]<=val_9){scale_class="scale_09"}
												if(event[count] >val_9 && event[count]<=val_10){scale_class="scale_09"}
												if(event[count] >val_10){scale_class="scale_10"}
																						
													
													
													
																
																	var start_date=new Date(event._id.month+"/"+event._id.day+"/"+event._id.year)
																	var end_date=new Date(start_date)
																	end_date.setDate( end_date.getDate() + 1);
																
																
																var shopEvent =  {content:"",
																			title:event.count  ,
																			name:event.count  ,
																			group:event._id.type,
																			track:"Shopify product types",
																			order: "Shopify product types",
																			className:scale_class,
																			start:start_date,
																			end:end_date
																		}
console.log('shopEvent',shopEvent)																		
														visevents.add( shopEvent)
																		
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-shopify-services.js","/../components/timeline")
},{"b55mWE":6,"buffer":5}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.ProductDetailsController = function($scope, $routeParams, $http) {
  var encoped = encodeURIComponent($routeParams.id);
  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      $scope.product = data.product;
    });
  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};





}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/controllers.js","/controllers")
},{"b55mWE":6,"buffer":5}],31:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	
exports.NavController = function(AuthService,$scope,$http) {

  $scope.user="not logged in"
  AuthService.isLoggedIn().then(function(user){
	  $scope.user=(user.data)
  })

       
    
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/navbar-controller.js","/controllers")
},{"b55mWE":6,"buffer":5}],32:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

	exports.userMenu = function() {
  return {
    controller: 'NavController',
    templateUrl: './shared/templates/user_menu.html'
  }
	}
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/directives/directives.js","/directives")
},{"b55mWE":6,"buffer":5}],33:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';
/* app */
var underscore = angular.module('underscore', []);
require('angular-touch')
require('async')
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
 
var controllers = require('../shared/controllers/controllers');
var dead_controllers = require('../components/machine-monitor/dead-controller');

var nav_controller = require('../shared/controllers/navbar-controller');
var tech_support_controller = require('../components/tech-support/tech-support-controller');


var dashboard_controllers = require('../components/machine-monitor/dashboard-controller');
var feedback_controllers = require('../components/machine-monitor/feedback-controller');
var downtime_controllers = require('../components/machine-monitor/downtime-controller');


var app_controllers = require('../components/team/app-controllers');
var leave_controllers = require('../components/team/leave-controller');
var team_controllers = require('../components/team/team-controller');
var member_controllers = require('../components/member/member-controller');
var form_controllers = require('../components/team/form-controller');
var timeline_controllers = require('../components/timeline/timeline-controller');
var timeline_settings_controller = require('../components/timeline-settings/timeline-settings-controller');


var directives = require('../shared/directives/directives');
var data_services = require('../shared/services/data-services');
var app_services = require('../shared/services/app-services');

var timeline_services = require('../components/timeline/timeline-services');
var timeline_leave_services = require('../components/timeline/timeline-leave-services');
var timeline_shopify_functions = require('../components/timeline/timeline-shopify-services');



var timeline_googlesheets_functions = require('../components/timeline/timeline-googlesheets-services');
var timeline_learning_services = require('../components/timeline/timeline-learning-bookings-services');
var timeline_loans_services = require('../components/timeline/timeline-loans-services');
var tech_trello_services = require('../components/tech-support/trello-services');

var downtime_services = require('../components/machine-monitor/downtime-services');
var feedback_services = require('../components/machine-monitor/feedback-services');




	var app =  angular.module('app', [
		'ngRoute',
		'ngAnimate',
		'ngTouch',
		'ngResource',
		'ngSanitize',//,
		'angularUtils.directives.dirPagination',
		'underscore',//,
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
		'ui.router'	,	
		'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns'
		])
		
		
	
	
_.each(controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(feedback_controllers, function(controller, name) {
  app.controller(name, controller);
});


_.each(dead_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(nav_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(tech_support_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(downtime_controllers, function(controller, name) {
  app.controller(name, controller);
});



_.each(app_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(leave_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(team_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(member_controllers, function(controller, name) {
  app.controller(name, controller);
});


_.each(form_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(timeline_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(timeline_settings_controller, function(controller, name) {
  app.controller(name, controller);
});








 _.each(directives, function(directive, name) {
  app.directive(name, directive);
});





_.each(data_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(app_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(downtime_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(feedback_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_leave_services, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_shopify_functions, function(factory, name) {
  app.factory(name, factory);
});




_.each(timeline_googlesheets_functions, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_learning_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_loans_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(tech_trello_services, function(factory, name) {
  app.factory(name, factory);
});


app.filter('orderByDayNumber', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
})

app.config(function config(formlyConfigProvider) {


  formlyConfigProvider.setType([
  {
    name: 'radio',
	overwriteOk:true,
    templateUrl: 'views/formly-radio.html'
  },
  {
    name: 'button',
    templateUrl: '<button ng-click="options.templateOptions">{{options.label}}</button>'
  }
]);

  formlyConfigProvider.setType({
    name: 'input',
	overwriteOk:true,
    template: '<input class="form-control_CHEESE" ng-model="model[options.key]">',
    wrapper: ['helper', 'bootstrapLabel', 'bootstrapHasError']
  });
  

  
  formlyConfigProvider.setType({
    name: 'file',
     templateUrl: 'views/formly-file.html'
  });

});


app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_b32ea222.js","/")
},{"../components/machine-monitor/dashboard-controller":9,"../components/machine-monitor/dead-controller":10,"../components/machine-monitor/downtime-controller":11,"../components/machine-monitor/downtime-services":12,"../components/machine-monitor/feedback-controller":13,"../components/machine-monitor/feedback-services":14,"../components/member/member-controller":15,"../components/team/app-controllers":16,"../components/team/form-controller":17,"../components/team/leave-controller":18,"../components/team/team-controller":19,"../components/tech-support/tech-support-controller":20,"../components/tech-support/trello-services":21,"../components/timeline-settings/timeline-settings-controller":22,"../components/timeline/timeline-controller":23,"../components/timeline/timeline-googlesheets-services":24,"../components/timeline/timeline-learning-bookings-services":25,"../components/timeline/timeline-leave-services":26,"../components/timeline/timeline-loans-services":27,"../components/timeline/timeline-services":28,"../components/timeline/timeline-shopify-services":29,"../shared/controllers/controllers":30,"../shared/controllers/navbar-controller":31,"../shared/directives/directives":32,"../shared/services/app-services":34,"../shared/services/data-services":35,"angular-touch":2,"async":3,"b55mWE":6,"buffer":5}],34:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.date_calc = function($http) {	
		

var date_calc = {};

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(2008,01,12);
var secondDate = new Date();

date_calc.diffDays  = function (firstDate) {
var firstDate = new Date(firstDate);
         return secondDate.getMonth() - firstDate.getMonth()
       + (12 * (secondDate.getFullYear() - firstDate.getFullYear()));

    };
	

    return date_calc;

}


    
exports.trello = function($http) {	

	

			var trello = {};
			trello.auth = function () {
		
				var authenticationSuccess = function() { 
				console.log("sucessful authentication");
				var token = Trello.token();
				window.location.replace(decodeURIComponent(window.location.hash));
				console.log("Successful authentication");
				};
					var authenticationFailure = function() {alert("Failed authentication"); };

					 Trello.authorize({
					  type: 'redirect',
					  name: 'Bristol Culture Trello Monitor',
					  scope: {
						read: 'true',
						write: 'true' },
					  expiration: 'never',
					  success: authenticationSuccess,
					  error: authenticationFailure
					});
				

			};
			return trello;

}

exports.get_trello_board = function (Team,Tallys,date_calc,$http,$rootScope) {	


    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
    trello.get_data = function (listx) {
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			
		 return Trello.get("lists/"+listx.id+"/cards", function(cards) {
		 var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
					
		   angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points =  (card_count / (list.average/1 + 1)).toFixed(2)
					

					  Team.query({}, function(_team) {
							_.each(_team, function(row) {
								if(row.name==listx.title){
									
									   var tally = new Tallys({
										name: listx.title,
										date: new Date(),
										points: list.points
									});
									//$scope.tallys = Tallys.query();


									tally.$save();
					
					
										var team = Team.get({ id:row._id });
											  team.name= list.title
											  team.score=list.points
											  team.card_count=  list.card_count
											  team.bonus=""
											  teampenalty=list.average 
										$id = row._id;
										 Team.update({ id:$id }, team);
										$rootScope.message="update"	
								}
									
								});
						});
		 
		 console.log('end of service')
		 }).then(
			function (response){
				return response
				
			}
		 )
				
			

    };


		

    return trello;

}



exports.detect_dragging= function($rootScope) {


	
var detect_dragging=[]
 $rootScope.isDragging = false;
var currentPos = [];
detect_dragging.drag_handler= function(){
 $('md-content').on('mousedown', function (evt) {

   currentPos = [evt.pageX, evt.pageY]

 $('md-content').on('mousemove', function handler(evt) {

    currentPos=[evt.pageX, evt.pageY];
    $('#content-scroller').off('mousemove', handler);

  });

 $('md-content').on('mouseup', function handler(evt) {
	
    if(evt.pageX+ evt.pageY==currentPos[0]+currentPos[1]){
			console.log('clicking')
       $rootScope.isDragging = false;
	}
    else
	{
      $rootScope.isDragging = true;
		console.log('dragging')
	}
 $('md-content').off('mouseup', handler);
 
  });

});
}

/* App Module */

  return detect_dragging

}


exports.screen_saver_loop=function($rootScope,$location,$interval,Team) {

	



				//NB make sure any views called int he screensaver dont contain the screensaver service!
				 var sharedService = {};
				 

	var team_list=[]
	var support_list=[]
	var roadmap_list=[]
		var list=[]
	list.title="BMAG DIGITAL SUPPORT"
	list.id="56051e0244bb2e4efc9e6e99"	  
    support_list.push(list)
	
	var list=[]
	list.title="MSHED DIGITAL SUPPORT"
	list.id="562667caadda958dad274f22"	  
    support_list.push(list)
	
	var list=[]
	list.title="ZAHID"
	list.id="5257d4e719e0ee3b5800009c"	  
    team_list.push(list)
	
	var list=[]
	list.title="DARREN"
	list.id="55cdc7672fff3ffc946f6e94"	  
    team_list.push(list)
	
	var list=[]
	list.title="TOM"
	list.id="563234399bfcf125dc06f03b"	  
    team_list.push(list)	
		
		
	var list=[]
	list.title="LACEY"
	list.id="57f3b32311fbe4f9966de748"	  
    team_list.push(list)	

		
	var list=[]
	list.title="FAY"
	list.id="53344421ba92789d64cf8f99"	  
    team_list.push(list)
	
		var list=[]
	list.title="MARK"
	list.id="5790fb082acddb2d98c04826"	  
    team_list.push(list)
	
	var list=[]
	list.title="DAVID"
	list.id="52c3f521160978433b073a9b"	  
    team_list.push(list)
	
	
	
	
	var list=[]
	list.title="Q3"
	list.id="5763ca5d82c12dc42e874e0a"	  
   	  
    roadmap_list.push(list)
	
	var list=[]
	list.title="Q4"
	list.id="5763ca6c8981e9d4c9da0e23"	  
   


   roadmap_list.push(list)
	

	$rootScope.team=team_list
	$rootScope.support=support_list
	$rootScope.roadmap=roadmap_list
	
				 var currentView= ['/a/team','/a/support','/a/roadmap','/board']
				  $rootScope.i = 0
				 var timer
				 
				function switchview(i){
					
						 var videoElement = $('iframe').contents().find("video").get(0)
					
						if(!audioplayer ){var audioplayer=""}
						 var audioElement_not_playing = audioplayer.paused
						 

				if  ((!videoElement || videoElement.paused) && !audioplayer|| audioplayer.paused==true) {
					
			
						
						$rootScope.updateInterval 
						console.log(i)
						if(i>=screensaver.length){i=0;$rootScope.i=0}
						//app_start_log(kiosk,"SCREENSAVER")						
						$location.path( currentView[$rootScope.i])
						$rootScope.i++
					}
					else{
						
						console.log('video playing..cancel')
					}
					
						

				}

				//	$interval.cancel(timer);

				  sharedService.start_screen_saver = function() {
					
			
					  $interval.cancel($rootScope.timer );
					
					if($location.path()!="/screen_saver_images"){	
							$rootScope.screensaver_on=true
						
							$rootScope.timer = $interval(function() { switchview( $rootScope.i) }, 5   * 60*   1000)
					}
					
				  
				  };

				  sharedService.screensaverOff = function() {
						$rootScope.screensaver_on=false
					   $interval.cancel($rootScope.timer );
					   console.log('screensaver off')
					  
				
				   
				  };

				  return sharedService;
}
  
  



}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/services/app-services.js","/services")
},{"b55mWE":6,"buffer":5}],35:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var status = require('http-status');

exports.AuthService = function($http) {

   var currentUser;

  return {
    login: function() { },
    logout: function() {  },
    isLoggedIn: function() {
        return $http.get('/user_data')	
	},
    currentUser: function() { 
	$http.get('/user_data').then(function(result){
			currentUser = result;
		});
	}
   
  };

};



exports.Tallys = function($resource){
	

          return $resource('/tallys/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.Timeline =  function($resource){
		
		 
          return $resource('/timeline/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.delete_leave_by_id = function(Team,$rootScope){
 
 
 var delete_leave_by_id = {};
 
 
 delete_leave_by_id._delete  = function(leave_id){
 
 ids_to_delete=[]
 ids_to_delete.push(leave_id)
 
 		 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
		
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
											
											$rootScope.me_Data=team[i]
							
							
		
		 
						
           
        
						
				})
			})
 
 
 }
 
  return delete_leave_by_id;
 }
 
  exports.Tech_support =  function($resource){
	  
		 
          return $resource('/tech_support/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
 exports.Leave =  function($resource){
	  
		 
          return $resource('/leave/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
  exports.Shopify_aggregate =  function($resource){
		
			 
          return $resource('/shopify_aggregate/:id', null,
		  { 'get':    {method:'GET'}  // get individual record
	
          });
}
  
   exports.Timeline_data =  function($resource){
		
			 
          return $resource('/timeline_data_settings/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}
  
 exports.Timeline =  function($resource){
		
			 
          return $resource('/timeline/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}
		
 exports.Team =  function($resource){
	 
		 
          return $resource('/team/:id', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
  exports.Todos =  function($resource){
        
        
          return $resource('/todos/:id', null, {
            'update': { method:'PUT' }
          });
  }
		
		
	
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/services/data-services.js","/services")
},{"b55mWE":6,"buffer":5,"http-status":7}]},{},[33])