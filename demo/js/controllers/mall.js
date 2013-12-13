XO.Controller.define('mall',{

    index:function(param){
        
        this.renderView('index',{
            param:param,
            onRender:function(err,view){
                XO.Event.on(view,XO.EVENT.Animate.End,function(e,d){
                    //XO.Controller.mall.onAnimated(view);
                });
            },
            data:function(params,cbk){
                //TODO:load remote data
                var jsonData = {hi:1};
                cbk(null,jsonData);
            }
        });

    },
    onAnimated:function(view){

        var plugin_page_1 = {
            'tpl_url' : 'demo/html/pages/mall/loaded_1.html',
            'data_url' : {}
        }
        var plugin_page_2 = {
            'tpl_url' : 'demo/html/pages/mall/loaded_1.html',
            'data_url' : {}
        }
        var plugin_page_3 = {
            'tpl_url' : 'demo/html/pages/mall/loaded_1.html',
            'data_url' : {}
        }
        var plugin_swiper = {
            'menuId' : 'menu-top',
            'tpl_url' : 'demo/html/pages/mall/page.html'
        }
        var plugin_menu = {
            'swiperId' : 'swiper'
        }
        XO.plugin.bootup(view, {
            'pager-1': plugin_page_1,
            'pager-2': plugin_page_2,
            'pager-3': plugin_page_3,
            'swiper': plugin_swiper,
            'menu-top': plugin_menu

        });
    }

});