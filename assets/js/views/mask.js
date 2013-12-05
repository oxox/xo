/**
 * mask view
 * @author levinhuang
 * @requires 依赖的js文件
 */
App.View("mask",{
	el:$("#J_mask"),
	$bd:$("#J_mask_bd"),
	isMasking:false,
	show:function(){
		if(this.isMasking)
			return;
		
		this.unbind();
		this.$bd.hide();
		this.$el.show();
		this.isMasking = true;
	},
	hide:function(){
		this.$bd.show();
		this.$el.hide();
		this.isMasking = false;
	},
	slideIn:function(dir,cbk){
		if(this.isMasking)
			return;


		this.isMasking = true;
		this.callback=cbk;

		if(dir=='none'){
			this.show();
			this.onAnimated();
			return;
		};

		

		var aniEff = App.effect[dir];

		this.$el
			.css(aniEff.cur)
			.show()
			.css(aniEff.curIn);
	
		this.bind();
	},
	onAnimated:function(){
		this.hide();
		this.callback && this.callback.call(null);
		this.isMasking = false;
		delete this.callback;
	},
	unbind:function(){
		this.$el.off("webkitTransitionEnd");
	},
	bind:function(){
		this.$el.one("webkitTransitionEnd",function(){
			App.mask.onAnimated();
		});
	}
});

App["mask"] = App.Views["mask"];
