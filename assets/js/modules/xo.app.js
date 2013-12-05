XO('App',function($){
    this.init = function(opts){
        this.opts = $.extend({
            useAnimations:true,
            defaultAnimation:'none',
            trackScrollPositions:true
        },opts||{});
        delete this['init'];
        //init all modules
        for(var c in XO){
            XO[c].init&&XO[c].init.call(XO[c],this.opts);
            delete XO[c][init];
        };
    };
});