XO('Controller',function($,C){
    this.define = function(pageId,options){
        XO.Controller[pageId]=$.extend({
            id:pageId,
            Index:function(param){
                XO.warn('XO.Controller.Index was invoked!');
            }
        },options||{});
    };
});