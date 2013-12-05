XO('Animate',function($,C){
    //ref:https://github.com/senchalabs/jQTouch/blob/master/src/jqtouch.js
    this.animations: { // highest to lowest priority
        'cubeleft':{name:'cubeleft', is3d: true},
        'cuberight':{name:'cuberight', is3d: true},
        'dissolve':{name:'dissolve'},
        'fade':{name:'fade'},
        'flipleft':{name:'flipleft',is3d: true},
        'flipright':{name:'flipright'is3d: true},
        'pop':{name:'pop', is3d: true},
        'swapleft':{name:'swapleft', is3d: true},
        'swapright':{name:'swapright', is3d: true},
        'slidedown':{name:'slidedown'},
        'slideright':{name:'slideright'},
        'slideup':{name:'slideup'},
        'slideleft':{name:'slideleft'},
        'none':{name:'none'}
    };

    this.add = function(aniObj){
        this.animations[aniObj.name]=aniObj;
    };

    this.get = function(name){
        return this.animations[name];
    };

    this.run = function($el,aniName,inOrOut,extClass){
        aniName = aniName || C.DEFAULT.ANIMATION;
        inOrOut = inOrOut||C.CLASS.ANIMATION_IN;
        extClass = extClass||C.CLASS.ACTIVE;
        if(aniName===C.DEFAULT.ANIMATION){
            $el.addClass(extClass);
            return;
        }
        $el.addClass([aniName,inOrOut,extClass].join(' '));
    };
});