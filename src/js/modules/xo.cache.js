XO('Resource', function($,C){

	var tpls = {}, datas = {};

	var storage = window.localStorage;

	var show = function(){
		for(var i=0; i < storage.length; i++){
		  console.log(storage.key(i)+ " : " + storage.getItem(storage.key(i)));
		}
	}

	var setItem = function(key, dataset){
		if(typeof dataset == 'object') 
			dataset = JSON.stringify(dataset);
		storage.setItem(key, dataset);
	}

	var getItem = function(key){
		return storage.getItem(key);
	}

	var loadTpl = function(url){
		var tpl = tpls['tpl:' + url];
		if( tpl && '' != tpl ){
			tpl = getItem(tpl);
		}else{
			$.get(url, function(data){
				setItem(url, data);
			});
		}
		return tpl;
	}


	this.loadTemplateAndData = function(tpl_url, data_url, isCache){
		$.get(tpl_url)
	}

	this.load = function(urls, opts){
		
		return this;
	}

});