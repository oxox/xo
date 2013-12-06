XO('Controller',function($,C){
    this.define = function(pageId,options){
        XO.Controller[pageId]=$.extend({
            id:pageId,
            Index:function(param){
                XO.warn('XO.Controller.Index was invoked!');
            },
            viewId:function(vid){
                return XO.View.getId(pageId,vid);
            }
        },options||{});
    };
});