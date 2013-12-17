/**
 * 用户自定义的控制器：HomeController
 * 注：基于COC（惯例优于配置的原则，在定义视图的时候会生成一个该视图的默认Action），
 * 所以如果用户没有写自定义控制器(controllers/home.js)，XO框架会自动使用默认Action来获取模板，渲染模板。
 * 对于不涉及数据逻辑的视图，完全可以不定义对应的Action
 */
XO.Controller.define('home',{

    index:function(param){

        this.renderView('index',{
            param:param,
            onRendered:function(err,view){

            },
            data:function(params,cbk){
                //TODO:load remote data
                var jsonData = {hi:1};
                cbk(null,jsonData);
            }
        });

        //TODO:先切换上一个View再获取下一个View
        //上一个View移出，=>获取下一个View
        //                      1，下一个View已存在，直接移入
        //                      2，下一个View不存在 =》 显示loading，获取该View =》直接显示

    },
    baby:function(param){

        this.renderView('baby',{
            param:param,
            data:{staticData:true}
        });
    }

});
XO.View.define({
    pid:'home',
    vid:'index',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
XO.View.define({
    pid:'home',
    vid:'baby',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
XO.View.define({
    pid:'home',
    vid:'daily',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
XO.View.define({
    pid:'home',
    vid:'faxian',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
XO.View.define({
    pid:'home',
    vid:'guang',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
XO.View.define({
    pid:'home',
    vid:'pinpai',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});
/**
 * 用户自定义的控制器：HomeController
 * 注：基于COC（惯例优于配置的原则，在定义视图的时候会生成一个该视图的默认Action），
 * 所以如果用户没有写自定义控制器(controllers/home.js)，XO框架会自动使用默认Action来获取模板，渲染模板。
 * 对于不涉及数据逻辑的视图，完全可以不定义对应的Action
 */
XO.Controller.define('search',{

    index:function(param){

        this.renderView('index',{
            param:param,
            onRendered:function(err,view){

            },
            data:function(params,cbk){
                //TODO:load remote data
                var jsonData = {hi:1};
                cbk(null,jsonData);
            }
        });

        //TODO:先切换上一个View再获取下一个View
        //上一个View移出，=>获取下一个View
        //                      1，下一个View已存在，直接移入
        //                      2，下一个View不存在 =》 显示loading，获取该View =》直接显示

    }

});
XO.View.define({
    pid:'search',
    vid:'index',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
    }
});
XO.View.define({
    pid:'common',
    vid:'search',
    alias:'uiSearch',
    dir:null,//dir为null说明为页面中已经存在的视图
    isLoading:false,
    onRender:function(){
        $('#J_mod_nav_search').on('click',function(e){
            XO.View.uiSearch.toggle();
            return false;
        });
        this.$ipt = $('#J_mod_search_ipt').on('blur',function(e){
            XO.View.uiSearch.hide(function(){
                XO.history.navigate('page/search', true);
            });
        });
        $('#J_mod_search_bg').on('click',function(e){
            XO.View.uiSearch.hide();
        });
    },
    toggle:function(){
        if(this.isLoading){
            this.hide();
        }else{
            this.show();
        }
    },
    show:function(){
        if(this.isLoading)
            return;
        this.isLoading = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
        if(!this.$elbd){
            this.$elbd = this.$el.find('.mod_search_bd');
        }
        setTimeout(function(){
            XO.View.uiSearch.$elbd.addClass(XO.CONST.CLASS.UIACTIVE);
            $('#J_mod_search_ipt').focus();
        },0);
    },
    hide:function(cbk){
        this.$elbd.one('webkitTransitionEnd',function(e){
            XO.View.uiSearch.$el.addClass(XO.CONST.CLASS.HIDE);
            XO.View.uiSearch.isLoading = false;
            cbk&&cbk();
        }).removeClass(XO.CONST.CLASS.UIACTIVE);
        this.$ipt.val('');
    }
});
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