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
			this.on('beforeloaded', function(){
				self.$el.find('.mod_more').addClass('loading');
			});

			this.on('afterloaded', function(){
				self.$el.find('.mod_more').removeClass('loading');
			});
		},
		bootup: function(args){
			var tpl_url = args['tpl_url'];
			var data = args['data_url'];
			var self = this;
			this.on('loaded', function(){
	            self.trigger('beforeloaded');
	            $.get(tpl_url, function(tpl){
	                var html = XO.toHtml(tpl, {});
	                setTimeout(function(){
	                    self.trigger('afterloaded');
	                    self.append(html);
	                },1000)
	                
	            });
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