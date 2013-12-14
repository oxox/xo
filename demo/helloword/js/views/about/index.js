XO.View.define({
    pid:'about',
    vid:'index',
    version:'20131210',
    init:function(){
        XO.warn('View inited:'+this.id);
        var me = this;
    },
    onRender:function(){
        document.getElementById('J_version').innerHTML=XO.version;
    }
});