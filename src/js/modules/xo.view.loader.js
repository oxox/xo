XO.View.define({
    pid:'common',
    vid:'loader',
    alias:'uiLoader',
    dir:null,//dir为null说明为页面中已经存在的视图
    isLoading:false,
    show:function(){
        if(this.isLoading)
            return;
        this.isLoading = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
    },
    hide:function(){
        this.$el.addClass(XO.CONST.CLASS.HIDE).removeClass(XO.CONST.CLASS.ACTIVE);
        this.isLoading = false;
    }
});