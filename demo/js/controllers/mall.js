XO.Controller.define('mall',{

    index:function(param){
        
        XO.View.get(param.pid,param.vid,function(err,view){
            
            if(err){
                XO.warn('controller.mall.Index:'+err);
                return;
            }
            //TODO:load remote data
            var data = {};
            if(!view.isRendered){
                view.render(data);
                view.animate({animation:'fade'});
            }else{
                view.animate(param);
            }
            var diyige = XO.plugin.get('diyige');
            XO.warn('controller.mall.Index',view);
        });


    }

});