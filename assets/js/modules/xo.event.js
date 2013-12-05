XO('Event',function($){
    this.on= function(fullName,handler){
        XO.$body.on(fullName,handler);
    };
    this.trigger = function(fullName,args){
        XO.$body.trigger(fullName,args);
    };
});