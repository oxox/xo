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
            return;
        }
        $('.'+C.CLASS.UIACTIVE).removeClass(C.CLASS.UIACTIVE);
    };

    this.makeActive = function($obj){
        $obj.addClass(C.CLASS.UIACTIVE);
    };

    this.run = function(view,aniName,direction,goingBack){
        var animation = this.get(aniName),
            $el = view.$el;
        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;
        direction = direction!==C.CLASS.ANIMATION_OUT ? C.CLASS.ANIMATION_IN:C.CLASS.ANIMATION_OUT;
        goingBack = goingBack || false;

        var isHiding = direction===C.CLASS.ANIMATION_OUT,
            finalAnimationName,
            clOut,
            eventData = { "direction": direction, back: goingBack,animation:animation,isHiding:isHiding };

        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            this.unselect();
            XO.warn('XO.Animate.run:Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if (!isHiding && $el.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('XO.Animate.run:You are already on the page you are trying to navigate to.');
            return false;
        }

        if(isHiding && !$el.hasClass(C.CLASS.ACTIVE)){
            this.unselect();
            XO.warn('XO.Animate.run:Element already hidden!');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        XO.Event.trigger(view,XO.EVENT.Animate.Start,eventData);
        view.onAnimating&&view.onAnimating.call(view,eventData);

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.run:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name,
                is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.run:finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.bind('webkitAnimationEnd', animateEndHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            clOut = [finalAnimationName,C.CLASS.ANIMATION_OUT, C.CLASS.ANIMATION_INMOTION].join(' ');

            if(!isHiding){
                $el.addClass([finalAnimationName,direction,C.CLASS.ACTIVE].join(' '));
            }else{
                $el.removeClass(C.CLASS.ACTIVE).addClass(clOut);
            }


        } else {
            if(!isHiding){
                $el.addClass([C.CLASS.ACTIVE,direction].join(' '));
            }else{
                $el.remvoeClass(C.CLASS.ACTIVE);
            }
            animateEndHandler();
        }

        // Private navigationEnd callback
        function animateEndHandler(event) {
            var bufferTime = XO.App.opts.tapBuffer;

            $el.unbind('webkitAnimationEnd', animateEndHandler);

            if (finalAnimationName) {
                $el.removeClass(finalAnimationName);
            }
            if(isHiding){
                $el.removeClass(clOut);
            }

            if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
                XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
            } else {
                bufferTime += 260;
            }

            // 'in' class is intentionally delayed,
            // as it is our ghost click hack
            setTimeout(function() {
                if(!isHiding){
                    $el.removeClass(direction);
                    window.scroll(0,0);
                }
            }, bufferTime);

            // 插件初始化
            XO.plugin.applyToView(view);

            // Trigger custom events
            XO.Event.trigger(view,XO.EVENT.Animate.End, eventData);
            //onAnimated callback detect
            view.onAnimated&&view.onAnimated.call(view,eventData);
            
        }

    };

    //switch Pages or Sections
    this.switch = function(from, to, aniName, goingBack) {

        var animation = this.get(aniName),
            $from = from.$el,
            $to = to.$el;

        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;
        goingBack = goingBack || false;

        var finalAnimationName,
            is3d,
            eventDataFrom = { direction: C.CLASS.ANIMATION_OUT, back: goingBack ,animation:animation,isHiding:true},
            eventDataTo = { direction: C.CLASS.ANIMATION_IN, back: goingBack ,animation:animation,isHiding:false};

        // Error check for target page
        if ($to === undefined || $to.length === 0) {
            this.unselect();
            XO.warn('XO.Animate.switch:Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($to.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('XO.Animate.switch:You are already on the page you are trying to navigate to.');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        XO.Event.trigger(from,XO.EVENT.Animate.Start, eventDataFrom);
        XO.Event.trigger(to,XO.EVENT.Animate.Start, eventDataTo);

        from.onAnimating&&from.onAnimating.call(from,eventDataFrom);
        to.onAnimating&&to.onAnimating.call(from,eventDataFrom);

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('XO.Animate.switch:Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            finalAnimationName = animation.name;
            is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('XO.Animate.switch: finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $from.bind('webkitAnimationEnd', navigationEndHandler);

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

            $to.addClass([finalAnimationName,C.CLASS.ANIMATION_IN,C.CLASS.ACTIVE].join(' '));
            $from.removeClass(C.CLASS.ACTIVE).addClass([finalAnimationName,C.CLASS.ANIMATION_OUT, C.CLASS.ANIMATION_INMOTION].join(' '));

            /*
            if (XO.App.opts.trackScrollPositions === true) {
                $from.data('lastScroll', lastScroll);
                $('.scroll', $from).each(function() {
                    $(this).data('lastScroll', this.scrollTop);
                });
            }
            */
        } else {
            $to.addClass([C.CLASS.ACTIVE,C.CLASS.ANIMATION_IN].join(' '));
            $from.removeClass(C.CLASS.ACTIVE);
            navigationEndHandler();
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
        function navigationEndHandler(event) {
            var bufferTime = XO.App.opts.tapBuffer,
                clOut = [finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' ');

            if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
                $from.unbind('webkitAnimationEnd', navigationEndHandler);
                $from.removeClass(clOut);
                if (finalAnimationName) {
                    $to.removeClass(finalAnimationName);
                }
                XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
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
                $from.removeClass(clOut);
                if (finalAnimationName) {
                    $to.removeClass(finalAnimationName);
                }
                bufferTime += 260;
            }

            // 'in' class is intentionally delayed,
            // as it is our ghost click hack
            setTimeout(function() {
                $to.removeClass(C.CLASS.ANIMATION_IN);
                window.scroll(0,0);
            }, bufferTime);

            XO.Animate.unselect($from);


            // 插件初始化
            XO.plugin.applyToView(from);
            XO.plugin.applyToView(to);

            // Trigger custom events
            XO.Event.trigger(to,XO.EVENT.Animate.End, eventDataTo);
            XO.Event.trigger(from,XO.EVENT.Animate.End, eventDataFrom);

            from.onAnimated&&from.onAnimated.call(from,eventDataFrom);
            to.onAnimated&&to.onAnimated.call(from,eventDataFrom);
        }

        return true;
    };//switch
});