/**
 * view5 列表页
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("view5",{
	tplId:"tplView5",
	titleId:'J_hd5',
	el:null,
	scroll:null,
	onPreAnimate:function(){
		App.header.showTitle(this.titleId);
	},
	onAnimated:function(){

		this.render();
	},
	onHide:function(){
		//this.remove();
	},
	render:function(){
		if(this.isRendered) return;
		App.main.addView(this.tplHtml);
		this.el = document.getElementById(this.id);
		this.$el = $(this.el).show();
		this.isRendered = true;
	}
});
