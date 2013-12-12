XO.Controller.define('about',{

    index:function(param){
        
        this.renderView('index',{
            param:param,
            data:{staticData:true}
        });

    }

});