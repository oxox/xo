/**
 * 用户自定义的控制器：HomeController
 * 注：基于COC（惯例优于配置的原则，在定义视图的时候会生成一个该视图的默认Action），
 * 所以如果用户没有写自定义控制器(controllers/home.js)，XO框架会自动使用默认Action来获取模板，渲染模板。
 * 对于不涉及数据逻辑的视图，完全可以不定义对应的Action
 */
XO.Controller.define('home',{

    index:function(param){

        this.renderView('index',{
            param:param,
            onRender:function(err,view){
                
            },
            data:function(params,cbk){
                //TODO:load remote data
                var jsonData = {hi:1};
                cbk(null,jsonData);
            }
        });

        //TODO:先切换上一个View再获取下一个View
        //上一个View移出，=>获取下一个View
        //                      1，下一个View已存在，直接移入
        //                      2，下一个View不存在 =》 显示loading，获取该View =》直接显示

    },
    baby:function(param){

        this.renderView('baby',{
            param:param,
            data:{staticData:true}
        });
    }

});