XO.Controller.define('home',{

    index:function(param){
        
        XO.View.get(param.pid,param.vid,function(err,view){
            
            if(err){
                XO.warn('controller.home.Index:'+err);
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

            XO.warn('controller.home.Index',view);
        });
    },
    page1:function(param){
        XO.View.get(param.pid,param.vid,function(err,view){
            if(err){
                XO.warn('controller.home.page1:'+err);
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

            XO.warn('controller.home.page1',view);
        });
    },
    page2:function(param){
        XO.View.get(param.pid,param.vid,function(err,view){
            if(err){
                XO.warn('controller.home.page2:'+err);
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

            XO.warn('controller.home.page2',view);
        });
    },
    page3:function(param){

        XO.View.get(param.pid,param.vid,function(err,view){

            if(err){
                XO.warn('controller.home.page3:'+err);
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

            XO.warn('controller.home.page3',view);
        });
    },
    page4:function(param){

        XO.View.get(param.pid,param.vid,function(err,view){

            if(err){
                XO.warn('controller.home.page4:'+err);
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

            XO.warn('controller.home.page4',view);
        });
    },
    page5:function(param){

        XO.View.get(param.pid,param.vid,function(err,view){

            if(err){
                XO.warn('controller.home.page5:'+err);
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

            XO.warn('controller.home.page5',view);
        });
    }

});