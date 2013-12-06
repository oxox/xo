XO.View.define({
    pid:'common',
    vid:'mask',
    alias:'uiMask',
    dir:null,//dir为null说明为页面中已经存在的视图
    isMasking:false,
    show:function(aniObj,onShowed){
        if(this.isMasking)
            return;
        
        this.isMasking = true;
        this.animate(aniObj||{});
        this.$el.one(XO.EVENT.Animate.End,function(e){
            onShowed&&onShowed();
        });
    },
    hide:function(){
        this.animate({animation:'fade',direction:XO.CONST.CLASS.ANIMATION_OUT,back:false});
        this.isMasking = false;
    }
});
