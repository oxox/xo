/**
 * view1
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("view1",{
	tplId:"tplView1",
	titleId:'J_hd1',
	el:null,
	scroll:null,
	
	onPreAnimate:function(){
		App.header.showTitle(this.titleId);
	},

	onAnimated:function(){
		

		this.render();
		this.delegateEvents(this.delayEvents);

	},
	onHide:function(){
		//Todo: destory the iscroll
		console.log("view1.onHide");
		//this.remove();
	},
	delayEvents:{
		'click a':'onNavigate'
	},
	onNavigate:function(){
		//TODO:封装
		/*
		var viewId = this.getAttribute("href") || this.getAttribute("data-href");
		viewId = viewId.replace("#","");
		if(viewId.length>0){
			App.main.to(viewId,'left');
		}
		*/
		console.log('onNavigate.view1',this);
	},
	render:function(){
		if(this.isRendered) return;
		App.main.addView(this.tplHtml);
		this.el = document.getElementById(this.id);
		this.$el = $(this.el).show();
		this.isRendered = true;
		
		this.scroll = new IScroll('#J_bd1_scroll',{
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 200,
			keyBindings: true,
			indicators: {
				el: document.getElementById('carouselDots'),
				resize: false
			}
		});

		/* This code prevents users from dragging the page */
		document.getElementById('J_bd1_scroll').addEventListener('touchmove', function(e){
			e.preventDefault();
		}, false);
	}
});
