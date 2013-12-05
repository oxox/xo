;(function($, B, W){
    var app = {}, 
        doc = W.document, 
        $html = $(doc.documentElement), 
        $body = $(doc.body),
        local = window.localStorage.setItem;

    app.info = {};

    //浏览器类型
    $.os.desktop = !($.os.ios || $.os.android || $.os.blackberry || $.os.opera || $.os.fennec);

    //事件
    app.hasTouch = 'ontouchstart' in W;
    app.evtName = {
        viewChange: 'onorientationchange' in W ? 'orientationchange' : 'resize',
        fingerDown: app.hasTouch ? 'touchstart' : 'mousedown',
        fingerMove: app.hasTouch ? 'touchmove' : 'mousemove',
        fingerUp: app.hasTouch ? 'touchend' : 'mouseup'
    };
    app.event = {
        viewChange: function(callback){
            W.addEventListener(app.evtName.viewChange, callback);
        }
    };

    //隐藏地址栏
    app.hideAddressBar = function(){
        W.scrollTo(0,0);
    };

    //手势
    var Gesture = function(){};
    Gesture.prototype = {};

    //初始化APP
    app.init = function(cf, callBack){

        App.Views["loading"].hide();

        var def = {
            title: '',
            cacheNum: 3
        }

        $.extend(def, cf||{});

        //fastclick https://github.com/ftlabs/fastclick
        FastClick.attach(document.body);
        //reset
        //$html.height(window.innerHeight + 1000);


        //if(!$.os.ios){ $html.css('overflow', 'hidden'); }
        app.info.title = def.title;

        //旋屏
        app.event.viewChange(app.hideAddressBar);

        $.isFunction(callBack) && callBack(Zepto, B, W, app);

        app.hideAddressBar();
        

        //hashchange
        B.history.start();
        //B.history.start({pushState:true});
        
        !window.location.hash.substring(1) && App.main.to("view1", 'none', true);

        app.hasTouch && window.addEventListener('touchstart', function(){
            app.hideAddressBar();
        }, true);

        delete app.init;

    };

    app.Views={};
    
    app.View = function(name,opts){
        
        if(opts.tplId){
            var tempNode = document.getElementById(opts.tplId);
            opts.tplHtml = tempNode.innerHTML;
            //TODO:cache
            $(tempNode).remove();
        }


        W._tempView = B.View.extend(opts||{});
        W.App.Views[name] = new W._tempView;
        W.App.Views[name].id = opts.id||name;
        W.App.Views[name].isRendered=false;
        delete W._tempView;


    };

    W.App = app;
})(Zepto, Backbone, window);