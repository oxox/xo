XO('uiMask',function($,C){
    this.init = function(){
        XO.View.define(this.id,{
            id:'J_mask'
        });
    };
    this.isMasking = false;
    this.show =function(aniObj,onShowed){
        if(this.isMasking)
            return;
        
        this.isMasking = true;
        var view = XO.View.get(this.id);
        view.show(aniObj);
        view.$el.one(XO.EVENT.Animate.End,function(e){
            onShowed&&onShowed();
        });
    };
    this.hide=function(){
        var view = XO.View.get(this.id);
        view.$el.hide();
        this.isMasking = false;
    };
});