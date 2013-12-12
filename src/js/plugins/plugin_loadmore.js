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

			$(this._pageScroll.wrapper).on('touchend mouseup', function(e){
	            if(!self._isInActive){
	            	if( self._pageScroll.maxScrollY - self._pageScroll.y > 50){
	            		self.trigger('loaded');
	            	}
	            }
	        });

			this.bind('beforeloaded', function(){
				self.$el.find('.mod_more').addClass('loading');
			});

			this.bind('afterloaded', function(){
				self.$el.find('.mod_more').removeClass('loading');
			});

			this.bind('beforePageLoad', function(){
				self.$el.find('.mod_more').addClass('pageloading');
			});

			this.bind('afterPageLoad', function(){
				self.$el.find('.mod_more').removeClass('pageloading');
			});
		},
		append: function(html){
			this.$el.find('.pager').append(html);
			this._pageScroll.refresh();
		},
		refresh: function(html){
			if(html){
				this.$el.find('.pager').html(html);
			}			
			this._pageScroll.refresh();
		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);