//Base View Module
XO('View',function($,C){
    this.exposeEvent([
        'Init',
        'Inited',
        'InitedTemplate',
        'InitedTemplateError',
        'AnimateStart',
        'AnimationEnd'
    ]);
    this.caches={};
    this.$curView = null;
    this.defaultActions = {
        initialize:function(){
            this.isRendered = typeof(this.src)!=='undefined';
            this.isRemote = (!this.isRendered && this.src.indexOf(C.DEFAULT.TEMPLATE_SUFFIX)!==-1);
            this.$host = $(this.cssHost);
            XO.Event.trigger(XO.EVENT.View.Init);
            if(this.isRendered){
                this.initFromDom();
                return;
            }
            this.initFromSrc();
        },
        initFromDom:function(){
            this.el = document.getElementById(this.id);
            this.$el = $(this.el);
            this.transition = this.el.getAttribute[C.ATTR.ANIMATION]||C.DEFAULT.ANIMATION;
            XO.Event.trigger(XO.EVENT.View.Inited);
        },
        initFromSrc:function(){
            //load from local storage
            var lsKey = XO.Page.getLSKey(this.id),
                lsObj = XO.LS[lsKey],
                me = this;

            // local inline template
            if(!this.isRemote){
                this.tpl = document.getElementById(this.src);
                XO.Event.trigger(XO.EVENT.View.InitedTemplate);
                return;
            };
            // remote template
            // check localstorage firstly
            if(lsObj&&(lsObj = JSON.parse(lsObj))&&lsObj.src===this.src){
                this.tpl = lsObj.tpl;
                XO.Event.trigger(XO.EVENT.View.InitedTemplate);
                return;
            };
            //load from remote url
            $.ajax({
                url:this.src,
                cache:false
            }).done(function(data, status, xhr){
                me.tpl = data;
                //save to LS
                XO.LS[lsKey] = JSON.stringify({
                    tpl:data,
                    src:me.src
                });
                XO.Event.trigger(XO.EVENT.View.InitedTemplate);
            }).fail(function(xhr, errorType, error){
                XO.Event.trigger(XO.EVENT.View.InitedTemplateError);
            });
        },
        //render a page with specified data
        render:function(data){
            
            var html = XO.toHtml(this.tpl,data);
            this.$host.append(html);

            this.initFromDom();
        }
    };
    this.define = function(name,opts){
        opts = $.extend(opts||{},this.defaultActions);
        var tempView = XO.baseView.extend(opts);
        tempView.id = opts.id||name;
        this.caches[tempView.id] = tempView;
        return tempView;
    };
    this.get = function(id){
        return this.caches[id];
    };

    this.init = function(){
        var defaultPageId = XO.$body[0].getAttribute(C.ATTR.PAGE),
            pageSrc = XO.$body[0].getAttribute(C.ATTR.PAGE_SRC);
        //default view
        this.define(defaultPageId,{
            cssHost:C.SELECTOR.PAGE_WRAPPER
            id:defaultPageId,
            src:pageSrc
        });
    };
    //show a view 
    this.show = function(viewObj){
        var view = this.get(viewObj.id);
        if(view&&view.isRendered){
            XO.Animate.run(view.$el,);
        };
    };
    //switch views
    this.switch=function($from, $to, animation, goingBack) {

        goingBack = goingBack || false;

        // Error check for target page
        if ($to === undefined || $to.length === 0) {
            $.fn.unselect();
            warn('Target element is missing.');
            return false;
        }

        // Error check for $from === $to
        if ($to.hasClass('current')) {
            $.fn.unselect();
            warn('You are already on the page you are trying to navigate to.');
            return false;
        }

        // Collapse the keyboard
        $(':focus').trigger('blur');

        $from.trigger(XO.EVENT.View.AnimateStart, { direction: C.CLASS.ANIMATION_OUT, back: goingBack });
        $to.trigger(XO.EVENT.View.AnimateStart, { direction: C.CLASS.ANIMATION_IN, back: goingBack });

        if ($.support.animationEvents && animation && XO.App.opts.useAnimations) {
            // Fail over to 2d animation if need be
            if (!$.support.transform3d && animation.is3d) {
                warn('Did not detect support for 3d animations, falling back to ' + XO.App.opts.defaultAnimation + '.');
                animation.name = XO.App.opts.defaultAnimation;
            }

            // Reverse animation if need be
            var finalAnimationName = animation.name,
                is3d = animation.is3d ? 'animating3d' : '';

            if (goingBack) {
                finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, reverseAnimation);
            }

            warn('finalAnimationName is ' + finalAnimationName + '.');

            // Bind internal 'cleanup' callback
            $from.bind('webkitAnimationEnd', navigationEndHandler);

            // Trigger animations
            XO.$body.addClass('animating ' + is3d);

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

        // Housekeeping
        XO.View.$curView = $to;
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
            var bufferTime = tapBuffer;

            if ($.support.animationEvents && animation && XO.App.opts.useAnimations) {
                $from.unbind('webkitAnimationEnd', navigationEndHandler);
                $from.removeClass([finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' '));
                if (finalAnimationName) {
                    $to.removeClass(finalAnimationName);
                }
                XO.$body.removeClass('animating animating3d');
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
                $from.removeClass([finalAnimationName,C.CLASS.ANIMATION_OUT,C.CLASS.ANIMATION_INMOTION].join(' '));
                if (finalAnimationName) {
                    $to.removeClass(finalAnimationName);
                }
                bufferTime += 260;
            }

            // 'in' class is intentionally delayed,
            // as it is our ghost click hack
            setTimeout(function() {
                $to.removeClass('in');
                window.scroll(0,0);
            }, bufferTime);

            $from.unselect();

            // Trigger custom events
            $to.trigger(XO.EVENT.View.AnimationEnd, {
                direction:C.CLASS.ANIMATION_IN,
                animation: animation,
                back: goingBack
            });
            $from.trigger(XO.EVENT.View.AnimationEnd, {
                direction:C.CLASS.ANIMATION_OUT,
                animation: animation,
                back: goingBack
            });
        }

        return true;
    };//switch


});