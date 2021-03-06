XO('App',function($,C){

    //隐藏地址栏
    this.hideAddressBar = function(){
        window.scrollTo(0,0);
    };

    this.init = function(opts){

        var dummyTplEngine = {
            compile:function(tpl){
                return ({
                    tpl:tpl,
                    render:function(data){
                        return this.tpl;
                    }
                });
            }
        };

        this.opts = $.extend({
            T:window['Hogan']||dummyTplEngine,  //custom template engine implementation
            baseRouter:XO.Base.Router,          //custom router implementation
            history:XO.Base.history,            //custom history implementation
            baseView:XO.Base.View,              //custom view implementation
            useFastTouch:true,
            useAnimations:true,
            useTransform3D:true,
            defaultAnimation:'none',
            trackScrollPositions:true,
            useTouchScroll:true,
            maxViewSizeInDom:2,
            debug:false,
            defaultPage:C.DEFAULT.PAGE,
            defaultView:C.DEFAULT.VIEW,
            defaultControllerAction:null,
            autoControllerAndView:true,          //如果用户没有写controller的js，也没有写view的js，则自动生成controller和view，使用默认action显示静态模板。适用于纯静态app
            viewDir:XO.$body[0].getAttribute('data-viewdir')||'assets/html/'
        },opts||{});

        //shortcuts for T,baseRouter,history,baseView
        XO["T"] = this.opts.T;
        XO["baseRouter"] = this.opts.baseRouter;
        XO["history"] = this.opts.history;
        XO["baseView"] = this.opts.baseView;

        if(this.opts.useFastTouch){
            //fastclick https://github.com/ftlabs/fastclick
            FastClick.attach(document.body);
        }

        //delete self's init method
        delete this.init;
        //init all modules
        for(var c in XO){
            XO[c].init&&XO[c].init.call(XO[c],this.opts);
            delete XO[c].init;
        };

        //旋屏
        window.addEventListener(XO.EVENT.Sys.viewChange, this.hideAddressBar);

        this.hideAddressBar();
        
        //插件初始化
        XO.plugin.applyToElement(XO.$body);

        //hashchange
        XO.history.start();
        //XO.history.start({pushState:true});
        
        //default page and view
        var page = this.opts.defaultPage;
        if(!window.location.hash.substring(1)){
            XO.Router.instance.navigate(page, {trigger: true, replace: true});
        }

        XO.support.touch && window.addEventListener('touchstart', function(){
            XO.App.hideAddressBar();
        }, true);

    };
});
