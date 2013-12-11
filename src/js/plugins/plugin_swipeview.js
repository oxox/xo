(function($, XO){
	XO.plugin.define('swipeview',{
		init: function(){
			this.initUi();
			//this.initEvent();
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
		},
		initEvent: function(){
			var isDrag = false,
				startTime, endTime, sX, sY, eX, eY, touch, dis;
			var self = this;
			this.$el.on('touchstart mousedown', function(e){
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
	        });

			this.$el.on('touchmove mousemove', function(e){
	            if(!isDrag) return;
	            if (e.touches) {
	                touch = e.touches[0];
	                eX = touch.pageX;
	                eY = touch.pageY;
	            }else{
	                eX = e.pageX;
	                eY = e.pageY;
	            }
	            dis = this._w * this._idx;
	            self.$el.css({'-webkit-transform': 'translate(' + dis + 'px, 0px) translateZ(0px)'});
	            endTime = Date.parse(new Date());
	        });

		},
		destroy: function(){
			this.super.destroy.call(this);
		}
	});

})($, XO);

