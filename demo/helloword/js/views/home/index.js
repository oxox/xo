XO.View.define({
    pid:'home',
    vid:'index',
    version:'20131209',
    init:function(){
        XO.warn('View inited:'+this.id);
    },
    //模板已经渲染到页面中
    onRender:function(){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onRender',this);
        /* This code prevents users from dragging the page */
        document.getElementById('J_bd1_scroll').addEventListener('touchmove', function(e){
            e.preventDefault();
        }, false);
    },
    //动画进行中
    onAnimating:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimating',eventData);
    },
    //动画结束
    onAnimated:function(eventData){
        XO.warn(XO.View.getId(this.pid,this.vid)+':View onAnimated',eventData);
        if(!this.scroll){
            this.scroll = new IScroll('#J_bd1_scroll',{
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapSpeed: 200,
                keyBindings: true,
                indicators: {
                    el: document.getElementById('carouselDots'),
                    resize: false
                }
            });
        }
    }
});