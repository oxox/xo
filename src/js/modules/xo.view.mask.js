XO.View.define({
    pid:'common',
    vid:'mask',
    alias:'uiMask',
    dir:null,//dir为null说明为页面中已经存在的视图
    excludeFromViewManager:true,
    isMasking:false,
    show:function(){
        if(this.isMasking)
            return;
        
        this.isMasking = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
    },
    hide:function(){
        this.$el.addClass(XO.CONST.CLASS.HIDE);
        this.isMasking = false;
    }
});
