/**
 * main view
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("main",{
    el:document.getElementById("J_main"),
    curView:null,
    preView:null,
    curEffect:null,
    effect:{
        left:{
            cur:{
                '-webkit-transform': 'translate3d(100%,0,0)'
            },
            prev:{
                '-webkit-transform': 'translate3d(0,0,0)'
            },
            curIn:{
                '-webkit-transform': 'translate3d(0,0,0)',
                '-webkit-transition': '-webkit-transform .25s ease'
            },
            prevOut:{
                '-webkit-transform': 'translate3d(-100%,0,0)',
                '-webkit-transition': '-webkit-transform .25s ease'
            }
        },
        right:{
            cur:{
                '-webkit-transform': 'translate3d(-100%,0,0)'
            },
            prev:{
                '-webkit-transform': 'translate3d(0,0,0)'
            },
            curIn:{
                '-webkit-transform': 'translate3d(0,0,0)',
                '-webkit-transition': '-webkit-transform .25s ease'
            },
            prevOut:{
                '-webkit-transform': 'translate3d(100%,0,0)',
                '-webkit-transition': '-webkit-transform .25s ease'
            }
        },
        none:{
            cur:{
                '-webkit-transform': 'translate3d(0,0,0)'
            },
            prev:{
                '-webkit-transform': 'translate3d(0,0,0)'
            },
            curIn:{},
            prevOut:{}
        }
    },
    isBusy:function(){
        return App.mask.isMasking;
    },
    initialize:function(){
    },
    events:{
        'click a':'onNavigate'
    },
    onNavigate:function(){
        console.log('onNavigate',this);
    },
    animate:function(from,to,effect,opts){
        var aniEnd = from && to ? 2 : 1,
            me = this;
            
        opts = opts || {curParam:''};
        effect = effect || 'none';

        var aniEff = this.effect[effect],
            cbkObj = {
                to:to,
                from:from,
                effect:effect
            },
            cbkParams = opts.curParam.split('/');


        cbkParams.push(cbkObj);

        //onPreAnimate callback
        if(to.onPreAnimate){
            to.onPreAnimate.apply(to,cbkParams);
        };

        var showContent = function(){
                me.curView = to;
                from && from.$el.hide().css('-webkit-transition', 'none');
                to.$el.css('-webkit-transition', 'none');
                //onAnimated callback
                to.onAnimated && to.onAnimated.apply(to,cbkParams);
                //onPrevAnimated callback
                from && from.onHide && from.onHide.apply(from,cbkParams);

                App.mask.hide();
            };

        if(to.isRendered){
            to.$el.show().css(aniEff.cur);
        }

        if(from){
            from.$el.css(aniEff.prev);
        }

        if(aniEnd > 1 && effect != 'none'){

            setTimeout(function(){

                if(to.isRendered){
                    to.$el.css(aniEff.curIn).one('webkitTransitionEnd', function(){
                        !--aniEnd && showContent();
                    });
                }else{
                    App.mask.slideIn(effect,function(){
                        !--aniEnd && showContent();
                    });
                }

                if(from){
                    from.$el.css(aniEff.prevOut).one('webkitTransitionEnd', function(){
                        !--aniEnd && showContent();
                    });
                }
            }, 0);
        }else{
            App.mask.show();
            showContent();
        }
        
    },//animate
    getView:function(id){
        //TODO:localstorage
        return App.Views[id];
    },
    addView:function(viewHtml){
        this.$el.append(viewHtml);
    },
    showView:function(viewId,param,_effect){
        var view = this.getView(viewId);
        if(!view) return;

        var me = this;
        me.preView= me.curView;
            

        if(!me.preView){
            me.animate(null,view,'none');
            return;
        };
        
        me.curEffect = _effect||(me.curEffect||'left');

        me.animate(me.preView, view, me.curEffect,{
            curParam:param||''
        });

        me.curEffect = null;

    },
    onViewChange:function(callback){
        App.router.on('route:viewPage', callback);
    },
    to:function(page, effect, replace){
        this.curEffect = effect;
        App.router.navigate(page, {trigger: true, replace: !!replace});
    },
    back:function(effect){
        this.curEffect = effect || 'right';
        var viewId = App.router.iHisManager.getPrevHash();
        console.log("App.main.back:"+viewId);
        if(viewId){
            this.to(viewId,this.curEffect);
        }else{
            this.to('view1','none');
        }
    }
});

App["main"] = App.Views["main"];
App["effect"] = App.main.effect;