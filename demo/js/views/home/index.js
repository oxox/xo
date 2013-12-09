XO.View.define({
    pid:'home',
    vid:'index',
    version:'20131209',
    init:function(){
        XO.warn('View inited:'+this.id);
        var me = this;
        XO.Event.on(this,XO.EVENT.View.Inited,function(e){
            me.onRender();
        });
    },
    onRender:function(){
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

        /* This code prevents users from dragging the page */
        document.getElementById('J_bd1_scroll').addEventListener('touchmove', function(e){
            e.preventDefault();
        }, false);
    }
});