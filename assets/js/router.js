/**
 * router
 * @author levinhuang
 * @requires 依赖的js文件
 */
;(function($,B){

    //routes
    var Router = B.Router.extend({
        routes: {
            ':page': 'iViewPage',
            ':page/:param': 'iViewPage',
            "*actions": "defaultRoute"
        },
        initialize:function(){
            this.on({
                "route":this.iOnRouting,
                "route:defaultRoute":this.iOnDefaultRoute
            });
            // Handling clicks on links, except those with link
            // TODO: falst click
            $(document).on("click", "a:not([data-notrouter])", function (evt) {
                var href = $(this).attr("href"),
                    protocol = this.protocol + "//";
                    App.router.iLinkClicked = true;
                if (href && href.slice(0, protocol.length) !== protocol && href.indexOf("javascript") !== 0) {
                    evt.preventDefault();
                    App.router.iIsGoback = this.getAttribute('data-back');
                    href = App.router.iIsGoback||href;
                    Backbone.history.navigate(href, true);
                    return;
                }
            }).on('click','button',function(evt){
                App.router.iLinkClicked = true;
                App.router.iIsGoback = this.getAttribute('data-back');
                if(!App.router.iIsGoback) return;
                Backbone.history.navigate(App.router.iIsGoback, true);
            });
        },
        iViewPage: function(pageId, param){
            var eff = (!this.iLinkClicked)?'none':(this.iIsGoback?'right':null);
            App.main.showView(pageId,param,eff);
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
    App.router = new Router();

})(Zepto,Backbone);