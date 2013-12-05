/**
 * loading view
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("loading",{
	el:document.getElementById('ui_loading'),
	initialize:function(){},
	hide:function(){
		this.remove();
		delete App.Views["loading"];
	}

});