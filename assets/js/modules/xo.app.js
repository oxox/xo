XO('App',function($,C){

    //隐藏地址栏
    this.hideAddressBar = function(){
        window.scrollTo(0,0);
    };

    this.init = function(opts){

        //浏览器类型
        $.os.desktop = !($.os.ios || $.os.android || $.os.blackberry || $.os.opera || $.os.fennec);

        //fastclick https://github.com/ftlabs/fastclick
        FastClick.attach(document.body);

        this.opts = $.extend({
            useFastTouch:true,
            useAnimations:true,
            defaultAnimation:'slideleft',
            trackScrollPositions:true,
            useTouchScroll:true,
            tapBuffer:100, // High click delay = ~350, quickest animation (slide) = 250
            debug:true,
            defaultPage:C.DEFAULT.PAGE,
            defaultView:C.DEFAULT.VIEW,
            viewDir:'assets/html/pages/'
        },opts||{});
        delete this['init'];
        //init all modules
        for(var c in XO){
            XO[c].init&&XO[c].init.call(XO[c],this.opts);
            delete XO[c].init;
        };

        //旋屏
        window.addEventListener(XO.EVENT.Sys.viewChange, this.hideAddressBar);

        this.hideAddressBar();
        

        //hashchange
        XO.history.start();
        //XO.history.start({pushState:true});
        
        //default page and view
        var page = this.opts.defaultPage;
        if(!window.location.hash.substring(1)){
            XO.Router.instance.navigate('page/'+page, {trigger: true, replace: true});
        }

        XO.support.touch && window.addEventListener('touchstart', function(){
            XO.App.hideAddressBar();
        }, true);

        delete this.init;

    };
});