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
			var $el = this.$el;
			this._w = $el.width();

			this._isInActive = false;
			this._idx = 0;
			this.$_inner = $($el.find('.mod_nav_inner'));
			this.$_item = $el.find('li');
			this.$_inner.width((this.$_item.length + 1) * 72);
			this._ow = this.$_inner.width();       	
        	this._maxIdx = this.$_item.length - 1;
        	this._minIdx = 0;
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
	    	var self = this;
	        this.$_item.removeClass('current');
	        $(this.$_item[idx]).addClass('current');

	        var left = idx * 72 + 72;

	        if(left + this.cdis + 45 >= this._w){
	        	this.$_inner.animate({'translate3d': this.cdis - 60 + 'px, 0, 0'}, 300, 'ease-out', function(){
            		self.cdis = self.cdis - 60;
            	});
	        }

	        if(left - 52  <= -this.cdis){
	        	this.$_inner.animate({'translate3d': this.cdis + 60 + 'px, 0, 0'}, 300, 'ease-out', function(){
            		self.cdis = self.cdis + 60;
            	});
	        }
	    },
	    scroll_to: function(idx){
	    	if(idx <= this._maxIdx && idx >= this._minIdx){
	            this._isInActive = true;
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

	        var t = this.$_item[idx];
	        var dataset = t.dataset;
	        dataset['idx'] = idx;
	        this.trigger('active', dataset);
		},
		bootup: function(data){
			var swiper = XO.plugin.get(data['swiperId']);
			this.on('active', function(dataset){
				var data = dataset;
				swiper.active_page(dataset['idx'], function(dataset){
	                activePage = XO.plugin.get(dataset['id']);
	                //activePage.trigger('beforePageLoad');
	                XO.View.uiLoader.show();
	                $.get('html/pages/home/' + data['tpl'] + '.html', function(tpl){
	                    var html = XO.toHtml(tpl, {});
	                    setTimeout(function(){
	                        activePage.refresh(html);
	                        //activePage.trigger('afterPageLoad');
	                        XO.View.uiLoader.hide();
	                    },1000);
	                });
	            });
			});

		},
		initEvent: function(){
			var self = this;
	        this.$el.on('tap click', function(e){
	        	if (self._isInActive) return;
	        	if (e.touches){
	                e = e.touches[0];
	            }
	            var $t = $(e.target).parents('li');
	            var idx = $t.index();
	            self.scroll_to(idx);
	            var dataset = $t[0].dataset;
	            dataset['idx'] = idx;
	            self.trigger('active', dataset);
	        });

	        this.on('swapRight', function(e){
	        	var idx = self.get_idx();
	        	self.scroll_to(idx + 1);
	        });

	        this.on('swapLeft', function(e){
	        	var idx = self.get_idx();
	        	self.scroll_to(idx - 1);
	        });
			
			var isDrag = false,
				startTime, endTime, sX, sY, eX, eY, touch, dis, endis, isStopEvent = false, endidx; this.cdis = 0;
			var self = this;
			this.$_inner.on('touchstart mousedown', function(e){
	            isDrag = true;
	            if (e.touches){
	                touch = e.touches[0];
	                sX = touch.pageX;
	                sY = touch.pageY;
	            }else{
	                sX = e.pageX;
	                sY = e.pageY;
	            }
	            startTime = Date.parse(new Date());
	            e.preventdefault();e.stoppropagation();
	        });

			this.$_inner.on('touchmove mousemove', function(e){
	            if(!isDrag) return;
	            if (e.touches) {
	                touch = e.touches[0];
	                eX = touch.pageX;
	                eY = touch.pageY;
	            }else{
	                eX = e.pageX;
	                eY = e.pageY;
	            }
	            dis = eX - sX + self.cdis;
	            $(this).css({'-webkit-transform': 'translate(' + dis + 'px, 0px) translateZ(0px)'});
	            e.preventdefault();e.stoppropagation();
	        });

	        this.$_inner.on('touchend mouseup', function(e){
	            if(!isDrag) return;
	            if (e.changedTouches) {
	                touch = e.changedTouches[0];
	                eX = touch.pageX;
	                eY = touch.pageY;
	            }else{
	                eX = e.pageX;
	                eY = e.pageY;
	            }
	            isDrag = false;
	            self.cdis = self.cdis + eX - sX;
	            if(self._ow + self.cdis < self._w ){  
	            	self.$_inner.animate({'translate3d': -1 * (self._ow - self._w) + 'px, 0, 0'}, 300, 'ease-out', function(){
	            		self.cdis = -1 * (self._ow - self._w);
	            	});
	            }
	            if(self.cdis > 0){
	            	self.$_inner.animate({'translate3d': '0, 0, 0'}, 300, 'ease-out', function(){
	            		self.cdis = 0;
	            	});
	            }
	            e.preventdefault();e.stoppropagation();
	        });


		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);

