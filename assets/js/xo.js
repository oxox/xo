(function($,T,B){
    //module define function
    window['XO'] = function(id,fn){
        if(XO[id]){
            console.warn('Module with id ['+id+'] exists!');
            return;
        };
        var mod = {id:id};
        //event interface for mod
        this.EVENT[id]={};
        //inherit utils features
        $.extend(mod,_utils);
        //construct the module
        fn.call(mod,$,XO.CONST);
        this[id] = mod;
        mod = null;
    };
    //extensions
    $.extend(XO,{
        version:'1.0.0',
        author:'http://oxox.io',
        $body:$(body),
        $win:$(window),
        EVENT:{},
        LS:localStorage,
        toHtml:function(tpl,obj,ext){
            tpl = T.compile(tpl);
            return (tpl.render(obj,ext));
        },
        baseRouter:B.Router,
        history:B.history,
        baseView:B.View
    });

    //EVENT UTILS
    var _utils = {
        exposeEvent : function(name){
            if($.isArray(name)){
                for(var i=0,j=name.length;i<j;i++){
                    XO.EVENT[this.id][name[i]]='on'+this.id+name[i]+'.XO';;
                }
                return;
            };
            XO.EVENT[this.id][name]='on'+this.id+name+'.XO';
        },
        disposeEvent : function(name){
            XO.$body.off(XO.EVENT[this.id][name]);
        },
        disposeAllEvents : function(){
            var evts = XO.EVENT[this.id];
            for(var c in evts){
                this.disposeEvent(c);
            };
        },
        getLSKey:function(privateKey){
            return (['XO',this.id,privateKey].join('.'));
        }
    };

})(Zepto,Hogan,Backbone);
