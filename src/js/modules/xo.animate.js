/**
 * Animation module
 */
XO('Animate',function($,C){

    this.exposeEvent([
        'Start',
        'End'
    ]);
    //ref:https://github.com/senchalabs/jQTouch/blob/master/src/jqtouch.js
    this.animations = { // highest to lowest priority
        'cubeleft':{name:'cubeleft', is3d: true},
        'cuberight':{name:'cuberight', is3d: true},
        'dissolve':{name:'dissolve'},
        'fade':{name:'fade'},
        'flipleft':{name:'flipleft',is3d: true},
        'flipright':{name:'flipright',is3d: true},
        'pop':{name:'pop', is3d: true},
        'swapleft':{name:'swapleft', is3d: true},
        'swapright':{name:'swapright', is3d: true},
        'slidedown':{name:'slidedown'},
        'slideright':{name:'slideright'},
        'slideup':{name:'slideup'},
        'slideleft':{name:'slideleft'},
        'xo_ani_slideleft':{name:'xo_ani_slideleft',is3d:true},
        'none':{name:'none'}
    };

    this.getReverseAnimation = function(animation) {
        var opposites={
            'up' : 'down',
            'down' : 'up',
            'left' : 'right',
            'right' : 'left',
            'in' : 'out',
            'out' : 'in'
        };
        return opposites[animation] || animation;
    }

    this.add = function(aniObj){
        this.animations[aniObj.name]=aniObj;
    };

    this.get = function(name){
        return this.animations[name]||this.animations[XO.App.opts.defaultAnimation];
    };

    this.unselect = function($obj){
        if($obj){
            $obj.removeClass(C.CLASS.UIACTIVE);
            $obj.find('.'+C.CLASS.UIACTIVE).removeClass(C.CLASS.UIACTIVE);
            return;
        }
        $('.'+C.CLASS.UIACTIVE).removeClass(C.CLASS.UIACTIVE);
    };

    this.makeActive = function($obj){
        $obj.addClass(C.CLASS.UIACTIVE);
    };

    /**
     * animate in a view
     */
    this.animateIn = function(view,aniObj,cfg){
        var aniName = aniObj.animation,
            animation = this.get(aniName),
            goingBack = aniObj.back||false,
            $el = view.$el,
            finalAnimationName = '',
            is3d,
            eventData,
            needAnimation = false;

        aniObj.animation = animation.name;

        cfg = cfg||{};

        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        XO.Animate.isAnimatingIn = false;

        eventData = { 
            "direction": C.CLASS.ANIMATION_IN, 
            "back": goingBack ,
            "animation":animation,
            "view":view,
            "isHiding":false
        };

        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            this.unselect();
            XO.warn('XO.Animate.animateIn:Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($el.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('XO.Animate.animateIn:You are already on the page you are trying to navigate to.');
            return false;
        }

        //XO.View.uiLogger&&XO.View.uiLogger.log('animateIn:'+JSON.stringify(aniObj),view.id);

        // Collapse the keyboard
        $(':focus').trigger('blur');

        XO.Event.trigger(view,XO.EVENT.Animate.Start, [eventData]);
        //user callback
        view.onAnimating&&view.onAnimating.call(view,eventData);
        //framework callback
        cfg.onStart&&cfg.onStart.call(view);

        needAnimation = XO.support.animationEvents && animation && XO.App.opts.useAnimations;

        if (needAnimation) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.animateIn:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name;
            is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.animateIn: finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.on('webkitAnimationEnd', animatedInHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            /*
            var lastScroll = window.pageYOffset;

            // Position the incoming page so toolbar is at top of
            // viewport regardless of scroll position on from page
            if (XO.App.opts.trackScrollPositions === true) {
                $to.css('top', window.pageYOffset - ($to.data('lastScroll') || 0));
            }
            */
            if($.os.iphone){
                //解决ios动画不同步或者animationEnd事件在动画结束之前触发的bug
                setTimeout(function(){
                    $el.removeClass(C.CLASS.HIDE).addClass([finalAnimationName,C.CLASS.ANIMATION_IN,C.CLASS.ACTIVE].join(' '));
                },0);
            }else{
                $el.removeClass(C.CLASS.HIDE).addClass([finalAnimationName,C.CLASS.ANIMATION_IN,C.CLASS.ACTIVE].join(' '));
            }
            
            
            XO.Animate.isAnimatingIn = true;
            /*
            if (XO.App.opts.trackScrollPositions === true) {
                $from.data('lastScroll', lastScroll);
                $('.scroll', $from).each(function() {
                    $(this).data('lastScroll', this.scrollTop);
                });
            }
            */
        } else {
            $el.removeClass(C.CLASS.HIDE).addClass([C.CLASS.ACTIVE,C.CLASS.ANIMATION_IN].join(' '));
            animatedInHandler();
        }

        /*
        if (goingBack) {
            history.shift();
        } else {
            addPageToHistory(XO.View.$curView, animation);
        }
        setHash(XO.View.$curView.attr('id'));
        */

        // Private navigationEnd callback
        function animatedInHandler(evt) {
            //prevent child elements's event bubbling
            if(evt && evt.target!==evt.currentTarget) return;

            var clIn = [finalAnimationName,C.CLASS.ANIMATION_IN].join(' ');
            XO.Animate.isAnimatingIn  = false;

            if (needAnimation) {
                $el.off('webkitAnimationEnd', animatedInHandler).removeClass(clIn);

                if(!XO.Animate.isAnimating()){
                    XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
                }
                /*
                if (XO.App.opts.trackScrollPositions === true) {
                    $to.css('top', -$to.data('lastScroll'));

                    // Have to make sure the scroll/style resets
                    // are outside the flow of this function.
                    setTimeout(function() {
                        $to.css('top', 0);
                        window.scroll(0, $to.data('lastScroll'));
                        $('.scroll', $to).each(function() {
                            this.scrollTop = - $(this).data('lastScroll');
                        });
                    }, 0);
                }
                */
            } else {
                $el.removeClass(clIn);
            }

            // Trigger custom events
            XO.Event.trigger(view,XO.EVENT.Animate.End, [eventData]);
            XO.Event.trigger(XO.EVENT.Animate.End,[eventData]);
            // user callback
            view.onAnimated&&view.onAnimated.call(view,eventData);
            //framework callback
            cfg.onEnd&&cfg.onEnd.call(view);

            XO.View.uiLogger&&XO.View.uiLogger.log('animatedInHandler:'+JSON.stringify(aniObj),view.id)
        }
        return true;
    };
    /**
     * animate out a view
     */
    this.animateOut = function(view,aniObj,cfg){
        var aniName = aniObj.animation,
            animation = this.get(aniName),
            $el = view.$el,
            goingBack = aniObj.back||false,
            finalAnimationName = '',
            is3d,
            eventData,
            needAnimation = false;

        aniObj.animation = animation.name;

        cfg = cfg||{};

        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        XO.Animate.isAnimatingOut  = false;

        eventData = { 
            "direction": C.CLASS.ANIMATION_OUT, 
            "back": goingBack ,
            "animation":animation,
            "view":view,
            "isHiding":true
        };
        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            XO.warn('XO.Animate.animateOut:Target element is missing.');
            return false;
        }
        // Collapse the keyboard
        //$(':focus').trigger('blur');

        //XO.View.uiLogger&&XO.View.uiLogger.log('animateOut:'+JSON.stringify(aniObj),view.id);

        XO.Event.trigger(view,XO.EVENT.Animate.Start, [eventData]);
        //user's custom view callback
        view.onAnimating&&view.onAnimating.call(view,eventData);
        //framework's internal view callback
        cfg.onStart&&cfg.onStart.call(view);

        needAnimation = XO.support.animationEvents && animation && XO.App.opts.useAnimations;

        if (needAnimation) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.animateOut:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name;
            is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.animateOut: finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.on('webkitAnimationEnd', animatedOutHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            /*
            var lastScroll = window.pageYOffset;

            // Position the incoming page so toolbar is at top of
            // viewport regardless of scroll position on from page
            if (XO.App.opts.trackScrollPositions === true) {
                $to.css('top', window.pageYOffset - ($to.data('lastScroll') || 0));
            }
            */
            if($.os.iphone){
                //解决ios动画不同步或者animationEnd事件在动画结束之前触发的bug
                setTimeout(function(){
                    $el.removeClass(C.CLASS.ACTIVE).addClass([finalAnimationName,C.CLASS.ANIMATION_OUT, C.CLASS.ANIMATION_INMOTION].join(' '));
                },0);
            }else{
                $el.removeClass(C.CLASS.ACTIVE).addClass([finalAnimationName,C.CLASS.ANIMATION_OUT, C.CLASS.ANIMATION_INMOTION].join(' '));
            }
            
            
            XO.Animate.isAnimatingOut  = true;
            /*
            if (XO.App.opts.trackScrollPositions === true) {
                $from.data('lastScroll', lastScroll);
                $('.scroll', $from).each(function() {
                    $(this).data('lastScroll', this.scrollTop);
                });
            }
            */
        } else {
            $el.removeClass(C.CLASS.ACTIVE);
            animatedOutHandler();
        }

        /*
        if (goingBack) {
            history.shift();
        } else {
            addPageToHistory(XO.View.$curView, animation);
        }
        setHash(XO.View.$curView.attr('id'));
        */

        // Private navigationEnd callback
        function animatedOutHandler(evt) {
            //prevent child elements's event bubbling
            if(evt && evt.target!==evt.currentTarget) return;

            var clOut = [finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' ');
            XO.Animate.isAnimatingOut  = false;
            if (needAnimation) {
                $el.off('webkitAnimationEnd', animatedOutHandler).removeClass(clOut);
                if(!XO.Animate.isAnimating()){
                    XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
                }
                /*
                if (XO.App.opts.trackScrollPositions === true) {
                    $to.css('top', -$to.data('lastScroll'));

                    // Have to make sure the scroll/style resets
                    // are outside the flow of this function.
                    setTimeout(function() {
                        $to.css('top', 0);
                        window.scroll(0, $to.data('lastScroll'));
                        $('.scroll', $to).each(function() {
                            this.scrollTop = - $(this).data('lastScroll');
                        });
                    }, 0);
                }
                */
            }

            XO.Animate.unselect($el);

            // Trigger custom events
            XO.Event.trigger(view,XO.EVENT.Animate.End, [eventData]);
            XO.Event.trigger(XO.EVENT.Animate.End, [eventData]);
            // user's custom callback
            view.onAnimated&&view.onAnimated.call(view,eventData);
            // framework's callback
            cfg.onEnd&&cfg.onEnd.call(view);
        }
        return true;
    };
    /**
     * 页面是否处于动画中
     */
    this.isAnimating = function(){
        return (this.isAnimatingIn||this.isAnimatingOut);

    };
    /**
     * 是否动画显示中
     */
    this.isAnimatingIn = false;
    /**
     * 是否动画隐藏中
     */
    this.isAnimatingOut = false;

});