XO.View.define({
    pid:'common',
    vid:'logger',
    alias:'uiLogger',
    dir:null,//dir为null说明为页面中已经存在的视图
    init:function(){
        this.$bd = this.$el.find('.xo_logger_bd');
    },
    log:function(txt,key){
        key = key||'null';
        this.$bd.append(key+':<div class="xo_logger_txt">'+txt+'</div>');
        return this;
    },
    show:function(){
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
        return this;
    },
    hide:function(){
        this.$el.addClass(XO.CONST.CLASS.HIDE);
        return this;
    }
});