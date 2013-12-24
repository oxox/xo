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
    },
    pluginData:{
        'swiper':{
            'menuId' : 'menu-top',
            'tpl_url' : 'html/home/guang.html'
        },
        'menu-top':{
            'swiperId' : 'swiper'
        },
        'pager-1': {
            'tpl_url' : 'html/home/loaded_1.html',
            'data_url' : {}
        },
        'pager-2': {
            'tpl_url' : 'html/home/loaded_1.html',
            'data_url' : {}
        },
        'pager-3': {
            'tpl_url' : 'html/home/guang.html',
            'data_url' : {}
        }
    }
});