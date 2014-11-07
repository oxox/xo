XO('ViewManager', function($,C){

	var views = {},
        size = 0,
        liveViews = {},
        liveSize = 0,
        liveViewIds = [];

    this.push = function(view){
        
        if(view.excludeFromViewManager) return;
        
        var cache = views[view.id],
            tempViewIds = [];
        if(!cache){
            size++;
        }
        
        views[view.id] = view;
        
        cache = liveViews[view.id];
        if(!cache){
            liveSize++;
            liveViews[view.id] = view;
            liveViewIds.push(view.id);
        }else{
            for(var i=0;i<liveSize;i++){
                if(liveViewIds[i]!==view.id){
                    tempViewIds.push(liveViewIds[i]);    
                }    
            };    
            tempViewIds.push(view.id);
            liveViewIds = tempViewIds;
        }

        var idToBeDestroyed = liveSize > XO.App.opts.maxViewSizeInDom ? liveViewIds.shift():null;
        if( idToBeDestroyed ){
            views[idToBeDestroyed].destroy();
            delete liveViews[idToBeDestroyed];
            liveSize --;

        };

    };

    this.size = function(isLive){
        return (isLive ? liveSize:size);
    };
    

});
