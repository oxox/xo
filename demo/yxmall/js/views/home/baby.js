XO.View.define({
    pid:'home',
    vid:'baby',
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
        if(!this.swipPager){
            this.$el.swipePager({
                onPrev:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goPrev().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                },
                onNext:function(){
                    var $item = $.NavSlide.cache['J_navslide'].goNext().getCurrentItem().find('a');
                    XO.history.navigate($item[0].getAttribute('href').replace('#',''),true);
                }
            });
            this.swipePager = true;
        }
    }
});