XO('Router',function($,C){

    this.defaultRouteIndex = 1000;

    this.init = function(opts){
        var customRoutes = opts.routes||{
            ':page': 'showPage',
            ':page/:view':'showPage',
            ':page/:view/:data': 'showPage',
            ':page/section/:section':'showSection',
            ':page/section/:section/:param':'showSection',
            ':page/aside/:aside':'showAside',
            ':page/aside/:aside/:param':'showAside',
            ':page/popup/:popup':'showPopup',
            ':page/popup/:popup/:param':'showPopup',
            "*actions": "defaultRoute"
        };

        //routes
        var Router = XO.baseRouter.extend({
            routes: customRoutes,
            initialize:function(){
                this.on({
                    "route":this.onRoute,
                    "route:defaultRoute":this.onDefaultRoute
                });
                // Handling clicks on links, except those with link
                // remove strings to xo.constants.js
                // data-ridx 可以用来控制多个链接之间的跳转顺序，从而控制动画是向前还是向后
                XO.$doc.on("click", "a:not([data-notrouter])", function (evt) {
                    var href = $(this).attr("href"),
                        protocol = this.protocol + "//",
                        rIdx0 = XO.Router.instance.rIndex,
                        rIdx = null,
                        isBack = false;
                        XO.Router.instance.linkClicked = true;
                        XO.Router.instance.isGoback = false;
                    if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript") !== 0) {
                        evt.preventDefault();

                        if(XO.Animate.isAnimating()) return;

                        rIdx = this.getAttribute('data-ridx');
                        rIdx = rIdx ? (parseInt(rIdx)||0): XO.Router.defaultRouteIndex;
                        isBack = this.getAttribute('data-back');

                        if (!isBack && rIdx<rIdx0) {
                            isBack = href;
                        };

                        href = isBack||href;
                        XO.Router.instance.isGoback = isBack;
                        XO.Router.instance.rIndex = rIdx;
                        XO.history.navigate(href, true);
                        return;
                    }
                    //reset route index
                    XO.Router.instance.rIndex = XO.Router.defaultRouteIndex;
                }).on('click','button',function(evt){
                    XO.Router.instance.linkClicked = true;
                    XO.Router.instance.isGoback = this.getAttribute('data-back');
                    if(!XO.Router.instance.isGoback) return;
                    evt.preventDefault();
                    if(XO.Animate.isAnimating()) return;
                    XO.history.navigate(XO.Router.instance.isGoback, true);
                });
            },
            showPage: function(pageId,viewId,param){
                
                if(pageId.indexOf('notrouter')===0){
                    return;    
                }

                viewId = viewId||'index';
                param= JSON.parse(param||'{}');
                var aniName = (!this.linkClicked)?C.DEFAULT.ANIMATION_NONE:null,
                    viewObj = {
                        pid:pageId,
                        vid:viewId,
                        animation:aniName,
                        back:this.isGoback,
                        dir:XO.App.opts.viewDir,
                        type:C.ACTION.PAGE,
                        cssHost:C.SELECTOR.PAGE_WRAPPER
                    };
                viewObj.params = param;
                XO.Controller.invoke(pageId,viewId,viewObj);
                this.isGoback = false;
                this.linkClicked = false;
            },
            showSection:function(pageId,secId,param){
                console.log('showSection',{pid:pageId,secId:secId,param:param});
            },
            showAside:function(pageId,asId,param){
                console.log('showAside',{pid:pageId,asId:asId,param:param});
            },
            showPopup:function(pageId,popId,param){
                console.log('showPopup',{pid:pageId,popId:popId,param:param});
            },
            isGoback:false,         //whether is back route
            rIndex:-1,              //route index
            onRoute:function(actions,param){
                console.log('onRoute',actions,param);
            },
            onDefaultRoute:function(actions){
                console.log("Intercepted call of default router: " + actions);
            }
            
        });

        this.instance = new Router();

    };
});
