XO.View.define({
    pid:'common',
    vid:'search',
    alias:'uiSearch',
    dir:null,//dir为null说明为页面中已经存在的视图
    isLoading:false,
    onRender:function(){
        $('#J_mod_nav_search').on('click',function(e){
            XO.View.uiSearch.toggle();
            return false;
        });
        this.$ipt = $('#J_mod_search_ipt').on('blur',function(e){
            XO.View.uiSearch.hide(function(){
                XO.history.navigate('search', true);
            });
        });
        $('#J_mod_search_bg').on('click',function(e){
            XO.View.uiSearch.hide();
        });
    },
    toggle:function(){
        if(this.isLoading){
            this.hide();
        }else{
            this.show();
        }
    },
    show:function(){
        if(this.isLoading)
            return;
        this.isLoading = true;
        this.$el.removeClass(XO.CONST.CLASS.HIDE);
        if(!this.$elbd){
            this.$elbd = this.$el.find('.mod_search_bd');
        }
        setTimeout(function(){
            XO.View.uiSearch.$elbd.addClass(XO.CONST.CLASS.UIACTIVE);
            $('#J_mod_search_ipt').focus();
        },0);
    },
    hide:function(cbk){
        this.$elbd.one('webkitTransitionEnd',function(e){
            XO.View.uiSearch.$el.addClass(XO.CONST.CLASS.HIDE);
            XO.View.uiSearch.isLoading = false;
            cbk&&cbk();
        }).removeClass(XO.CONST.CLASS.UIACTIVE);
        this.$ipt.val('');
    }
});