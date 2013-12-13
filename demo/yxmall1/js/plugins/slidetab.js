(function($){

    $.fn.outerWidth = function(){
        var val = this.width();
        val+=parseFloat(this.css('margin-left').replace('px',''))||0;
        val+=parseFloat(this.css('margin-right').replace('px',''))||0;
        val+=parseFloat(this.css('padding-left').replace('px',''))||0;
        val+=parseFloat(this.css('padding-right').replace('px',''))||0;
        return val;
    };

    var slideTab =function($dom,opts){
        this.$dom = $dom;
        this.activeIdx = 0;
        this.opts = $.extend({
            clActive:'current',
            cssItem:'li',
            activeWidthAdjustment:0//激活菜单由于字体变大需要调整的宽度
        },opts||{});
        this.cache={};
        this._init();
    };
    slideTab.prototype = {
        _init:function(){
            var me = this,
                tempWidth=0;
            this.$items = this.$dom.find(this.opts.cssItem);
            this.cnt = this.$items.length;
            this.width=0;
            this.offsetLeft=0;
            this.offsetLeft0=parseInt(this.$dom.css('margin-left').replace('px',''));
            this.itemWidths=[];
            this.itemOffsetWidths=[];
            this.$items.each(function(i,o){
                tempWidth = $(o).outerWidth();
                me.itemWidths.push(tempWidth);
                me.itemOffsetWidths.push( (me.itemOffsetWidths[i-1]||0) + tempWidth );
                me.width+=tempWidth;
                o.setAttribute('data-idx',i);
            });
            tempWidth = Math.round(me.width);
            this.width = tempWidth<this.width?(tempWidth+1):tempWidth;
            this.width+=this.opts.activeWidthAdjustment;
            //set width
            this.$dom.css('width',this.width+'px');

            this._onResize(this.opts.initIdx);
            if(this.opts.initIdx>0){
                this.offsetLeft-this.itemOffsetWidths[this.opts.initIdx-1]+this.opts.activeWidthAdjustment;
            }

            $(window).on('orientationchange',function(e){
                me._onResize();
            }).on('resize',function(e){
                me._onResize();
            });

            this.$dom.on('click','li',function(e){
                me.go(parseInt(this.dataset['idx']));
            });
        },
        _onResize:function(idx){
            this.parentWidth = this.$dom.parent().width();
            this.go(idx||this.activeIdx);
        },
        getSlideDirection:function(idx){
            var val = {dir:0,offset:0},
                isToLeft = idx>this.activeIdx;

            if(idx==this.activeIdx){
                val.type=0;
                return val;
            };
            //向左滑动
            if(isToLeft){
                if( (this.offsetLeft+this.parentWidth) >= this.itemOffsetWidths[idx] ){
                    //已经滚到底，或者菜单还在可是区域
                    val.type=1;
                    return val;
                }
                val.dir=-1;
                if(idx==(this.cnt-1)){
                    val.offset = this.width -this.parentWidth - this.offsetLeft;
                    return val;
                }
                val.offset = this.itemOffsetWidths[idx]-this.parentWidth-this.offsetLeft;
                return val;
            }

            //向右滑动
            if( (this.itemOffsetWidths[idx] - this.offsetLeft ) > this.itemWidths[idx] ){
                val.type=1;
                return val;
            }
            val.dir=1;
            val.type=2;
            if(idx==0){
                val.offset = this.offsetLeft;
            }else{
                val.offset = this.offsetLeft-this.itemOffsetWidths[idx-1]+this.opts.activeWidthAdjustment;
                //val.offset = val.offset<0?0:val.offset;
            }
            return val;
        },
        go:function(idx){
            if(idx>=this.cnt) return;
            if(idx<0) return;
            var slideDir = this.getSlideDirection(idx);
            this.activeIdx = idx;
            switch(slideDir.dir){
                case -1:
                    //向左滑动
                    this.offsetLeft += slideDir.offset+this.offsetLeft0;
                    this.$dom.css('marginLeft',
                        (-this.offsetLeft)+'px'
                    );
                break;
                case 0:
                break;
                case 1:
                    this.offsetLeft-=slideDir.offset+this.offsetLeft0;
                    this.$dom.css('marginLeft',
                        (-this.offsetLeft)+'px'
                    );
                break;
            };//switch
            this.setActiveTab(idx);
        },
        setActiveTab:function(idx){
            this.$items.removeClass(this.opts.clActive).eq(idx).addClass(this.opts.clActive);
        },
        prev:function(){
            this.go(this.activeIdx-1);
        },
        next:function(){
            this.go(this.activeIdx+1);
        },
        getTabByAttr:function(attrName,attrVal){
            var val = null,me=this,cacheKey = attrName+'='+attrVal;
            if( (val=this.cache[cacheKey]) ){
                return val;
            }
            this.$items.each(function(i,o){
                if(o.getAttribute(attrName)===attrVal){
                    val = {idx:i,obj:o};
                    me.cache[cacheKey]=val;
                    return false;
                }
            });
            return val;
        },
        getPrevTab:function(){
            var val = null,
                idx = this.activeIdx-1;
            if(idx<0){
                return val;
            }
            val = {idx:idx,obj:this.$items.get(idx)};
            return val;
        },
        getNextTab:function(){
            var val = null,
                    idx = this.activeIdx+1;
            if(idx>=this.cnt){
                return val;
            }
            val = {idx:idx,obj:this.$items.get(idx)};
            return val;
        }
    };

    window['slideTab'] = slideTab;

    window['slideTab1'] = new slideTab($('[data-control="slideTab"]'),{initIdx:1});

})(Zepto);
