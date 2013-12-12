(function($) {

    $.fn.swipePager = function(options) {
        if(this.length == 0) {
            return this;
        }
        this.each(function() {
            new $.SwipePager($(this),options);
        });
    };

    $.SwipePager = function(container, options) {
        this.container = $(container);
        this.options = $.extend(true, {}, $.SwipePager.defaults, options);
        this._init();
    }

    $.SwipePager.prototype = {
        _init: function(){
            this.isTouch = 'ontouchstart' in window;;
            this._bindEvent();
        },


        _bindEvent: function(){
            var isTouch = this.isTouch;
                touchstart = isTouch ? 'touchstart' : 'mousedown',
                touchmove = isTouch ? 'touchmove' : 'mousemove',
                touchend = isTouch ? 'touchend' : 'mouseup',
                self = this;

                this.container.on(touchstart, function(e){
                    self._touchstart(e);
                }).on(touchmove, function(e){
                    self._touchmove(e);
                }).on(touchend, function(e){
                    self._touchend(e);
                });
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
                this.options.onPrev();
            } else if (deltaX < 0) {
                this.options.onNext();
            }
        }
    }

    $.SwipePager.defaults = {
        onPrev:function(){},
        onNext:function(){}
    }


})(Zepto);