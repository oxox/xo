XO.Controller.define('mall',{

    index:function(param){
        
        XO.View.get(param.pid,param.vid,function(err,view){
            
            if(err){
                XO.warn('controller.mall.Index:'+err);
                return;
            }

            XO.Event.on(view,XO.EVENT.Animate.End,function(e,d){
                XO.Controller.mall.onAnimated(view);
            });

            //TODO:load remote data
            var data = {};
            if(!view.isRendered){
                view.render(data);
                view.animate({animation:'fade'});
            }else{
                view.animate(param);
            }
            
            XO.warn('controller.mall.Index',view);



        });

    },
    onAnimated:function(view){
        //滑动加载更多
        /*var page2 = XO.plugin.get('pager-2');
        page2.bind('loaded', function(){
            this.trigger('beforeloaded');
            $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page2.trigger('afterloaded');
                    page2.append(html);
                },1000)
                
            });
        });

        //滑动加载更多
        var page3 = XO.plugin.get('pager-3');
        page3.bind('loaded', function(){
            this.trigger('beforeloaded');
            $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page3.trigger('afterloaded');
                    page3.append(html);
                },1000);
            });
        });

        //滑动加载更多
        var page1 = XO.plugin.get('pager-1');
        page1.bind('loaded', function(dataset){
            this.trigger('beforeloaded');
             $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page1.trigger('afterloaded');
                    page1.append(html);
                },1000);
            });
        });
        var menu = XO.plugin.get('menu-top');
        var swiper = XO.plugin.get('swiper');

        //滑动触发加载模板
        swiper.bind('active', function(dataset){
            activePage = XO.plugin.get(dataset['id']);
            var idx = menu.get_idx();
            if(dataset['to'] == 1){
                menu.trigger('swapRight');
            }
            if(dataset['to'] == -1){
                menu.trigger('swapLeft');
            }
            XO.View.uiLoader.show();
            $.get('demo/html/pages/mall/page.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    activePage.refresh(html);
                    XO.View.uiLoader.hide();
                },1000);
            });                 
        });

        //点击导航加载数据
        menu.$el.bind('active', function(e, dataset){
            swiper.active_page(dataset['idx'], function(dataset){
                activePage = XO.plugin.get(dataset['id']);
                //activePage.trigger('beforePageLoad');
                XO.View.uiLoader.show();
                $.get('demo/html/pages/mall/page.html', function(tpl){
                    var html = XO.toHtml(tpl, {});
                    setTimeout(function(){
                        activePage.refresh(html);
                        //activePage.trigger('afterPageLoad');
                        XO.View.uiLoader.hide();
                    },1000);
                });
            });
        })*/
        //console.dir(view);
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