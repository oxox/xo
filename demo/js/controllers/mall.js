XO.Controller.define('mall',{

    index:function(param){
        
        XO.View.get(param.pid,param.vid,function(err,view){
            
            if(err){
                XO.warn('controller.mall.Index:'+err);
                return;
            }

            XO.Event.on(view,XO.EVENT.Animate.End,function(e,d){
                XO.Controller.mall.onAnimated();
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
    onAnimated:function(){
        var page2 = XO.plugin.get('pager-2');
        page2.bind('loaded', function(){
             $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page2.$el.trigger('afterloaded');
                    page2.append(html);
                },1000)
                
            });
        });
        var page3 = XO.plugin.get('pager-3');
        page3.bind('loaded', function(){
             $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page3.$el.trigger('afterloaded');
                    page3.append(html);
                },1000);
            });
        });

        var page1 = XO.plugin.get('pager-1');
        page1.bind('loaded', function(){
             $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                setTimeout(function(){
                    page1.$el.trigger('afterloaded');
                    page1.append(html);
                },1000);
            });
        });
        var menu = XO.plugin.get('menu-top');
        var swiper = XO.plugin.get('swiper');
        swiper.$el.bind('active', function(e, dataset){
            activePage = XO.plugin.get(dataset['id']);
            var idx = menu.get_idx();
            if(dataset['to'] == 1){
                menu.$el.trigger('swapRight');
            }
            if(dataset['to'] == -1){
                menu.$el.trigger('swapLeft');
            }
        });

        menu.$el.bind('active', function(e, dataset){
            swiper.active_page(dataset['idx'], function($el){
                // get data render tpl
            });
        })
    }

});