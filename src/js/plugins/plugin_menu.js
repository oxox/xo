(function($, XO){
	var getX = function(idx){
		return -idx * 80;
	}
	XO.plugin.define('menu',{
		init: function(){
			this.initUi();
			this.initEvent();
		},
		initUi: function(){
			var $el = this.$el,
				_w = $el.width();

			this._isInActive = false;
			this._idx = 2;
			this.$_inner = $($el.find('.mod_nav_inner'));
        	this.$_inner.css({'padding':'0 ' + (_w / 2 - 40) + 'px'});
        	this.$_item = $el.find('a');
        	this._maxIdx = this.$_item.length - 1;
        	this._minIdx = 0;
	        this._navScroll = new IScroll($el[0], {
	            scrollX: true,
	            scrollY: false,
	            momentum: false,
	            snap: false,
	            bounce :false
	        });
	        this._navScroll.scrollTo(getX(this._idx), 0 , 0);
		},
		get_idx: function(x){
	        if ('undefined' != typeof x){
	            var idx = Math.round(-x / 80);
	            if(idx > this._maxIdx) return this._maxIdx;
	            if(idx < this._minIdx) return this._minIdx;
	            return idx;
	        }
	        return this._idx;
	    },
	    _getEl: function(idx){
	        if(undefined == idx){
	            return $(this.$_item[this._idx]);
	        }else{
	           return $(this.$_item[idx]);
	        }
	           
	    },
	    active: function(idx){
	        this.$_item.removeClass('on');
	        $(this.$_item[idx]).addClass('on');
	    },
	    scroll_to: function(idx){
	    	if(idx <= this._maxIdx && idx >= this._minIdx){
	            this._isInActive = true;
	            this._navScroll.scrollTo(getX(idx), 0, 300);
	            this.active(idx);
	            this._idx = idx;
	            var self = this;
	            setTimeout(function(){
	                self._isInActive = false;
	            },300);
	        }
	    },
		activeTab: function(x){
			var idx = this.get_idx(x);
	        if(idx == this._idx) {	            
	            return;
	        }
	        this.scroll_to(idx);
		},
		initEvent: function(){
			var self = this;
			$(this._navScroll.wrapper).on('touchend mouseup', function(){
	            if(!self._isInActive){
	                var x = self._navScroll.absStartX + self._navScroll.distX;
	                self.activeTab(x);
	            }
	        });
	        this.$el.on('tap click', function(e){
	        	if (self._isInActive) return;
	        	if (e.touches){
	                e = e.touches[0];
	            }
	            var t = e.target;
	            var idx = $(t).index();
	            self.scroll_to(idx);
	        });
		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);

