XO('Event',function($){
    this.on= function(fullName,handler){
        if(arguments.length<=2){
            XO.$body.bind(fullName,handler);
            return;
        }
        $(arguments[0]).bind(arguments[1],arguments[2]);
    };
    this.trigger = function(fullName,args){
        if(arguments.length<=2){
            XO.$body.trigger(fullName,args);
            return;
        }
        $(arguments[0]).trigger(arguments[1],arguments[2]);
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