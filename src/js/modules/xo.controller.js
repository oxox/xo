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

                //TODO:finish the switchTo function
                XO.View.switchTo(pid,vid,opts1.param,function(err,view,onGetViewData){
                    if(err){
                        cbk(actionName+err);
                        return;
                    }
                    if(!dataIsFunction){
                        onGetViewData(null,data);
                        cbk(null,view);
                        return;
                    }
                    data.call(opts1.dataPointer,opts1.param,function(err1,jsonData){
                        onGetViewData(err1,jsonData);
                        cbk(err1,view);
                    });

                },opts1.hardRefresh);
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
        var actions = {},
            actionId = XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid,
            action = null;

        //是否已经定义过
        if( XO.Controller[pid] && ( action = XO.Controller[pid][actionId] ) ){
            return action;
        }

        action = fnAction || XO.App.opts.defaultControllerAction || (function(param){
            this.renderView(vid,{
                param:param,
                data:function(params,cbk){
                    var jsonData = {hi:1};
                    cbk(null,jsonData);
                }
            });
        });
        actions[actionId] = action;
        this.define(pid,actions);
        return action;
    };
    /**
     * 调用指定action
     * @param {String} pid page id
     * @param {String} vid view id
     * @param {Object} param parameters
     */
    this.invoke = function(pid,vid,param){
        //获取用户定义的action，如果没有则使用默认的action。参考defineDefaultAction
        var controller = XO.Controller[pid],
            action =controller?(controller[vid]||controller[XO.CONST.DEFAULT.DEFAULT_ACTION_PREFIX+vid]):null,
            now = new Date(),
            todayStr = now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate()+"";
        
        ////如果用户没有写controller的js，也没有写view的js，则自动生成controller和view，使用默认action显示静态模板。适用于纯静态app
        if( !action && XO.App.opts.autoControllerAndView ){
            //TODO:这里是否有优化空间
            XO.View.autoView({
                pid:pid,
                vid:vid,
                version:(param&&param.version)||todayStr
            });
            action = this.defineDefaultAction(pid,vid);
        }

        action.call(XO.Controller[pid],param);
    };

});
