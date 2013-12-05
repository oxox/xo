/**
 * header view
 * @author levinhuang
 * @requires backbone/zepto
 */
App.View("header",{
	el:document.getElementById('J_header'),
	initialize:function(){
		var me = this;
		me.$titles = me.$el.find(".ui_title");
	},
	showTitle:function(id){
		this.$titles.hide().filter("#"+id).show();
	}
});

App["header"] = App.Views["header"];