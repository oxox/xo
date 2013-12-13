/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */



var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);




(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      tagTypes = {
        '#': 1, '^': 2, '/': 3,  '!': 4, '>': 5,
        '<': 6, '=': 7, '_v': 8, '{': 9, '&': 10
      };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push(new String(buf));
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) ||
          (!tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (!tokens[j].tag) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = tagTypes[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - ctag.length : i + otag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        token = null;

    while (tokens.length > 0) {
      token = tokens.shift();
      if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
        instructions.push(token);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else {
        instructions.push(token);
      }
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  Hogan.generate = function (tree, text, options) {
    var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
    if (options.asString) {
      return 'function(c,p,i){' + code + ';}';
    }

    return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function walk(tree) {
    var code = '';
    for (var i = 0, l = tree.length; i < l; i++) {
      var tag = tree[i].tag;
      if (tag == '#') {
        code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n),
                        tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
      } else if (tag == '^') {
        code += invertedSection(tree[i].nodes, tree[i].n,
                                chooseMethod(tree[i].n));
      } else if (tag == '<' || tag == '>') {
        code += partial(tree[i]);
      } else if (tag == '{' || tag == '&') {
        code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag == '\n') {
        code += text('"\\n"' + (tree.length-1 == i ? '' : ' + i'));
      } else if (tag == '_v') {
        code += variable(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag === undefined) {
        code += text('"' + esc(tree[i]) + '"');
      }
    }
    return code;
  }

  function section(nodes, id, method, start, end, tags) {
    return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' +
           'c,p,0,' + start + ',' + end + ',"' + tags + '")){' +
           '_.rs(c,p,' +
           'function(c,p,_){' +
           walk(nodes) +
           '});c.pop();}';
  }

  function invertedSection(nodes, id, method) {
    return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' +
           walk(nodes) +
           '};';
  }

  function partial(tok) {
    return '_.b(_.rp("' +  esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
  }

  function tripleStache(id, method) {
    return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function variable(id, method) {
    return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function text(id) {
    return '_.b(' + id + ');';
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  },

  Hogan.cache = {};

  Hogan.compile = function(text, options) {
    // options
    //
    // asString: false (default)
    //
    // sectionTags: [{o: '_foo', c: 'foo'}]
    // An array of object with o and c fields that indicate names for custom
    // section tags. The example above allows parsing of {{_foo}}{{/foo}}.
    //
    // delimiters: A string that overrides the default delimiters.
    // Example: "<% %>"
    //
    options = options || {};

    var key = text + '||' + !!options.asString;

    var t = this.cache[key];

    if (t) {
      return t;
    }

    t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = t;
  };
})(typeof exports !== 'undefined' ? exports : Hogan);


(function($,T,B){
    //module define function
    window['XO'] = function(id,fn){
        if(XO[id]){
            console.warn('Module with id ['+id+'] exists!');
            return;
        };
        var mod = {id:id};
        //event interface for mod
        XO.EVENT[id]={};
        //inherit utils features
        $.extend(mod,_utils);
        //construct the module
        fn.call(mod,$,XO.CONST);
        XO[id] = mod;
        mod = null;
    };
    //extensions
    $.extend(XO,{
        version:'1.0.0',
        author:'http://oxox.io',
        $body:$(document.body),
        $win:$(window),
        EVENT:{},
        LS:localStorage,
        toHtml:function(tpl,obj,ext){
            tpl = T.compile(tpl);
            return (tpl.render(obj,ext));
        },
        baseRouter:B.Router,
        history:B.history,
        baseView:B.View,
        warn:function(txt,obj){
            txt = 'XO.JS:'+txt;
            if (window.console !== undefined && XO.App.opts.debug === true) {
                console.warn(txt,obj);
            }
            return txt;
        },
        isExternalLink:function($el){
            return ($el.attr('target') === '_blank' || $el.attr('rel') === 'external' || $el.is('a[href^="http://maps.google.com"], a[href^="mailto:"], a[href^="tel:"], a[href^="javascript:"], a[href*="youtube.com/v"], a[href*="youtube.com/watch"]'));
        }
    });

    //EVENT UTILS
    var _utils = {
        exposeEvent : function(name){
            if($.isArray(name)){
                for(var i=0,j=name.length;i<j;i++){
                    XO.EVENT[this.id][name[i]]='on'+this.id+name[i];//+'.XO';;
                }
                return;
            };
            XO.EVENT[this.id][name]='on'+this.id+name;//+'.XO';//zepto不支持命名空间
        },
        disposeEvent : function(name){
            XO.$body.off(XO.EVENT[this.id][name]);
        },
        disposeAllEvents : function(){
            var evts = XO.EVENT[this.id];
            for(var c in evts){
                this.disposeEvent(c);
            };
        },
        getLSKey:function(privateKey){
            return (['XO',this.id,privateKey].join('.'));
        }
    };

})(Zepto,Hogan,Backbone);

XO.CONST = {
    CLASS:{
        ACTIVE:'current',
        UIACTIVE:'active',
        ANIMATION_IN:'in',
        ANIMATION_OUT:'out',
        ANIMATION_INMOTION:'inmotion',
        SUPPORT_3D:'supports3d',
        IOS5_AND_ABOVE:'ios5up',
        SUPPORT_TOUCHSCROLL:'touchscroll',
        SUPPORT_AUTOSCROLL:'autoscroll',
        ANIMATION_3D:'animating3d',
        ANIMATING:'animating',
        HIDE:'hide'
    },
    SELECTOR:{
        PAGE_WRAPPER:'body',
        DEFAULT_CSS_HOST:'body'
    },
    ATTR:{
        PAGE:'data-page',
        PAGE_SRC:'data-pagesrc',
        ANIMATION:'data-animate'
    },
    DEFAULT:{
        ANIMATION_NONE:'none',
        TEMPLATE_SUFFIX:'/',
        VIEW:'index',
        PAGE:'home',
        VIEW_ID_PREFIX:'xoview',
        DEFAULT_ACTION_PREFIX:'_'
    },
    ACTION:{
        PAGE:'page',
        SECTION:'section'
    }
};
XO('media',function($,C){

    /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
    window.matchMedia = window.matchMedia || (function( doc, undefined ) {

        "use strict";

        var bool,
            docElem = doc.documentElement,
            refNode = docElem.firstElementChild || docElem.firstChild,
            // fakeBody required for <FF4 when executed in <head>
            fakeBody = doc.createElement( "body" ),
            div = doc.createElement( "div" );

        div.id = "mq-test-1";
        div.style.cssText = "position:absolute;top:-100em";
        fakeBody.style.background = "none";
        fakeBody.appendChild(div);

        return function(q){

            div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

            docElem.insertBefore( fakeBody, refNode );
            bool = div.offsetWidth === 42;
            docElem.removeChild( fakeBody );

            return {
                matches: bool,
                media: q
            };

        };

    }( document ));

    // $.mobile.media uses matchMedia to return a boolean.
    this.test = function( q ) {
        return window.matchMedia( q ).matches;
    };

});
XO('support',function($,C){

    var helpers = {

        supportForTransform3d : function() {

            var mqProp = "transform-3d",
                vendors = [ "Webkit", "Moz", "O" ],
                fakeBody = $( "<body id='XO-3DTEST'>" ).prependTo( "html" ),
                // Because the `translate3d` test below throws false positives in Android:
                ret = XO.media.test( "(-" + vendors.join( "-" + mqProp + "),(-" ) + "-" + mqProp + "),(" + mqProp + ")" ),
                el, transforms, t;

            if ( ret ) {
                return !!ret;
            }

            el = document.createElement( "div" );
            transforms = {
                // We’re omitting Opera for the time being; MS uses unprefixed.
                "MozTransform": "-moz-transform",
                "transform": "transform"
            };

            fakeBody.append( el );

            for ( t in transforms ) {
                if ( el.style[ t ] !== undefined ) {
                    el.style[ t ] = "translate3d( 100px, 1px, 1px )";
                    ret = window.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
                }
            }
            fakeBody.parentNode.removeChild(fakeBody);
            return ( !!ret && ret !== "none" );
        },
        supportIOS5 : function() {
            var support = false,
                REGEX_IOS_VERSION = /OS (\d+)(_\d+)* like Mac OS X/i,
                agentString = window.navigator.userAgent;
            if (REGEX_IOS_VERSION.test(agentString)) {
                support = (REGEX_IOS_VERSION.exec(agentString)[1] >= 5);
            }
            return support;
        }
    };

    this.init = function(opts){
        this.animationEvents = (typeof window.WebKitAnimationEvent !== 'undefined');
        this.touch = (typeof window.TouchEvent !== 'undefined') && (window.navigator.userAgent.indexOf('Mobile') > -1) && XO.App.opts.useFastTouch;
        this.transform3d = helpers.supportForTransform3d();
        this.ios5 = helpers.supportIOS5();

        if (!this.touch) {
            XO.warn('This device does not support touch interaction, or it has been deactivated by the developer. Some features might be unavailable.');
        }
        if (!this.transform3d) {
            XO.warn('This device does not support 3d animation. 2d animations will be used instead.');
        }

        var featuresClass=[];
        this.transform3d&&featuresClass.push(C.CLASS.SUPPORT_3D);
        if(opts.useTouchScroll){
            if(this.ios5){
                featuresClass.push(C.CLASS.TOUCHSCROLL);
            }else{
                featuresClass.push(C.CLASS.AUTOSCROLL);
            }
        }

        XO.$body.addClass(featuresClass.join(' '));

    }

});
XO('Event',function($){
    this.on= function(fullName,handler){
        if(arguments.length<=2){
            XO.$body.bind(fullName,handler);
            return;
        }
        $(arguments[0]).bind(arguments[1],arguments[2]);
    };
    this.trigger = function(fullName,args){
        if(arguments.length<=2){
            XO.$body.trigger(fullName,args);
            return;
        }
        $(arguments[0]).trigger(arguments[1],arguments[2]);
    };

    this.init = function(){
        //SYSTEM EVENTS
        XO.EVENT['Sys'] ={
            viewChange: 'onorientationchange' in window ? 'orientationchange' : 'resize',
            fingerDown: XO.support.touch ? 'touchstart' : 'mousedown',
            fingerMove: XO.support.touch ? 'touchmove' : 'mousemove',
            fingerUp: XO.support.touch ? 'touchend' : 'mouseup'
        };
    };

});
//plugin base module
XO('plugin',function($,C){
    //插件的公共方法
    var base = function(el, dataset){
        if(el.length && el.length != 0){
            $el = el;
        }else{
            $el = $(el);
        }
        this.$el = $el;
        this.dataset = dataset;
        this['plugin'] = dataset['plugin'];
        this['pluginId'] = dataset['pluginId'];
        this.init($el, dataset);
    }

    base.destroy = function(){
        this.$el.off('touchend');
        this.$el.off('touchstart');
        this.$el.off('touchmove');
        this.$el.off('tab');
        console.log('super destroy!');
    }

    base.init = function(){
        
    }

    base.bootup = function(dataset){

    }

    base.initEvent = function(){

    }

    base.on = function(type, fn, scope){
        var self = this;
        XO.Event.on(this.$el, type + '-' + this.plugin, function(e, scope){
            fn.call(self, scope);
        })
    }
    base.bind = function(){

    }

    base.trigger = function(type, args){
        //this.$el.trigger(type + '-' + this.plugin, args);   
        XO.Event.trigger(this.$el, type + '-' + this.plugin, args);
    }


    var _plugins={};
    var _idx = 0;

    this.get = function(id){
        return _plugins[id];
    }

    this._show = function(){
        console.dir(_plugins);
    }

    this.applyToView = function(view){
        var $el = view.$el,
            plugin, dataset, p; 
        $el.find('[data-plugin]').each(function(){
            var dataset = this.dataset;
            p_name = dataset['plugin'];
            p = new XO.plugin[p_name](this, dataset);
            p['name'] = p_name;
            if(dataset['pluginId']){
                _plugins[dataset['pluginId']] = p;
            }else{
                _plugins['p_' + _idx] = p;
                _idx++;
            }
        });
    };

    /**
     * 销毁视图内的插件。该方法在视图隐藏后自动调用
     */
    this.destroyInView = function(view){
        //TODO
    };

    this.bootup = function(view, args){
        for(var i in args){
           plugin = this.get(i);
           if(plugin)
                plugin.bootup(args[i]);
        }
    }

    this.define = function(name, prototype){
        prototype = prototype || {};
        var constr = function(){
            base.apply(this, arguments);
            this.super = base;
            this.name = name;
        };
        constr.prototype = (function(){
            var tmp = function(){};
            tmp.prototype = base;
            var proto = new tmp();
            for(var i in prototype){
                proto[i] = prototype[i];
            }
            return proto;
        })();
        XO.plugin[name] = constr;
    };

});


/**
 * Controller factory
 */
XO('Controller',function($,C){
    /**
     * define and register a controller
     * @param {String} pageId page id(controller id)
     * @param {Object} opts controller action dictionary
     */
    this.define = function(pageId,opts){

        XO.Controller[pageId]=$.extend(XO.Controller[pageId]||{},{
            id:pageId,
            viewId:function(vid){
                return XO.View.getId(pageId,vid);
            },
            /**
             * Render a view by viewid
             * @param {String} vid iew id
             * @param {Object} opts1 config object
             *         opts1.onRender callback function
             *         opts1.data data provider for the view
             */
            renderView:function(vid,opts1){
                this.renderExternalView(this.id,vid,opts1);
            },
            /**
             * Render a view by pageid and viewid,and render the view with specified data
             * @param {String} pid page id
             * @param {String} vid view id
             * @param {Object} opts1 config object
             *         opts1.onRender callback function
             *         opts1.data data provider for the view
             */
            renderExternalView:function(pid,vid,opts1){
                opts1 = $.extend({
                    onRender:function(err,view){},
                    data:{},
                    dataPointer:null,//internal pointer for the data object
                    hardRefresh:false,
                    param:null
                },opts1||{});

                var actionName = XO.Controller.getFullActionName(pid,vid),
                    me = this,
                    cbk = opts1.onRender,
                    data = opts1.data,
                    dataIsFunction = $.isFunction(data);

                //TODO:finish the switchTo function
                XO.View.switchTo(pid,vid,opts1.param,function(err,view,onGetViewData){
                    if(err){
                        cbk(actionName+err);
                        return;
                    }
                    if(!dataIsFunction){
                        onGetViewData(null,data);
                        cbk(null,view);
                        return;
                    }
                    data.call(opts1.dataPointer,opts1.param,function(err1,jsonData){
                        onGetViewData(err1,jsonData);
                        cbk(err1,view);
                    });

                },opts1.hardRefresh);
            }
        },opts||{});
    };

    this.getFullActionName = function(pid,vid,suffix){
        return ( 'Controller.'+pid+'.'+vid+(suffix||':') );
    };
    /**
     * 为指定视图定义对应控制器（Controller）的默认行为（action）
     * 注：这个方法会在ox.view.js里面_init方法中使用，目的是自动为视图生成一个控制器和对应的action
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Function} fnAction action
     */
    this.defineDefaultAction = function(pid,vid,fnAction){
        var action = {};
        action[XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid] = fnAction || XO.App.opts.defaultControllerAction || (function(param){
            this.renderView(vid,{
                param:param,
                data:function(params,cbk){
                    var jsonData = {hi:1};
                    cbk(null,jsonData);
                }
            });
        });
        this.define(pid,action);
    };
    /**
     * 调用指定action
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Object} param parameters
     */
    this.invoke = function(pid,vid,param){
        //获取用户定义的action，如果没有则使用默认的action。参考defineDefaultAction
        var action = XO.Controller[pid][vid]||XO.Controller[pid][XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid];
        action.call(XO.Controller[pid],param);
    };

});
//Base View Module
XO('View',function($,C){
    this.exposeEvent([
        'Init',
        'InitFromRemote',
        'Inited',
        'InitedTemplate',
        'InitedTemplateError'
    ]);
    this.caches={};
    this.curViews={};

    this.defaultActions = {
        initialize:function(){
            this.isRendered = this.dir===null||typeof(this.dir)==='undefined';
            this.isRemote = (!this.isRendered && this.dir.indexOf(C.DEFAULT.TEMPLATE_SUFFIX)!==-1);
            this.$host = $(this.cssHost);
            XO.Event.trigger(XO.EVENT.View.Init,[this]);
            if(this.isRendered){
                this.initFromDom();
            }
        },
        initFromDom:function(){
            this.el = document.getElementById(this.id);
            this.$el = $(this.el);
            this.animation = this.animation||(this.el.getAttribute[C.ATTR.ANIMATION]||XO.App.opts.defaultAnimation);
            XO.Event.trigger(this,XO.EVENT.View.Inited,[this]);
            this.onRender&&this.onRender.call(this);
        },
        initFromRemote:function(cbk){
            XO.Event.trigger(XO.EVENT.View.InitFromRemote,[this]);
            //load from local storage
            var lsKey = XO.View.getLSKey(this.id),
                lsObj = XO.LS[lsKey],
                me = this;

            // local inline template
            if(!this.isRemote){
                this.tpl = document.getElementById(this.dir);
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[this]);
                cbk&&cbk(null,this);
                return;
            };
            // remote template
            this.src = this.dir+this.pid+'/'+this.vid+'.html';
            // check localstorage firstly
            if(lsObj&&(lsObj = JSON.parse(lsObj))&&lsObj.src===this.src&&lsObj.version===this.version&&!XO.App.opts.debug){
                this.tpl = lsObj.tpl;
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[this]);
                cbk&&cbk(null,this);
                return;
            };
            //load from remote url
            $.ajax({
                url:this.src,
                cache:false,
                success:function(data,status,xhr){
                    me.tpl = data;
                    //save to LS
                    XO.LS[lsKey] = JSON.stringify({
                        tpl:data,
                        src:me.src,
                        version:me.version
                    });
                    XO.Event.trigger(XO.EVENT.View.InitedTemplate,[me]);
                    cbk&&cbk(null,me);
                },
                error:function(xhr,errorType,error){
                    XO.Event.trigger(XO.EVENT.View.InitedTemplateError,[me]);
                    cbk&&cbk(errorType+error.toString());
                }
            });
        },
        //render a page with specified data
        render:function(data){
            
            var html = XO.toHtml(this.tpl,data);
            this.$host.prepend(html);
            this.isRendered = true;
            this.initFromDom();
        },
        /**
         * 显示视图
         * @param {Object} aniObj animation object
         * @param {Object} cfg config object
         *                 cfg.onStart 动画开始回调
         *                 cfg.onEnd 动画结束回调
         * @param {Boolean} noReplaceCurrentView 是否覆盖当前view，对于loader这些公共视图，不应该覆盖当前view
         */
        animateIn:function(aniObj,cfg,noReplaceCurrentView){

            //隐藏Loading
            XO.View.uiLoader.hide();

            if(XO.Animate.animateIn(this,aniObj,cfg)&&!noReplaceCurrentView){
                XO.View.setCurView(this,this.pid);
            }
        },
        /**
         * 隐藏视图
         * @param {Object} aniObj animation object
         * @param {Object} cfg config object
         *                 cfg.onStart 动画开始回调
         *                 cfg.onEnd 动画结束回调
         */
        animateOut:function(aniObj,cfg ){
            XO.Animate.animateOut(this,aniObj,cfg);
        }
    };
    /**
     * 定义视图
     * @example
     *     XO.View.define({pid:'pageId','vid':'viewId'});
     */
    this.define = function(opts,initAtOnce){
        opts = opts || {};
        //check pid&vid
        if( (!opts.pid) || (!opts.vid) ){
            XO.warn('Parameters require! pid and vid required!');
            return false;
        }

        this.curViews[opts.pid] = this.curViews[opts.pid] ||{};
        opts.cssHost = opts.cssHost||C.SELECTOR.DEFAULT_CSS_HOST;
        opts.id = this.getId(opts.pid,opts.vid);
        opts = $.extend(opts,this.defaultActions);
        opts.isInited = false;
        this.caches[opts.id] = opts;

        if(initAtOnce){
            return this._init(opts);
        }
    };

    this._init = function(viewOpts){
        if(XO.App&&XO.App.opts){
            viewOpts.dir = viewOpts.dir===null?null:XO.App.opts.viewDir;
        }
        var tempView = XO.baseView.extend(viewOpts);
        tempView.id = viewOpts.id;
        tempView = new tempView();
        if(tempView.init){
            tempView.init.call(tempView);
            delete tempView.init;
        };
        tempView.isInited = true;
        this.caches[tempView.id] = tempView;
        if(tempView.alias){
            (!this[tempView.alias]) && (this[tempView.alias]=tempView);
        }

        //generate default action
        XO.Controller.defineDefaultAction(tempView.pid,tempView.vid);

        return tempView;
    };

    /**
     * 获取用户自定义的视图
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Function} cbk callback
     * @param {Function} onPreloadFromRemote 从远程url获取模板时的回调
     */
    this.get = function(pid,vid,cbk,onPreloadFromRemote){

        var id = this.getId(pid,vid),
            view = this.caches[id];
        
        if(!view){
            cbk(XO.warn('View with id ['+id+'] not found!'));
            return;
        }

        if(view.isRendered){
            cbk(null,view);
            return;
        }
        //从远程获取视图模板
        if (!onPreloadFromRemote) {
            view.initFromRemote(cbk);
            return;
        };
        onPreloadFromRemote.call(view,function(){
            view.initFromRemote(cbk);
        });
    };
    /**
     * 生成视图的ID
     */
    this.getId = function(pid,vid){
        return [C.DEFAULT.VIEW_ID_PREFIX,pid,vid].join('-');
    };
    /**
     * 设置当前视图
     * @param {Object} view XO.View object
     * @param {String} pageId view's page id
     */
    this.setCurView = function(view,pageId){
        if(pageId){
            this.curViews[pageId].curView = view;
        };
        this.curViews['curView'] = view;
    };
    /**
     * 获取当前视图
     */
    this.getCurView = function(pageId){
        if(pageId){
            return this.curViews[pageId].curView;
        }
        return this.curViews.curView;
    };
    //switch Pages or Sections
    this.switch = function(from, to, aniName, goingBack,pageId) {

        goingBack = goingBack || false;

        if(!XO.Animate.switch(from,to,aniName,goingBack)){
            return false;
        }

        XO.View.setCurView(to,pageId);

        return true;
    };//switch
    /**
     * switch Pages or Sections
     * @param {Function} cbk cbb(err,view,onGetViewData)
     */
    this.switchTo = function(pid,vid,aniObj,cbk,forceRefresh){
        var curView = this.getCurView(),
            onViewGot = function(err,view){
                if(err){
                    XO.warn('XO.View.switchTo:'+err);
                    cbk(err);
                    return;
                }
                if(view.isRendered&&!forceRefresh){
                    view.animateIn(aniObj);
                    return;
                }
                cbk(null,view,function(err1,data1){
                    if(err1){
                        //获取数据出错
                        XO.warn('XO.View.switchTo:'+err1);
                        return;
                    }
                    //渲染视图
                    view.render(data1);
                    view.animateIn({animation:'none'});
                });
            },
            onPreloadFromRemote = function(loadFromRemote){
                //切进loading
                XO.View.uiLoader.animateIn(aniObj,{
                    onEnd:loadFromRemote
                },true);
            };

        //移出当前view
        if(curView){
            curView.animateOut(aniObj);
        }
        //加载目标视图
        this.get(pid,vid,onViewGot,onPreloadFromRemote);
    };

    this.init = function(){
        //初始化所有未初始化的视图
        for(var v in this.caches){
            if(this.caches[v].isInited) {
                continue;
            };
            this._init(this.caches[v]);
        };
    };

});
XO.View.define({
    pid:'common',
    vid:'mask',
    alias:'uiMask',
    dir:null,//dir为null说明为页面中已经存在的视图
    isMasking:false,
    show:function(){
        if(this.isMasking)
            return;
        
        this.isMasking = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
    },
    hide:function(){
        this.$el.addClass(XO.CONST.CLASS.HIDE);
        this.isMasking = false;
    }
});

XO.View.define({
    pid:'common',
    vid:'loader',
    alias:'uiLoader',
    dir:null,//dir为null说明为页面中已经存在的视图
    isLoading:false,
    show:function(){
        if(this.isLoading)
            return;
        this.isLoading = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
    },
    hide:function(){
        this.$el.addClass(XO.CONST.CLASS.HIDE).removeClass(XO.CONST.CLASS.ACTIVE);
        this.isLoading = false;
    }
});
XO('Router',function($,C){

    this.init = function(opts){
        var customRoutes = opts.routes||{
            'page/:page': 'showPage',
            'page/:page/:view':'showPage',
            'page/:page/:view/:data': 'showPage',
            'page/:page/section/:section':'showSection',
            'page/:page/section/:section/:param':'showSection',
            'page/:page/aside/:aside':'showAside',
            'page/:page/aside/:aside/:param':'showAside',
            'page/:page/popup/:popup':'showPopup',
            'page/:page/popup/:popup/:param':'showPopup',
            "*actions": "defaultRoute"
        };

        //routes
        var Router = XO.baseRouter.extend({
            routes: customRoutes,
            initialize:function(){
                this.on({
                    "route":this.onRoute,
                    "route:defaultRoute":this.onDefaultRoute
                });
                // Handling clicks on links, except those with link
                // remove strings to xo.constants.js
                $(document).on("click", "a:not([data-notrouter])", function (evt) {
                    var href = $(this).attr("href"),
                        protocol = this.protocol + "//";
                        XO.Router.instance.linkClicked = true;
                    if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript") !== 0) {
                        evt.preventDefault();
                        XO.Router.instance.isGoback = this.getAttribute('data-back');
                        href = XO.Router.instance.isGoback||href;
                        XO.history.navigate(href, true);
                        return;
                    }
                }).on('click','button',function(evt){
                    XO.Router.instance.linkClicked = true;
                    XO.Router.instance.isGoback = this.getAttribute('data-back');
                    if(!XO.Router.instance.isGoback) return;
                    XO.history.navigate(XO.Router.instance.isGoback, true);
                });
            },
            showPage: function(pageId,viewId,param){
                viewId = viewId||'index';
                param= JSON.parse(param||'{}');
                var aniName = (!this.linkClicked)?C.DEFAULT.ANIMATION_NONE:null,
                    viewObj = {
                        pid:pageId,
                        vid:viewId,
                        animation:aniName,
                        back:this.isGoback,
                        dir:XO.App.opts.viewDir,
                        type:C.ACTION.PAGE,
                        cssHost:C.SELECTOR.PAGE_WRAPPER
                    };
                viewObj.params = param;
                XO.Controller.invoke(pageId,viewId,viewObj);
                this.isGoback = false;
                this.linkClicked = false;
            },
            showSection:function(pageId,secId,param){
                console.log('showSection',{pid:pageId,secId:secId,param:param});
            },
            showAside:function(pageId,asId,param){
                console.log('showAside',{pid:pageId,asId:asId,param:param});
            },
            showPopup:function(pageId,popId,param){
                console.log('showPopup',{pid:pageId,popId:popId,param:param});
            },
            isGoback:false,
            onRoute:function(actions,param){
                console.log('onRoute',actions,param);
            },
            onDefaultRoute:function(actions){
                console.log("Intercepted call of default router: " + actions);
            }
            
        });

        this.instance = new Router();

    };
});
/**
 * Animation module
 */
XO('Animate',function($,C){
    this.exposeEvent([
        'Start',
        'End'
    ]);
    //ref:https://github.com/senchalabs/jQTouch/blob/master/src/jqtouch.js
    this.animations = { // highest to lowest priority
        'cubeleft':{name:'cubeleft', is3d: true},
        'cuberight':{name:'cuberight', is3d: true},
        'dissolve':{name:'dissolve'},
        'fade':{name:'fade'},
        'flipleft':{name:'flipleft',is3d: true},
        'flipright':{name:'flipright',is3d: true},
        'pop':{name:'pop', is3d: true},
        'swapleft':{name:'swapleft', is3d: true},
        'swapright':{name:'swapright', is3d: true},
        'slidedown':{name:'slidedown'},
        'slideright':{name:'slideright'},
        'slideup':{name:'slideup'},
        'slideleft':{name:'slideleft'},
        'xo_ani_slideleft':{name:'xo_ani_slideleft',is3d:true},
        'none':{name:'none'}
    };

    this.getReverseAnimation = function(animation) {
        var opposites={
            'up' : 'down',
            'down' : 'up',
            'left' : 'right',
            'right' : 'left',
            'in' : 'out',
            'out' : 'in'
        };
        return opposites[animation] || animation;
    }

    this.add = function(aniObj){
        this.animations[aniObj.name]=aniObj;
    };

    this.get = function(name){
        return this.animations[name]||this.animations[XO.App.opts.defaultAnimation];
    };

    this.unselect = function($obj){
        if($obj){
            $obj.removeClass(C.CLASS.UIACTIVE);
            $obj.find('.'+C.CLASS.UIACTIVE).removeClass(C.CLASS.UIACTIVE);
            return;
        }
        $('.'+C.CLASS.UIACTIVE).removeClass(C.CLASS.UIACTIVE);
    };

    this.makeActive = function($obj){
        $obj.addClass(C.CLASS.UIACTIVE);
    };

    /**
     * animate in a view
     */
    this.animateIn = function(view,aniObj,cfg){
        var aniName = aniObj.animation,
            animation = this.get(aniName),
            goingBack = aniObj.isBack||false,
            $el = view.$el;

        cfg = cfg||{};

        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        var finalAnimationName,
            is3d,
            eventData = { direction: C.CLASS.ANIMATION_IN, back: goingBack ,animation:animation,isHiding:false};

        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            this.unselect();
            XO.warn('XO.Animate.animateIn:Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($el.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('XO.Animate.animateIn:You are already on the page you are trying to navigate to.');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        XO.Event.trigger(view,XO.EVENT.Animate.Start, eventData);
        //user callback
        view.onAnimating&&view.onAnimating.call(view,eventData);
        //framework callback
        cfg.onStart&&cfg.onStart.call(view);

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.animateIn:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name;
            is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.animateIn: finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.on('webkitAnimationEnd', animateEndHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            /*
            var lastScroll = window.pageYOffset;

            // Position the incoming page so toolbar is at top of
            // viewport regardless of scroll position on from page
            if (XO.App.opts.trackScrollPositions === true) {
                $to.css('top', window.pageYOffset - ($to.data('lastScroll') || 0));
            }
            */

            $el.removeClass(C.CLASS.HIDE).addClass([finalAnimationName,C.CLASS.ANIMATION_IN,C.CLASS.ACTIVE].join(' '));
            /*
            if (XO.App.opts.trackScrollPositions === true) {
                $from.data('lastScroll', lastScroll);
                $('.scroll', $from).each(function() {
                    $(this).data('lastScroll', this.scrollTop);
                });
            }
            */
        } else {
            $el.removeClass(C.CLASS.HIDE).addClass([C.CLASS.ACTIVE,C.CLASS.ANIMATION_IN].join(' '));
            animateEndHandler();
        }

        /*
        if (goingBack) {
            history.shift();
        } else {
            addPageToHistory(XO.View.$curView, animation);
        }
        setHash(XO.View.$curView.attr('id'));
        */

        // Private navigationEnd callback
        function animateEndHandler(evt) {
            var bufferTime = XO.App.opts.tapBuffer;

            if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
                $el.unbind('webkitAnimationEnd', animateEndHandler);
                if (finalAnimationName) {
                    $el.removeClass(finalAnimationName);
                }
                XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
                /*
                if (XO.App.opts.trackScrollPositions === true) {
                    $to.css('top', -$to.data('lastScroll'));

                    // Have to make sure the scroll/style resets
                    // are outside the flow of this function.
                    setTimeout(function() {
                        $to.css('top', 0);
                        window.scroll(0, $to.data('lastScroll'));
                        $('.scroll', $to).each(function() {
                            this.scrollTop = - $(this).data('lastScroll');
                        });
                    }, 0);
                }
                */
            } else {
                if (finalAnimationName) {
                    $el.removeClass(finalAnimationName);
                }
                bufferTime += 260;
            }

            // 'in' class is intentionally delayed,
            // as it is our ghost click hack
            setTimeout(function() {
                $el.removeClass(C.CLASS.ANIMATION_IN);
                window.scroll(0,0);
            }, bufferTime);
            // 插件初始化
            XO.plugin.applyToView(view);

            // Trigger custom events
            XO.Event.trigger(view,XO.EVENT.Animate.End, eventData);
            // user callback
            view.onAnimated&&view.onAnimated.call(view,eventData);
            //framework callback
            cfg.onEnd&&cfg.onEnd.call(view);
        }
        return true;
    };
    /**
     * animate out a view
     */
    this.animateOut = function(view,aniObj,cfg){
        var aniName = aniObj.animation,
            animation = this.get(aniName),
            $el = view.$el,
            goingBack = aniObj.isBack||false;

        cfg = cfg||{};

        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        var finalAnimationName,
            is3d,
            eventData = { direction: C.CLASS.ANIMATION_OUT, back: goingBack ,animation:animation,isHiding:true};
        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            XO.warn('XO.Animate.animateOut:Target element is missing.');
            return false;
        }
        // Collapse the keyboard
        //$(':focus').trigger('blur');

        XO.Event.trigger(view,XO.EVENT.Animate.Start, eventData);
        //user's custom view callback
        view.onAnimating&&view.onAnimating.call(view,eventData);
        //framework's internal view callback
        cfg.onStart&&cfg.onStart.call(view);

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.animateOut:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name;
            is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.animateOut: finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.bind('webkitAnimationEnd', animateEndHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            /*
            var lastScroll = window.pageYOffset;

            // Position the incoming page so toolbar is at top of
            // viewport regardless of scroll position on from page
            if (XO.App.opts.trackScrollPositions === true) {
                $to.css('top', window.pageYOffset - ($to.data('lastScroll') || 0));
            }
            */

            $el.removeClass(C.CLASS.ACTIVE).addClass([finalAnimationName,C.CLASS.ANIMATION_OUT, C.CLASS.ANIMATION_INMOTION].join(' '));

            /*
            if (XO.App.opts.trackScrollPositions === true) {
                $from.data('lastScroll', lastScroll);
                $('.scroll', $from).each(function() {
                    $(this).data('lastScroll', this.scrollTop);
                });
            }
            */
        } else {
            $el.removeClass(C.CLASS.ACTIVE);
            animateEndHandler();
        }

        /*
        if (goingBack) {
            history.shift();
        } else {
            addPageToHistory(XO.View.$curView, animation);
        }
        setHash(XO.View.$curView.attr('id'));
        */

        // Private navigationEnd callback
        function animateEndHandler(event) {
            var clOut = [finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' ');

            if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
                $el.unbind('webkitAnimationEnd', animateEndHandler);
                $el.removeClass(clOut);
                XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
                /*
                if (XO.App.opts.trackScrollPositions === true) {
                    $to.css('top', -$to.data('lastScroll'));

                    // Have to make sure the scroll/style resets
                    // are outside the flow of this function.
                    setTimeout(function() {
                        $to.css('top', 0);
                        window.scroll(0, $to.data('lastScroll'));
                        $('.scroll', $to).each(function() {
                            this.scrollTop = - $(this).data('lastScroll');
                        });
                    }, 0);
                }
                */
            } else {
                $el.removeClass(clOut);
            }

            XO.Animate.unselect($el);


            // 视图隐藏，插件销毁
            XO.plugin.destroyInView(view);

            // Trigger custom events
            XO.Event.trigger(view,XO.EVENT.Animate.End, eventData);
            // user's custom callback
            view.onAnimated&&view.onAnimated.call(view,eventData);
            // framework's callback
            cfg.onEnd&&cfg.onEnd.call(view);
        }
        return true;
    };
});
XO('App',function($,C){

    //隐藏地址栏
    this.hideAddressBar = function(){
        window.scrollTo(0,0);
    };

    this.init = function(opts){

        //fastclick https://github.com/ftlabs/fastclick
        FastClick.attach(document.body);

        this.opts = $.extend({
            useFastTouch:true,
            useAnimations:true,
            defaultAnimation:'slideleft',
            trackScrollPositions:true,
            useTouchScroll:true,
            tapBuffer:100, // High click delay = ~350, quickest animation (slide) = 250
            debug:false,
            defaultPage:C.DEFAULT.PAGE,
            defaultView:C.DEFAULT.VIEW,
            defaultControllerAction:null,
            viewDir:XO.$body[0].getAttribute('data-viewdir')||'assets/html/pages/'
        },opts||{});
        //delete self's init method
        delete this.init;
        //init all modules
        for(var c in XO){
            XO[c].init&&XO[c].init.call(XO[c],this.opts);
            delete XO[c].init;
        };

        //旋屏
        window.addEventListener(XO.EVENT.Sys.viewChange, this.hideAddressBar);

        this.hideAddressBar();
        

        //hashchange
        XO.history.start();
        //XO.history.start({pushState:true});
        
        //default page and view
        var page = this.opts.defaultPage;
        if(!window.location.hash.substring(1)){
            XO.Router.instance.navigate('page/'+page, {trigger: true, replace: true});
        }

        XO.support.touch && window.addEventListener('touchstart', function(){
            XO.App.hideAddressBar();
        }, true);

    };
});