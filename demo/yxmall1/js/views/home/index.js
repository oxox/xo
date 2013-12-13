XO.View.define({
    pid:'home',
    vid:'index',
    version:'20131212',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);

        var plugin_page_1 = {
            'tpl_url' : 'demo/html/pages/mall/loaded_1.html',
            'data_url' : {}
        }
        var plugin_page_2 = {
            'tpl_url' : 'demo/html/pages/mall/loaded_1.html',
            'data_url' : {}
        }
        var plugin_page_3 = {
            'tpl_url' : 'demo/html/pages/mall/guang.html',
            'data_url' : {}
        }
        var plugin_swiper = {
            'menuId' : 'menu-top',
            'tpl_url' : 'html/pages/home/guang.html'
        }
        var plugin_menu = {
            'swiperId' : 'swiper'
        }
        XO.plugin.bootup(this, {
            'pager-1': plugin_page_1,
            'pager-2': plugin_page_2,
            'pager-3': plugin_page_3,
            'swiper': plugin_swiper,
            'menu-top': plugin_menu

        });

    }
});