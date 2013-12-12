(function($, XO){
	XO.plugin.define('swipeview',{
		init: function(){
			this.initUi();
			this.initEvent();
		},
		initUi: function(){
			var $el = this.$el;
			this.$view_1 = $el.find('.view_1');
			this.$view_2 = $el.find('.view_2');
			this.$view_3 = $el.find('.view_3');
			this.$view_1.css('left','-100%');
			this.$view_2.css('left','0%');
			this.$view_3.css('left','100%');
			this._w = $el.width();
			this._idx = 0;
			this._max = this.dataset['max'];
			this._min = this.dataset['min'];
		},
		initEvent: function(){
			var isDrag = false,
				startTime, endTime, sX, sY, eX, eY, touch, dis, endis, isStopEvent = false, endidx;
			var self = this;
			$(document).on('touchstart mousedown', function(e){
	            isDrag = true;
	            if (e.touches){
	                touch = e.touches[0]
	                sX = touch.pageX;
	                sY = touch.pageY;
	            }else{
	                sX = e.pageX;
	                sY = e.pageY;
	            }
	            startTime = Date.parse(new Date());
	            e.preventdefault();e.stoppropagation();
	        });

			$(document).on('touchmove mousemove', function(e){
	            if(!isDrag) return;
	            if(isStopEvent) return;
	            if (e.touches) {
	                touch = e.touches[0];
	                eX = touch.pageX;
	                eY = touch.pageY;
	            }else{
	                eX = e.pageX;
	                eY = e.pageY;
	            }
	            dis = self._w * self._idx + (eX - sX);
	            $('.navbar').html(dis);
	            /*if( Math.abs(eY - sY) - Math.abs(eX - sX) > 0){
	            	//isStopEvent = true;
	            }else if(Math.abs(eX - sX) - Math.abs(eY - sY) > 0){
	            	self.$el.css({'-webkit-transform': 'translate(' + dis + 'px, 0px) translateZ(0px)'});
	            }else{
	            }*/
	            //alert(Math.abs(eX - sX) - Math.abs(eY - sY));
	            //e.stoppropagation(); e.preventdefault();
	        });

	        $(document).on('touchend mouseup', function(e){
	            if(!isDrag) return;
	            isDrag = false;
	            if(isStopEvent){
	            	isStopEvent = false;
	            	return;
	            }
	            
	            if (e.changedTouches){
	                touch = e.changedTouches[0]
	                eX = touch.pageX;
	                eY = touch.pageY;
	            }else{
	                eX = e.pageX;
	                eY = e.pageY;
	            }
	            endTime = Date.parse(new Date());            
	            if(endTime - startTime < 500){
	            	if(eX - sX > 100){
	            		endidx = self._idx + 1;
	            	}else if(eX - sX < -100){
	            		endidx = self._idx - 1;
	            	}
	            }else{
	            	endis = Math.round((eX - sX) / self._w);            
		            if(endis == 1){
		            	endidx = self._idx + 1;
		            }
		            if(endis == -1){
		            	endidx = self._idx - 1;
		            }
	            }
	            self.swap_page(endidx);
	            //e.preventdefault();e.stoppropagation();
	        });
		},
		bootup: function(data){
			var menu = XO.plugin.get(data['menuId']);
			var url = data['tpl_url'];
			this.on('active', function(dataset){
	            activePage = XO.plugin.get(dataset['id']);
	            var idx = menu.get_idx();
	            if(dataset['to'] == 1){
	                menu.trigger('swapRight');
	            }
	            if(dataset['to'] == -1){
	                menu.trigger('swapLeft');
	            }
	            XO.View.uiLoader.show();
	            $.get(url, function(tpl){
	                var html = XO.toHtml(tpl, {});
	                setTimeout(function(){
	                    activePage.refresh(html);
	                    XO.View.uiLoader.hide();
	                },1000);
	            });                 
	        });
		},
		swap_page: function(idx){
			if(idx >= this._max) idx = +this._max;
			if(idx <= this._min) idx = +this._min;
			var cidx = undefined == idx ? this._idx : idx;
			var cX = cidx * this._w;
			var self = this;
			var sections = self.$el.find('.xo_section');
			var activePage, arrow;
			this.$el.animate({'translate3d': cX + 'px, 0, 0'}, 300, 'ease-out', function(){
				if(self._idx > idx ){
					self.$el.append(sections[0]);
					$(sections[0]).find('.pager').html('');
					$(sections[1]).find('.pager').html('');				
					$(sections[1]).css({'left': (-idx - 1) * 100 + '%'});
					$(sections[2]).css({'left': -idx * 100 + '%'});
					$(sections[0]).css({'left': (-idx + 1) * 100 + '%'});
					activePage = $(sections[2]);
					arrow = 1;
				}else if(self._idx < idx){
					self.$el.prepend(sections[2]);
					$(sections[2]).find('.pager').html('');
					$(sections[1]).find('.pager').html('');
					$(sections[2]).css({'left': (-idx - 1) * 100 + '%'});
					$(sections[0]).css({'left': -idx * 100 + '%'});
					$(sections[1]).css({'left': (-idx + 1) * 100 + '%'});
					activePage = $(sections[0]);
					arrow = -1;
				}else{
					return;
				}
				self._idx = idx;
				self.trigger('active', {'id': activePage.data('plugin-id'), 'to': arrow});
			});

		},
		active_page: function(idx, fn){
			var self = this;
			var _idx = 2 - idx;
			var cX = _idx * this._w;
			var sections = self.$el.find('.xo_section');
			this.$el.animate({'translate3d': cX + 'px, 0, 0'}, 0, 'ease-out', function(){
				$(sections[0]).css({'left': (-_idx - 1) * 100 + '%'});
				$(sections[1]).css({'left': (-_idx) * 100 + '%'});
				$(sections[2]).css({'left': (-_idx + 1) * 100 + '%'});			
			});
			self._idx = _idx;
			if(typeof fn == 'function') {
				$(sections[1]).find('.pager').html('');
				fn({'id': $(sections[1]).data('plugin-id')});
			}
		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);

