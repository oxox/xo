XO.Controller.define('about',{

    index:function(param){
        
        XO.View.get(param.pid,param.vid,function(err,view){
            
            if(err){
                XO.warn('controller.about.Index:'+err);
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
            XO.warn('controller.about.Index',view);
        });


    }

});