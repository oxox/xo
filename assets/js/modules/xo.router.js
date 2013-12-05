XO('Router',function($,C){

    this.init = function(opts){
        var customRoutes = opts.routes||{
            ':page': 'iViewPage',
            ':page/:param': 'iViewPage',
            "*actions": "defaultRoute"
        };

        //routes
        var Router = XO.BaseRouter.extend({
            routes: customRoutes,
            initialize:function(){
                this.on({
                    "route":this.iOnRouting,
                    "route:defaultRoute":this.iOnDefaultRoute
                });
                // Handling clicks on links, except those with link
                // remove strings to xo.constants.js
                $(document).on("click", "a:not([data-notrouter])", function (evt) {
                    var href = $(this).attr("href"),
                        protocol = this.protocol + "//";
                        XO.Router.instance.iLinkClicked = true;
                    if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript") !== 0) {
                        evt.preventDefault();
                        XO.Router.instance.iIsGoback = this.getAttribute('data-back');
                        href = XO.Router.instance.iIsGoback||href;
                        XO.history.navigate(href, true);
                        return;
                    }
                }).on('click','button',function(evt){
                    XO.Router.instance.iLinkClicked = true;
                    XO.Router.instance.iIsGoback = this.getAttribute('data-back');
                    if(!XO.Router.instance.iIsGoback) return;
                    XO.history.navigate(XO.Router.instance.iIsGoback, true);
                });
            },
            iViewPage: function(pageId, param){
                var aniName = (!this.iLinkClicked)?C.DEFAULT.TRANSITION:null,
                    viewObj = {
                        id:pageId,
                        ani:aniName,
                        isBack:this.iIsGoback,
                        src:null
                    };
                param = JSON.parse(param||'{}');
                $.extend(viewObj,param);
                XO.View.show(viewObj);
                this.iIsGoback = false;
                this.iLinkClicked = false;
            },
            iIsGoback:false,
            iOnRouting:function(actions,param){
                console.log('iOnRouting',actions,param);
            },
            iOnDefaultRoute:function(actions){
                console.log("Intercepted call of default router: " + actions);
            }
            
        });

        this.instance = new Router();

    };
});