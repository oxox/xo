XO('support',function($,C){

    var helpers = {

        supportForTransform3d : function() {

            var mqProp = "transform-3d",
                vendors = [ "Webkit", "Moz", "O" ],
                fakeBody = $( "<body>" ).prependTo( "html" ),
                // Because the `translate3d` test below throws false positives in Android:
                ret = XO.media.test( "(-" + vendors.join( "-" + mqProp + "),(-" ) + "-" + mqProp + "),(" + mqProp + ")" ),
                el, transforms, t;

            if ( ret ) {
                return !!ret;
            }

            el = document.createElement( "div" );
            transforms = {
                // We’re omitting Opera for the time being; MS uses unprefixed.
                "MozTransform": "-moz-transform",
                "transform": "transform"
            };

            fakeBody.append( el );

            for ( t in transforms ) {
                if ( el.style[ t ] !== undefined ) {
                    el.style[ t ] = "translate3d( 100px, 1px, 1px )";
                    ret = window.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
                }
            }
            fakeBody.parentNode.removeChild(fakeBody);
            return ( !!ret && ret !== "none" );
        },
        supportIOS5 : function() {
            var support = false,
                REGEX_IOS_VERSION = /OS (\d+)(_\d+)* like Mac OS X/i,
                agentString = window.navigator.userAgent;
            if (REGEX_IOS_VERSION.test(agentString)) {
                support = (REGEX_IOS_VERSION.exec(agentString)[1] >= 5);
            }
            return support;
        }
    };

    this.init = function(opts){
        this.animationEvents = (typeof window.WebKitAnimationEvent !== 'undefined');
        this.touch = (typeof window.TouchEvent !== 'undefined') && (window.navigator.userAgent.indexOf('Mobile') > -1) && XO.App.opts.useFastTouch;
        this.transform3d = helpers.supportForTransform3d();
        this.ios5 = helpers.supportIOS5();

        if (!this.touch) {
            XO.warn('This device does not support touch interaction, or it has been deactivated by the developer. Some features might be unavailable.');
        }
        if (!this.transform3d) {
            XO.warn('This device does not support 3d animation. 2d animations will be used instead.');
        }

        var featuresClass=[];
        this.transform3d&&featuresClass.push(C.CLASS.SUPPORT_3D);
        if(opts.useTouchScroll){
            if(this.ios5){
                featuresClass.push(C.CLASS.TOUCHSCROLL);
            }else{
                featuresClass.push(C.CLASS.AUTOSCROLL);
            }
        }

        XO.$body.addClass(featuresClass.join(' '));

    }

});