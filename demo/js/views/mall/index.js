XO.View.define({
    pid:'mall',
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
        
    }
});