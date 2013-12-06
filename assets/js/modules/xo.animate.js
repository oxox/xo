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

    this.run = function($el,aniName,goingBack){
        var animation = this.get(aniName);
        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        goingBack = goingBack || false;

        // Error check for target page
        if ($el === undefined || $el.length === 0) {
            this.unselect();
            XO.warn('Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($el.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('You are already on the page you are trying to navigate to.');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        $el.trigger(XO.EVENT.Animate.Start, { direction: C.CLASS.ANIMATION_IN, back: goingBack });

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            var finalAnimationName = animation.name,
                is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $el.one('webkitAnimationEnd', animateEndHandler);

            // Trigger animations
            XO.$body.addClass(C.CLASS.ANIMATING + is3d);

            $el.addClass([finalAnimationName,C.CLASS.ANIMATION_IN,C.CLASS.ACTIVE].join(' '));

        } else {
            $el.addClass([C.CLASS.ACTIVE,C.CLASS.ANIMATION_IN].join(' '));
            animateEndHandler();
        }

        // Private navigationEnd callback
        function animateEndHandler(event) {
            var bufferTime = XO.App.opts.tapBuffer,
                clOut = [finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' ');

            
            if (finalAnimationName) {
                $el.removeClass(finalAnimationName);
            }

            if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
                XO.$body.removeClass(C.CLASS.ANIMATING +' '+C.CLASS.ANIMATION_3D);
            } else {
                bufferTime += 260;
            }

            // 'in' class is intentionally delayed,
            // as it is our ghost click hack
            setTimeout(function() {
                $el.removeClass(C.CLASS.ANIMATION_IN);
                window.scroll(0,0);
            }, bufferTime);

            // Trigger custom events
            $el.trigger(XO.EVENT.Animate.End, {
                direction:C.CLASS.ANIMATION_IN,
                animation: animation,
                back: goingBack
            });
        }

    };

    //switch Pages or Sections
    this.switch = function($from, $to, aniName, goingBack) {

        var animation = this.get(aniName);
        animation = animation.name!==C.DEFAULT.ANIMATION_NONE?animation:null;

        goingBack = goingBack || false;

        // Error check for target page
        if ($to === undefined || $to.length === 0) {
            this.unselect();
            XO.warn('Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($to.hasClass(C.CLASS.ACTIVE)) {
            this.unselect();
            XO.warn('You are already on the page you are trying to navigate to.');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        $from.trigger(XO.EVENT.Animate.Start, { direction: C.CLASS.ANIMATION_OUT, back: goingBack });
        $to.trigger(XO.EVENT.Animate.Start, { direction: C.CLASS.ANIMATION_IN, back: goingBack });

        if (XO.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!XO.support.transform3d && animation.is3d) {
                XO.warn('Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            var finalAnimationName = animation.name,
                is3d = animation.is3d ? (' '+C.CLASS.ANIMATION_3D) : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, this.getReverseAnimation);
            }

            XO.warn('finalAnimationName is ' + finalAnimationName + '.');

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

            // Trigger custom events
            $to.trigger(XO.EVENT.Animate.End, {
                direction:C.CLASS.ANIMATION_IN,
                animation: animation,
                back: goingBack
            });
            $from.trigger(XO.EVENT.Animate.End, {
                direction:C.CLASS.ANIMATION_OUT,
                animation: animation,
                back: goingBack
            });
        }

        return true;
    };//switch
});