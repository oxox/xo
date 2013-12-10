/**
 * Controller factory
 */
XO('Controller',function($,C){
    /**
     * define and register a controller
     * @param {String} pageId page id(controller id)
     * @param {Object} opts controller action dictionary
     */
    this.define = function(pageId,opts){

        XO.Controller[pageId]=$.extend(XO.Controller[pageId]||{},{
            id:pageId,
            viewId:function(vid){
                return XO.View.getId(pageId,vid);
            },
            /**
             * Render a view by viewid
             * @param {String} vid iew id
             * @param {Object} opts1 config object
             *         opts1.onRender callback function
             *         opts1.data data provider for the view
             */
            renderView:function(vid,opts1){
                this.renderExternalView(this.id,vid,opts1);
            },
            /**
             * Render a view by pageid and viewid,and render the view with specified data
             * @param {String} pid page id
             * @param {String} vid view id
             * @param {Object} opts1 config object
             *         opts1.onRender callback function
             *         opts1.data data provider for the view
             */
            renderExternalView:function(pid,vid,opts1){
                opts1 = $.extend({
                    onRender:function(err,view){},
                    data:{},
                    dataPointer:null,//internal pointer for the data object
                    hardRefresh:false,
                    param:null
                },opts1||{});

                var actionName = XO.Controller.getFullActionName(pid,vid),
                    me = this,
                    cbk = opts1.onRender,
                    data = opts1.data,
                    dataIsFunction = $.isFunction(data);

                XO.View.get(pid,vid,function(err,view){
                    if(err){
                        XO.warn(actionName+err);
                        cbk(actionName+err);
                        return;
                    }
                    XO.warn(actionName,view);

                    if(view.isRendered&&!opts1.hardRefresh){
                        view.animate(opts1.param);
                        cbk(null,view);
                        return;
                    }
                    if(!dataIsFunction){
                        view.render(data);
                        view.animate( (view.isRendered?{animation:'none'}:opts1.param) );
                        cbk(null,view);
                        return;
                    }

                    data.call(opts1.dataPointer,opts1.param,function(err1,jsonData){
                        if(err1){
                            cbk(actionName+err1);
                            return;
                        }
                        view.render(jsonData);
                        view.animate( {animation:'none'});
                        cbk(null,view);
                    });

                });
            }
        },opts||{});
    };

    this.getFullActionName = function(pid,vid,suffix){
        return ( 'Controller.'+pid+'.'+vid+(suffix||':') );
    };
    /**
     * 为指定视图定义对应控制器（Controller）的默认行为（action）
     * 注：这个方法会在ox.view.js里面_init方法中使用，目的是自动为视图生成一个控制器和对应的action
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Function} fnAction action
     */
    this.defineDefaultAction = function(pid,vid,fnAction){
        var action = {};
        action[XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid] = fnAction || XO.App.opts.defaultControllerAction || (function(param){
            this.renderView(vid,{
                param:param,
                data:function(params,cbk){
                    var jsonData = {hi:1};
                    cbk(null,jsonData);
                }
            });
        });
        this.define(pid,action);
    };
    /**
     * 调用指定action
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Object} param parameters
     */
    this.invoke = function(pid,vid,param){
        //获取用户定义的action，如果没有则使用默认的action。参考defineDefaultAction
        var action = XO.Controller[pid][vid]||XO.Controller[pid][XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid];
        action.call(XO.Controller[pid],param);
    };

});