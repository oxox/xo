XO('Event',function($){
    this.on= function(fullName,handler){
        XO.$body.on(fullName,handler);
    };
    this.trigger = function(fullName,args){
        XO.$body.trigger(fullName,args);
    };

    this.init = function(){
        //SYSTEM EVENTS
        XO.EVENT['Sys'] ={
            viewChange: 'onorientationchange' in window ? 'orientationchange' : 'resize',
            fingerDown: XO.support.touch ? 'touchstart' : 'mousedown',
            fingerMove: XO.support.touch ? 'touchmove' : 'mousemove',
            fingerUp: XO.support.touch ? 'touchend' : 'mouseup'
        };
    };

});