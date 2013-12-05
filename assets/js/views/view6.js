/**
 * view6
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("view6",{
	tplId:"tplView6",
	titleId:'J_hd6',
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

		this.scroll = new IScroll('#J_bd6_scroll',{
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 200,
			keyBindings: true,
			indicators: {
				el: document.getElementById('carouselDots6'),
				resize: false
			}
		});

		/* This code prevents users from dragging the page */
		document.getElementById('J_bd6_scroll').addEventListener('touchmove', function(e){
			e.preventDefault();
		}, false);

	}
});
