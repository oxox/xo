/**
 * navslide plugin
 */
(function($) {
    $.fn.outerWidth = function(){
        var val = this.width();
        val+=parseFloat(this.css('margin-left').replace('px',''))||0;
        val+=parseFloat(this.css('margin-right').replace('px',''))||0;
        val+=parseFloat(this.css('padding-left').replace('px',''))||0;
        val+=parseFloat(this.css('padding-right').replace('px',''))||0;
        return val;
    };

    $.fn.navSlide = function(opts) {
        if(this.length == 0) {
            return this;
        }
        this.each(function() {
            $.NavSlide.cache[this.id] = new $.NavSlide($(this),opts);
        });
    };

    $.NavSlide = function($container, opts) {
        opts = $.extend(true, {}, $.NavSlide.defaults, opts||{});
        this.$container = $container;
        this.$nav = $container.find(opts.cssTab);
        this.$items = $container.find(opts.cssTabItem);
        this.cnt = this.$items.length;
        this.posX = 0;
        this.opts = opts;
        this._init();
    };

    $.NavSlide.prototype = {
        _init: function(){
            var width = 0, opts = this.opts,
                idx = this._getItemIndexByHash(),
                tempItemWidth = 0,
                me = this;

            this.itemOuterWidths = [];

            $.each(this.$items, function(i,o){
                tempItemWidth = me.$items.eq(i).outerWidth();
                me.itemOuterWidths.push(tempItemWidth);
                width += tempItemWidth;
            });

            this.$nav.width(width);
            
            if (opts.useAnimation) {
                this.$nav.css({
                    '-webkit-transition-duration': opts.duration + 'ms'
                });
            }
            this.isTouch = 'ontouchstart' in window;;
            this.viewPos = {};
            this.viewPos.x = this.$container.offset().left;
            this.viewPos.y = this.viewPos.x + this.$container.outerWidth();
            this.index = 0;

            /* 页面onload后，因为渲染时间差，如果ul不舍宽度，会导致内部li的offset left值不准确
            var me = this;
            window.setTimeout(function(){
                me.setCurrent( (idx===null?opts.index:idx) );
            }, 300)
            */
            
            this.setCurrent( (idx===null?this.opts.index:idx) );
            
            this._bindEvent();
        },

        _getItemIndexByHash:function(){
            var hash = window.location.hash,
                idx = null;
            this.$items.each(function(i,o){
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
                click = isTouch?'tap':'click',
                me = this;

            this.$items.on(click, function(e){
                var $this = $(this);
                if ($this.hasClass(me.opts.currentCls)) {
                    return ;
                }
                var index = $this.index(this.$items);
                me.setCurrent(index);
            });
            if (this.opts.swipe) {
                this.$nav.on(touchstart, function(e){
                    me._touchstart(e);
                }).on(touchmove, function(e){
                    me._touchmove(e);
                }).on(touchend, function(e){
                    me._touchend(e);
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
            this.isScrolling = Math.abs(point.pageX - this.startX) < Math.abs(point.pageY - this.startY);
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
                if(this.opts.swipeToNav){
                    this.goPrev();
                }else{
                    //TODO:调整导航位置
                }
                
            } else if (deltaX < 0) {
                if(this.opts.swipeToNav){
                    this.goNext();
                }else{
                    //TODO:
                }
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
            if(idx>=this.cnt){
                return this;
            }
            this.setCurrent(idx);
            return this;
        },
        getCurrentItem:function(){
            return this.$items.eq(this.index);
        },
        setCurrent: function(index){
            if (index === this.index) {
                return ;
            }
            if (index < 0 || index > this.cnt - 1) {
                index = 0;
            }
            var currentCls = this.opts.currentCls,
                isNext = this.index < index;
            this.$items.removeClass(currentCls).eq(index).addClass(currentCls);
            this.index = index;
            this._adjustPos(isNext);
        },

        _adjustPos: function(isNext){
            var $item = this.$items.eq(this.index),
                translateTpl = this.opts.use3d?'translate3d($px,0,0)':'translateX($px)';
            //var left = (parseFloat(this.css('margin-left').replace('px','')) || 0) + (parseFloat(this.css('left').replace('px','')) || 0);
            if (this.index == 0) {
                this.posX = 0;
                this.$nav.css({
                    '-webkit-transform': translateTpl.replace('$',this.posX),
                });
            } else if(this.index == this.cnt - 1){
                var x = $item.offset().left + this.itemOuterWidths[this.index]  - this.viewPos.y;
                if (x > 0) {
                    this.posX -= x;
                    this.$nav.css({
                        '-webkit-transform': translateTpl.replace('$',this.posX),
                    });
                }   
            } else {
                if (isNext) {
                    $item = $item.next();
                    var x = $item.offset().left + $item.outerWidth()  - this.viewPos.y;
                    if (x > 0) {
                        this.posX -= x;
                        this.$nav.css({
                            '-webkit-transform': translateTpl.replace('$',this.posX),
                        });
                    }
                } else {
                    $item = $item.prev();
                    var x = $item.offset().left  - this.viewPos.x;
                    if (x < 0) {
                        this.posX -= x;
                        this.$nav.css({
                            '-webkit-transform': translateTpl.replace('$',this.posX),
                        });
                    }
                }
            }
        }
    }

    $.NavSlide.defaults = {
        currentCls: 'current',
        cssTab:'ul',
        cssTabItem:'li',
        cssPlugin:'[data-plugin_navslide]',
        attrPluginData:'data-plugin_navslide_data',
        index: 0,
        useAnimation: true,
        duration: 300, //ms
        swipe: true,
        use3d:true,
        swipeToNav:true //swipe to navigation 
    };
    $.NavSlide.cache = {};

    $(function(){
        $($.NavSlide.defaults.cssPlugin).each(function(i,o){
            var _json = window['JSON']?JSON : {parse:eval,isEval:true},
                data = o.getAttribute($.NavSlide.defaults.attrPluginData)||'{}';
            data = _json.parse(_json.isEval? ('('+data+')'):data);
            $(o).navSlide(data);
        });
    });

})(Zepto);