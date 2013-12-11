(function($, XO){
	
	XO.plugin.define('loadmore',{
		init: function(){
			var self = this;
			setTimeout(function(){
				self.initUi();
			}, 25)
				

		},
		initUi: function(){
			var $el = this.$el,
				_w = $el.width();
				$el.height($(window).height() - 70);
			this._isInActive = false;
	        this._pageScroll = new IScroll($el[0], {
	            scrollX: false,
	            scrollY: true,
	            momentum: true,
	            snap: false,
	            bounce :true
	        });
	        this.initEvent();
		},
		initEvent: function(){
			var self = this;
			$(this._pageScroll.wrapper).on('touchend mouseup', function(){
	            if(!self._isInActive){
	            	if( self._pageScroll.maxScrollY - self._pageScroll.y > 50){
	            		self.trigger('loaded');
	            	}
	            }
	        });
			this.$el.on('beforeloaded', function(){
				self.$el.find('.mod_more').addClass('loading');
			});
			this.$el.on('afterloaded', function(){
				self.$el.find('.mod_more').removeClass('loading');
			});
		},
		bind: function(type, fn){
			if (!fn) fn = function(){};
			this.$el.on(type, fn);
		},
		trigger: function(type){
			this.$el.trigger('beforeloaded');
			setTimeout(function(){
				this.$el.trigger(type);
				this.$el.trigger('afterloaded');
			},1000);			
		},
		append: function(html){
			this.$el.find('.pager').append(html);
			this._pageScroll.refresh();
		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);