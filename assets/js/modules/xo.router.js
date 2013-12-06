XO('Router',function($,C){

    this.init = function(opts){
        var customRoutes = opts.routes||{
            'page/:page': 'showPage',
            'page/:page/:view':'showPage',
            'page/:page/:view/:data': 'showPage',
            'page/:page/section/:section':'showSection',
            'page/:page/section/:section/:param':'showSection',
            'page/:page/aside/:aside':'showAside',
            'page/:page/aside/:aside/:param':'showAside',
            'page/:page/popup/:popup':'showPopup',
            'page/:page/popup/:popup/:param':'showPopup',
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
                $(document).on("click", "a:not([data-notrouter])", function (evt) {
                    var href = $(this).attr("href"),
                        protocol = this.protocol + "//";
                        XO.Router.instance.linkClicked = true;
                    if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript") !== 0) {
                        evt.preventDefault();
                        XO.Router.instance.isGoback = this.getAttribute('data-back');
                        href = XO.Router.instance.isGoback||href;
                        XO.history.navigate(href, true);
                        return;
                    }
                }).on('click','button',function(evt){
                    XO.Router.instance.linkClicked = true;
                    XO.Router.instance.isGoback = this.getAttribute('data-back');
                    if(!XO.Router.instance.isGoback) return;
                    XO.history.navigate(XO.Router.instance.isGoback, true);
                });
            },
            showPage: function(pageId,viewId,param){
                viewId = viewId||'index';
                param= JSON.parse(param||'{}');
                var aniName = (!this.linkClicked)?C.DEFAULT.TRANSITION:null,
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
                XO.Controller[pageId][viewId](viewObj);
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
            isGoback:false,
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