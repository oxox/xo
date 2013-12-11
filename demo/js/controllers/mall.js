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
        var page = XO.plugin.get('pager-1');
        page.bind('loaded', function(){
             $.get('demo/html/pages/mall/loaded_1.html', function(tpl){
                var html = XO.toHtml(tpl, {});
                page.append(html);
            });
        })
    }

});