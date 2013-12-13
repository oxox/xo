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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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
                    var $item = window['J_navslide_obj'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = window['J_navslide_obj'].goNext().getCurrentItem().find('a');
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

(function($) {
	$.fn.outerWidth = function(){
        var val = this.width();
        val+=parseFloat(this.css('margin-left').replace('px',''))||0;
        val+=parseFloat(this.css('margin-right').replace('px',''))||0;
        val+=parseFloat(this.css('padding-left').replace('px',''))||0;
        val+=parseFloat(this.css('padding-right').replace('px',''))||0;
        return val;
    };

	$.fn.navSlide = function(options) {
		if(this.length == 0) {
			return this;
		}
		this.each(function() {
			window[this.id+'_obj']= new $.NavSlide($(this),options);
		});
	};

	$.NavSlide = function(container, options) {
		this.container = $(container);
		this.nav = this.container.children().eq(0);
		this.posX = 0;
		this.items = this.nav.children();
		this.options = $.extend(true, {}, $.NavSlide.defaults, options);
		this._init();
	}

	$.NavSlide.prototype = {
		_init: function(){
			var width = 0, opts = this.options,
				idx = this._getItemIndexByHash();
			$.each(this.items, function(){
				width += $(this).outerWidth();
			});
			this.nav.width(width);
			if (opts.useAnimation) {
				this.nav.css({
					'-webkit-transition-duration': opts.duration + 'ms'
				});
			}
			this.isTouch = 'ontouchstart' in window;;
			this.viewPos = {};
			this.viewPos.x = this.container.offset().left;
			this.viewPos.y = this.viewPos.x + this.container.outerWidth();
			this.index = 0;

			/* 页面onload后，因为渲染时间差，如果ul不舍宽度，会导致内部li的offset left值不准确
			var me = this;
			window.setTimeout(function(){
				me.setCurrent( (idx===null?this.options.index:idx) );
			}, 300)
			*/
			
			this.setCurrent( (idx===null?this.options.index:idx) );
			
			this._bindEvent();
		},

		_getItemIndexByHash:function(){
			var hash = window.location.hash,
				idx = null;
			this.items.each(function(i,o){
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
				me = this;

			this.items.on('click', function(e){
				if ($(this).hasClass(me.options.currentCls)) {
					return ;
				}
				var index = $(this).index(this.items);
				me.setCurrent(index);
			});
			if (this.options.swipe) {
				this.nav.bind(touchstart, function(e){
					me._touchstart(e);
				});
				this.nav.bind(touchmove, function(e){
					me._touchmove(e);
				});
				this.nav.bind(touchend, function(e){
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
				if (this.index == this.items.length -1 ) {
					return ;
				}
				this.setCurrent(this.index - 1);
			} else if (deltaX < 0) {
				if (this.index == 0 ) {
					return ;
				}
				this.setCurrent(this.index + 1);
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
			if(idx>=this.items.length){
				return this;
			}
			this.setCurrent(idx);
			return this;
		},
		getCurrentItem:function(){
			return this.items.eq(this.index);
		},
		setCurrent: function(index){
			if (index === this.index) {
				return ;
			}
			if (index < 0 || index > this.items.length - 1) {
				index = 0;
			}
			var currentCls = this.options.currentCls;
			var isNext = this.index < index;
			this.items.eq(index).addClass(currentCls).siblings().removeClass(currentCls);
			this.index = index;
			this._adjustPos(isNext);
		},

		_adjustPos: function(isNext){
			var item = this.items.eq(this.index);
			//var left = (parseFloat(this.css('margin-left').replace('px','')) || 0) + (parseFloat(this.css('left').replace('px','')) || 0);
			if (this.index == 0) {
				this.posX = 0;
				this.nav.css({
					'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
				});
			} else if(this.index == this.items.length - 1){
				var x = item.offset().left + item.outerWidth()  - this.viewPos.y;
				if (x > 0) {
					this.posX -= x;
					this.nav.css({
						'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
					});
				}	
			} else {
				if (isNext) {
					item = item.next();
					var x = item.offset().left + item.outerWidth()  - this.viewPos.y;
					if (x > 0) {
						this.posX -= x;
						this.nav.css({
							'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
						});
					}
				} else {
					item = item.prev();
					var x = item.offset().left  - this.viewPos.x;
					if (x < 0) {
						this.posX -= x;
						this.nav.css({
							'-webkit-transform': 'translate3d(' + this.posX + 'px,0,0)',
						});
					}
				}
			}
		}
	}

	$.NavSlide.defaults = {
		currentCls: 'current',
		index: 0,
		useAnimation: true,
		duration: 300, //ms
		swipe: true
	}


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