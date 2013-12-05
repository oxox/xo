/**
 * view1
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("view2",{
	tplId:"tplView2",
	titleId:'J_hd2',
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
