//Base View Module
XO('View',function($,C){
    this.exposeEvent([
        'Init',
        'InitFromRemote',
        'Inited',
        'InitedTemplate',
        'InitedTemplateError'
    ]);
    this.caches={};

    this.defaultActions = {
        initialize:function(){
            this.isRendered = typeof(this.dir)==='undefined';
            this.isRemote = (!this.isRendered && this.dir.indexOf(C.DEFAULT.TEMPLATE_SUFFIX)!==-1);
            this.$host = $(this.cssHost);
            XO.Event.trigger(XO.EVENT.View.Init);
            if(this.isRendered){
                this.initFromDom();
                return;
            }
        },
        initFromDom:function(){
            this.el = document.getElementById(this.id);
            this.$el = $(this.el);
            this.animation = this.animation||(this.el.getAttribute[C.ATTR.ANIMATION]||XO.App.opts.defaultAnimation);
            XO.Event.trigger(XO.EVENT.View.Inited);
        },
        initFromSrc:function(cbk){
            XO.Event.trigger(XO.EVENT.View.InitFromRemote);
            //load from local storage
            var lsKey = XO.Page.getLSKey(this.id),
                lsObj = XO.LS[lsKey],
                me = this;

            // local inline template
            if(!this.isRemote){
                this.tpl = document.getElementById(this.dir);
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[this]);
                cbk&&cbk(null,this);
                return;
            };
            // remote template
            this.src = this.dir+this.pid+'/'+this.id+'.html';
            // check localstorage firstly
            if(lsObj&&(lsObj = JSON.parse(lsObj))&&lsObj.src===this.src){
                this.tpl = lsObj.tpl;
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[this]);
                cbk&&cbk(null,this);
                return;
            };
            //load from remote url
            $.ajax({
                url:src,
                cache:false
            }).done(function(data, status, xhr){
                me.tpl = data;
                //save to LS
                XO.LS[lsKey] = JSON.stringify({
                    tpl:data,
                    src:me.src
                });
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[me]);
                cbk&&cbk(null,me);
            }).fail(function(xhr, errorType, error){
                XO.Event.trigger(XO.EVENT.View.InitedTemplateError,[me]);
                cbk&&cbk(errorType+error.toString());
            });
        },
        //render a page with specified data
        render:function(data){
            
            var html = XO.toHtml(this.tpl,data);
            this.$host.append(html);

            this.initFromDom();
        },
        animate:function(aniObj){
            if(!this.isRendered){
                XO.warn('animate view ['+this.id+'] error:Not Rendered!');
                return;
            }
            XO.Animate.run(this.$el,aniObj.animation||this.animation,aniObj.back);
        }
    };
    this.define = function(name,opts){
        opts = $.extend(opts||{},this.defaultActions);
        var tempView = XO.baseView.extend(opts);
        tempView.id = opts.id||name;
        this.caches[tempView.id] = tempView;
        return tempView;
    };
    this.get = function(viewObj,cbk){
        var view = this.caches[viewObj.id];
        
        if(!view){
            view = this.define(viewObj.id,viewObj);
            if(view.isRendered){
                cbk(null,view);
                return;
            }
            view.initFromSrc();
            return;
        }

        if(view.isRendered){
            cbk(null,view);
            return;
        }

        return this.caches[id];
    };
    //show a view 
    this.show = function(viewObj){
        var view = this.get(viewObj.id);
        if(!view){
            this.define(viewObj.id,viewObj);
            return;
        }
        view.animate(viewObj);
    };
    this.setCurView = function($view,pageId){
        if(pageId){
            this.caches[pageId].$curView = $view;
        }else{
            this.caches['$curView'] = $view;
        }
    };
    this.getCurView = function(pageId){
        if(pageId){
            return this.caches[pageId].$curView;
        }
        return this.caches.$curView;
    };
    //switch Pages or Sections
    this.switch = function($from, $to, aniName, goingBack,pageId) {

        goingBack = goingBack || false;

        if(!XO.Animate.switch($from,$to,aniName,goingBack)){
            return false;
        }

        XO.View.setCurView($to,pageId);

        return true;
    };//switch

    this.init = function(){
        this.dir = XO.$body[0].getAttribute('data-viewdir');
    };


});