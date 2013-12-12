
(function($) {
	$.fn.outerWidth = function(){
        var val = this.width();
        val+=parseFloat(this.css('margin-left').replace('px',''))||0;
        val+=parseFloat(this.css('margin-right').replace('px',''))||0;
        val+=parseFloat(this.css('padding-left').replace('px',''))||0;
        val+=parseFloat(this.css('padding-right').replace('px',''))||0;
        return val;
    };

	$.fn.navSlide = function(options) {
		if(this.length == 0) {
			return this;
		}
		this.each(function() {
			window[this.id+'_obj']= new $.NavSlide($(this),options);
		});
	};

	$.NavSlide = function(container, options) {
		this.container = $(container);
		this.nav = this.container.children().eq(0);
		this.posX = 0;
		this.items = this.nav.children();
		this.options = $.extend(true, {}, $.NavSlide.defaults, options);
		this._init();
	}

	$.NavSlide.prototype = {
		_init: function(){
			var width = 0, opts = this.options,
				idx = this._getItemIndexByHash();
			$.each(this.items, function(){
				width += $(this).outerWidth();
			});
			this.nav.width(width);
			if (opts.useAnimation) {
				this.nav.css({
					'-webkit-transition-duration': opts.duration + 'ms'
				});
			}
			this.isTouch = 'ontouchstart' in window;;
			this.viewPos = {};
			this.viewPos.x = this.container.offset().left;
			this.viewPos.y = this.viewPos.x + this.container.outerWidth();
			this.index = 0;

			this.setCurrent( (idx===null?this.options.index:idx) );
			this._bindEvent();
		},

		_getItemIndexByHash:function(){
			var hash = window.location.hash,
				idx = null;
			this.items.each(function(i,o){
				if(hash.indexOf(o.firstChild.getAttribute('href').replace('#',''))!==-1){
					idx = i;
					return false;
				}
			});
			return idx;
		},

		_bindEvent: function(){
			var isTouch = this.isTouch;
				touchstart = isTouch ? 'touchstart' : 'mousedown',
				touchmove = isTouch ? 'touchmove' : 'mousemove',
				touchend = isTouch ? 'touchend' : 'mouseup',
				self = this;

			this.items.on('tap', function(e){
				if ($(this).hasClass(self.options.currentCls)) {
					return ;
				}
				var index = $(this).index(this.items);
				self.setCurrent(index);
			});
			if (this.options.swipe) {
				this.nav.bind(touchstart, function(e){
					self._touchstart(e);
				});
				this.nav.bind(touchmove, function(e){
					self._touchmove(e);
				});
				this.nav.bind(touchend, function(e){
					self._touchend(e);
				});
			}
		},

		_touchstart: function(e){
			var point = this.isTouch ? e.touches[0] : e;
			this.started = true;
			this.startX = point.pageX;
			this.startY = point.pageY;
		},

		_touchmove: function(e){
			if ( e.touches && e.touches.length > 1 || e.scale && e.scale !== 1) {
				return ;
			}
			if (!this.started) {
				return ;
			}
			var point = this.isTouch ? e.touches[0] : e;
			if(typeof this.isScrolling == 'undefined'){ 
				this.isScrolling = Math.abs(point.pageX - this.startX) < Math.abs(point.pageY - this.startY);
			}
			if (this.isScrolling) {
				this.started = false;
				return ;
			}
			e.preventDefault();
		},

		_touchend: function(e){
			if (!this.started) { 
				return ; 
			}
			var point = this.isTouch ? e.changedTouches[0] : e;
			var deltaX = point.pageX - this.startX;
			if (deltaX > 0) {
				if (this.index == this.items.length -1 ) {
					return ;
				}
				this.setCurrent(this.index - 1);
			} else if (deltaX < 0) {
				if (this.index == 0 ) {
					return ;
				}
				this.setCurrent(this.index + 1);
			}
		},

		goPrev:function(){
			var idx = this.index-1;
			if(idx<0){
				return this;
			}
			this.setCurrent(idx);
			return this;
		},
		goNext:function(){
			var idx = this.index+1;
			if(idx>=this.items.length){
				return this;
			}
			this.setCurrent(idx);
			return this;
		},
		getCurrentItem:function(){
			return this.items.eq(this.index);
		},
		setCurrent: function(index){
			if (index === this.index) {
				return ;
			}
			if (index < 0 || index > this.items.length - 1) {
				index = 0;
			}
			var currentCls = this.options.currentCls;
			var isNext = this.index < index;
			this.items.eq(index).addClass(currentCls).siblings().removeClass(currentCls);
			this.index = index;
			this._adjustPos(isNext);
		},

		_adjustPos: function(isNext){
			var item = this.items.eq(this.index);
			//var left = (parseFloat(this.css('margin-left').replace('px','')) || 0) + (parseFloat(this.css('left').replace('px','')) || 0);
			if (this.index == 0) {
				this.posX = 0;
				this.nav.css({
					'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
				});
			} else if(this.index == this.items.length - 1){
				var x = item.offset().left + item.outerWidth()  - this.viewPos.y;
				if (x > 0) {
					this.posX -= x;
					this.nav.css({
						'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
					});
				}	
			} else {
				if (isNext) {
					item = item.next();
					var x = item.offset().left + item.outerWidth()  - this.viewPos.y;
					if (x > 0) {
						this.posX -= x;
						this.nav.css({
							'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
						});
					}
				} else {
					item = item.prev();
					var x = item.offset().left  - this.viewPos.x;
					if (x < 0) {
						this.posX -= x;
						this.nav.css({
							'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
						});
					}
				}
			}
		}
	}

	$.NavSlide.defaults = {
		currentCls: 'current',
		index: 0,
		useAnimation: true,
		duration: 300, //ms
		swipe: true
	}


})(Zepto);