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
                $tempItem = null,
                me = this;

            this.index = 0;

            if (opts.useAnimation) {
                this.$nav.css({
                    '-webkit-transition-duration': opts.duration + 'ms'
                });
            }
            this.isTouch = 'ontouchstart' in window;

            this.itemOuterWidths = [];

            $.each(this.$items, function(i,o){
                $tempItem = me.$items.eq(i);
                tempItemWidth = $tempItem.outerWidth();
                me.itemOuterWidths.push(tempItemWidth);
                width += tempItemWidth;
            });
            $tempItem = null;

            this.$nav.width(width);
            this.navWidth = width;
            
            this._initDimension();
            

            /* 页面onload后，因为渲染时间差，如果ul不舍宽度，会导致内部li的offset left值不准确
            var me = this;
            window.setTimeout(function(){
                me.setCurrent( (idx===null?opts.index:idx) );
            }, 300)
            */
            
            this.setCurrent( (idx===null?this.opts.index:idx) );
            
            this._bindEvent();
        },

        _initDimension:function(){
            //外层容器
            this.outerDim = {};

            this.outerDim.offsetLeft = this.$container.offset().left;
            this.outerDim.width = this.$container.outerWidth();
            this.outerDim.maxWidth = this.outerDim.offsetLeft + this.outerDim.width;
            //内层tab容器
            this.innerDim = {};
            this.innerDim.offsetLeft = this.$nav.offset().left;
            this.innerDim.width = this.navWidth;
            this.innerDim.maxWidth = this.navWidth+this.innerDim.offsetLeft;

            this.innerDim.maxSlidableDistance = this.innerDim.maxWidth - this.outerDim.maxWidth;

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
                click = 'click',
                me = this;

            this.$items.on(click, function(e){
                var $this = $(this);
                if ($this.hasClass(me.opts.currentCls)) {
                    e.preventDefault();
                    return false;
                }
                if(me.opts.onBeforeNav()===false){
                    e.preventDefault();
                    return false;
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
            this.isScrolling = false;
            this.startX = point.pageX;
            this.startY = point.pageY;
        },

        _touchmove: function(e){
            if ( e.touches && e.touches.length > 1 || e.scale && e.scale !== 1) {
                return ;
            }
            if (this.isScrolling) {
                return ;
            }
            var point = this.isTouch ? e.touches[0] : e;
            this.isScrolling = Math.abs(point.pageX - this.startX) < Math.abs(point.pageY - this.startY);
            if (this.isScrolling) {
                return ;
            }
            e.preventDefault();
        },

        _touchend: function(e){
            if (this.isScrolling) { 
                return ; 
            }
            var point = this.isTouch ? e.changedTouches[0] : e,
                deltaX = point.pageX - this.startX;
            
            if(Math.abs(deltaX)<this.opts.swipeThreshold){
                return;
            }

            if (deltaX > 0) {
                if(this.opts.swipeToNav){
                    this.goPrev();
                }else{
                    this.adjustPosByPX(deltaX);
                }
                
            } else if (deltaX < 0) {
                if(this.opts.swipeToNav){
                    this.goNext();
                }else{
                    this.adjustPosByPX(deltaX);
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
                return;
            }
            var currentCls = this.opts.currentCls,
                isNext = this.index < index;
            this.$curItem = this.$items.removeClass(currentCls).eq(index).addClass(currentCls);
            this.index = index;
            this.adjustPosTo(index,isNext);
        },

        adjustPosByPX:function(pxVal){
            pxVal = this.posX + pxVal;
            pxVal = pxVal>0?0:pxVal;
            pxVal = ( pxVal< (-this.innerDim.maxSlidableDistance) ) ? (-this.innerDim.maxSlidableDistance):pxVal;
            this.animateTo(pxVal);
        },
        animateTo:function(xVal){

            if(xVal===null) return;

            this.posX = xVal;

            var cssKey1 = this.opts.useCss3?'-webkit-transform':'left',
                cssValueTpl1 = (!this.opts.useCss3) ? '$px':(this.opts.use3d?'translate3d($px,0,0)':'translateX($px)'),
                css = {};

            css[cssKey1] = cssValueTpl1.replace('$',xVal);
            this.$nav.css(css);
        },
        adjustPosTo: function(index,isNext){
            var $item = this.$curItem,
                adjustX = null;

            //第一个TAB
            if (this.index == 0) {
                adjustX = 0;
            }else if(this.index == this.cnt - 1){
                //最后一个TAB
                adjustX = this.innerDim.maxSlidableDistance > 0? (-this.innerDim.maxSlidableDistance):0;
            }else if (isNext) {
                //多显示下一个菜单
                $item = this.$items.eq(this.index+1);
                adjustX = $item.offset().left + this.itemOuterWidths[this.index+1]  - this.outerDim.maxWidth;
                if(adjustX>0){
                    adjustX = this.posX-adjustX;
                }else{
                    adjustX = null;
                }
            }else{
                //多显示上一个菜单
                $item = this.$items.eq(this.index-1);
                adjustX = $item.offset().left  - this.outerDim.offsetLeft;
                if (adjustX < 0) {
                    adjustX = this.posX - adjustX;
                }else{
                    adjustX = null;
                }
            }//if
            this.animateTo(adjustX);
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
        duration: 250, //ms
        swipe: true,
        use3d:true,
        useCss3:true,
        swipeThreshold:5,
        onBeforeNav:function(){return true;}, //onBeforeNav callback,return false to prevent navigating
        swipeToNav:false //swipe to navigation 
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