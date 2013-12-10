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
    this.curViews={};

    this.defaultActions = {
        initialize:function(){
            this.isRendered = this.dir===null||typeof(this.dir)==='undefined';
            this.isRemote = (!this.isRendered && this.dir.indexOf(C.DEFAULT.TEMPLATE_SUFFIX)!==-1);
            this.$host = $(this.cssHost);
            XO.Event.trigger(XO.EVENT.View.Init,[this]);
            if(this.isRendered){
                this.initFromDom();
            }
        },
        initFromDom:function(){
            this.el = document.getElementById(this.id);
            this.$el = $(this.el);
            this.animation = this.animation||(this.el.getAttribute[C.ATTR.ANIMATION]||XO.App.opts.defaultAnimation);
            XO.Event.trigger(this,XO.EVENT.View.Inited,[this]);
            this.onRender&&this.onRender.call(this);
            //初始化插件
            var self = this;
            setTimeout(function(){
                XO.plugin.applyToView(self);
            },0)
            
        },
        initFromSrc:function(cbk){
            XO.Event.trigger(XO.EVENT.View.InitFromRemote,[this]);
            //load from local storage
            var lsKey = XO.View.getLSKey(this.id),
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
            this.src = this.dir+this.pid+'/'+this.vid+'.html';
            // check localstorage firstly
            if(lsObj&&(lsObj = JSON.parse(lsObj))&&lsObj.src===this.src&&lsObj.version===this.version&&!XO.App.opts.debug){
                this.tpl = lsObj.tpl;
                XO.Event.trigger(XO.EVENT.View.InitedTemplate,[this]);
                cbk&&cbk(null,this);
                return;
            };
            //load from remote url
            $.ajax({
                url:this.src,
                cache:false,
                success:function(data,status,xhr){
                    me.tpl = data;
                    //save to LS
                    XO.LS[lsKey] = JSON.stringify({
                        tpl:data,
                        src:me.src,
                        version:me.version
                    });
                    XO.Event.trigger(XO.EVENT.View.InitedTemplate,[me]);
                    cbk&&cbk(null,me);
                },
                error:function(xhr,errorType,error){
                    XO.Event.trigger(XO.EVENT.View.InitedTemplateError,[me]);
                    cbk&&cbk(errorType+error.toString());
                }
            });
        },
        //render a page with specified data
        render:function(data){
            
            var html = XO.toHtml(this.tpl,data);
            this.$host.prepend(html);
            this.isRendered = true;
            this.initFromDom();
        },
        animate:function(aniObj){
            if(!this.isRendered){
                XO.warn('animate view ['+this.id+'] error:Not Rendered!');
                return;
            }

            aniObj = aniObj||{};

            //TODO:如何view的类型是section，则为页面内的切换，获取当前view时要加上pageId
            var curView = XO.View.getCurView(/*this.pid*/),
                animation = aniObj.animation||this.animation;
            if(!curView || curView.id===this.id){//无前一个View或者前一个View和当前View是同一个
                XO.Animate.run(this,animation,aniObj.direction,aniObj.back);
                XO.View.setCurView(this,this.pid);
                return;
            }

            XO.View.switch(curView,this,animation,aniObj.back,this.pid);
            
        }
    };
    /**
     * 定义视图
     * @example
     *     XO.View.define({pid:'pageId','vid':'viewId'});
     */
    this.define = function(opts,initAtOnce){
        opts = opts || {};
        //check pid&vid
        if( (!opts.pid) || (!opts.vid) ){
            XO.warn('Parameters require! pid and vid required!');
            return false;
        }

        this.curViews[opts.pid] = this.curViews[opts.pid] ||{};
        opts.cssHost = opts.cssHost||C.SELECTOR.DEFAULT_CSS_HOST;
        opts.id = this.getId(opts.pid,opts.vid);
        opts = $.extend(opts,this.defaultActions);
        opts.isInited = false;
        this.caches[opts.id] = opts;

        if(initAtOnce){
            return this._init(opts);
        }
    };

    this._init = function(viewOpts){
        if(XO.App&&XO.App.opts){
            viewOpts.dir = viewOpts.dir===null?null:XO.App.opts.viewDir;
        }
        var tempView = XO.baseView.extend(viewOpts);
        tempView.id = viewOpts.id;
        tempView = new tempView();
        if(tempView.init){
            tempView.init.call(tempView);
            delete tempView.init;
        };
        tempView.isInited = true;
        this.caches[tempView.id] = tempView;
        if(tempView.alias){
            (!this[tempView.alias]) && (this[tempView.alias]=tempView);
        }

        //generate default action
        XO.Controller.defineDefaultAction(tempView.pid,tempView.vid);

        return tempView;
    };

    /**
     * 获取用户自定义的视图
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Function} cbk callback
     */
    this.get = function(pid,vid,cbk){
        var id = this.getId(pid,vid),
            view = this.caches[id];
        
        if(!view){
            cbk(XO.warn('View with id ['+id+'] not found!'));
            return;
        }

        if(view.isRendered){
            cbk(null,view);
            return;
        }
        XO.View.uiLoader.show();
        view.initFromSrc(function(err,view1){
            XO.View.uiLoader.hide();
            cbk(err,view1);
        });
    };
    /**
     * 生成视图的ID
     */
    this.getId = function(pid,vid){
        return [C.DEFAULT.VIEW_ID_PREFIX,pid,vid].join('-');
    };
    this.setCurView = function(view,pageId){
        if(pageId){
            this.curViews[pageId].curView = view;
        };
        this.curViews['curView'] = view;
    };
    this.getCurView = function(pageId){
        if(pageId){
            return this.curViews[pageId].curView;
        }
        return this.curViews.curView;
    };
    //switch Pages or Sections
    this.switch = function(from, to, aniName, goingBack,pageId) {

        goingBack = goingBack || false;

        if(!XO.Animate.switch(from,to,aniName,goingBack)){
            return false;
        }

        XO.View.setCurView(to,pageId);

        return true;
    };//switch

    this.init = function(){
        //初始化所有未初始化的视图
        for(var v in this.caches){
            if(this.caches[v].isInited) {
                continue;
            };
            this._init(this.caches[v]);
        };
    };

});