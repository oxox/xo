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
			new $.NavSlide($(this),options);
		});
	};

	$.NavSlide = function(container, options) {
		this.container = $(container);
		this.nav = this.container.children().eq(0);
		console.log(this.nav.offset().left)
		this.posX = 0;
		this.items = this.nav.children();
		this.options = $.extend(true, {}, $.NavSlide.defaults, options);
		this._init();
	}

	$.NavSlide.prototype = {
		_init: function(){
			var width = 0, opts = this.options;
			$.each(this.items, function(){
				width += $(this).outerWidth();
			});
			this.nav.width(width);
			if (opts.useAnimation) {
				this.nav.css({
					'-webkit-transition-duration': opts.duration + 'ms'
				});
			}
			this.viewPos = {};
			this.viewPos.x = this.container.offset().left;
			this.viewPos.y = this.viewPos.x + this.container.outerWidth();
			this.index = 0;
			this.setCurrent(this.options.index);
			this._bindEvent();
		},


		_bindEvent: function(){
			var isTouch = 'ontouchstart' in window;
			console.log(isTouch);
			var touchstart = isTouch ? 'touchstart' : 'click';
			var self = this;
			this.items.bind(touchstart, function(e){
				if ($(this).hasClass(self.options.currentCls)) {
					return ;
				}
				var index = $(this).index(this.items);
				self.setCurrent(index);
			});
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
		duration: 300 //ms
	}


})(Zepto);






