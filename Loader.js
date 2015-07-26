define(['jquery', 'require','underscore'],function($, require, _){
	//static mapping of modules to filenames
	var staticMap = {};

	var AsyncLoader = function(options) {
		var dependencyName = "dependencies.json";
		var dependencyProperty = null;

		if (typeof options !== "undefined"){
			dependencyName = options.dependencyName || dependencyName;
	    	//below might not work
	    	
	    	dependencyProperty = options.dependencyProperty || dependencyProperty;	

		}
	    

	    var requireFileNames = [];
	    var requireDfdList = [];
	    var currContext = null;

	    var fileNamesToLoad = [];
	    var uniqueDeps = {};

	    var currDfd = null;

	    var fileNameModel = function(fileName){
	    	this.fileName = fileName;
	    	this.deps = [];
	    }


	    AsyncLoader.prototype.require = function(){
	    	var deps = Array.prototype.slice.call(arguments);
	    	
	    	var dfd = $.Deferred();

	    	deps.forEach(function(elem){
	    		requireFileNames.push(elem);
	    		requireDfdList.push(dfd);
	    	});
	    	
	    	return dfd.promise();
	    }

	    AsyncLoader.prototype.export = function(exp){
	    	
	    	if (typeof exp === "string"){
	    		requireFileNames.push(exp);
	    	}
	    	var dfd = $.Deferred();
	    	require(requireFileNames, function(){
	    		
	    		var all = Array.prototype.slice.call(arguments);


	    		var nestedPromises = [];
	    		
	    		
	    		for (var i = 0; i < all.length; i++) {
	    			//if there is a sub promise
	    			
	    			if (typeof all[i].then !== "undefined" &&
						typeof all[i].then === "function"){
	    				//all[i] = requireFileNames[i] = requireDfdList[i] = nestedPromise index
	    				nestedPromises.push({index: i, promise: all[i]});
	    				
	    			}
	    		}


	    		if (nestedPromises.length != 0){
	    			
	    			(function(){

	    				$.when.apply($,
	    				nestedPromises.map(function(elem){
	    					return elem.promise;
	    				})
		    			).done(function(){
		    				
		    				var returnedPromises = Array.prototype.slice.call(arguments);
		    				for (var i = 0; i < nestedPromises.length; i++) {
		    					all[nestedPromises[i].index] = returnedPromises[i];
		    				}
		    				for (var i = 0; i < requireDfdList.length; i++) {
		    					requireDfdList[i].resolve(all[i]);
		    				}
		    				if (typeof exp === "string"){
				    			var last = all.splice(all.length-1,1);
				    			dfd.resolve(last);
				    			last.apply(last,all);
				    		}
		    				else {
		    					var obj = exp.apply(exp,all);
	    						dfd.resolve(obj);
		    				}
		    			});
	    			})();
	    			
	    		}
	    		else {
	    			for (var i = 0; i < requireDfdList.length; i++) {
	    			
	    			var obj = requireDfdList[i].resolve(all[i]);
	    			obj = all[i];
		    		}
		    		if (typeof exp === "string"){
		    			var last = all.splice(all.length-1,1);
		    			dfd.resolve(last);
		    			last.apply(last,all);
		    		}
		    		else {
		    			var obj = exp.apply(exp,all);
		    			dfd.resolve(obj);
		    			
		    			
		    		}
	    		}


	    		
	    		
	    	});
	    	return dfd.promise();
	    }

	    AsyncLoader.prototype.run = function(func){

	    	var dfd = $.Deferred();
	    	
	    	require(requireFileNames, function(){

	    		var all = Array.prototype.slice.call(arguments);

	    		var nestedPromises = [];
	    		
	    		
	    		for (var i = 0; i < all.length; i++) {
	    			//if there is a sub promise
	    			
	    			if (typeof all[i].then !== "undefined" &&
						typeof all[i].then === "function"){
	    				//all[i] = requireFileNames[i] = requireDfdList[i] = nestedPromise index
	    				nestedPromises.push({index: i, promise: all[i]});
	    				
	    			}
	    		}


	    		if (nestedPromises.length != 0){
	    			
	    			(function(){
	    				$.when.apply($,
	    				nestedPromises.map(function(elem){
	    					return elem.promise;
	    				})
		    			).done(function(){
		    				
		    				var returnedPromises = Array.prototype.slice.call(arguments);
		    				for (var i = 0; i < nestedPromises.length; i++) {
		    					all[nestedPromises[i].index] = returnedPromises[i];
		    				}
		    				for (var i = 0; i < requireDfdList.length; i++) {
		    					requireDfdList[i].resolve(all[i]);
		    				}
		    				//dfd.resolve(func,all);
		    				dfd.resolve(func,all);

		    				func.apply(func,all);
		    			});
	    			})();
	    			
	    		}
	    		else {
	    			for (var i = 0; i < requireDfdList.length; i++) {
    					requireDfdList[i].resolve(all[i]);
    				}

    				dfd.resolve(func,all);

    				func.apply(func,all);

	    		}
	    		/*
	    		for (var i = 0; i < requireDfdList.length; i++) {
	    			requireDfdList[i].resolve(all[i]);
	    		}
	    		*/
	    		
	    		//dfd.resolve.apply(func,requireDfdList);
	    	});
	    	return dfd.promise();
	    }

	    AsyncLoader.prototype.load = function(){
	    	
	    	var args = Array.prototype.slice.call(arguments);

	    	for (var i = 0; i < args.length; i++) {
	    		fileNamesToLoad.push(new fileNameModel(args[i]));
	    	}

	    	
	    	return this;
	    }

	    //accepts array of 
	    AsyncLoader.prototype.with = function(){

	    	function pushArgs(args){
	    		
	    		var argsIndex = 0;

		    	for (var i = fileNamesToLoad.length - args.length; i < args.length; i++) {
		    		
		    		fileNamesToLoad[i].deps = args[argsIndex];

		    		//push each dependency onto unquie object (remove duplicates)
		    		for (var j = 0; j < args[argsIndex].length; j++) {
		    			uniqueDeps[args[argsIndex][j]] = args[argsIndex][j];
		    			
		    		}
		    		argsIndex++;

		    	}	
	    	}

	    	var args = Array.prototype.slice.call(arguments);
	    	
	    	if (args.length == 0){
	    		
	    		currDfd = $.Deferred();
	    		ori = currDfd;
	    		currDfd = currDfd.promise();

	    		//default to current path + dependencies.json

	    		var jsonReqs = [];
	    		for (var i = 0; i < fileNamesToLoad.length; i++) {
	    			var file = fileNamesToLoad[i];
	    			
	    			var path = file.fileName.substring(0,file.fileName.lastIndexOf('/')+1);
	    			path += dependencyName;
	    			
	    			
	    			jsonReqs.push($.getJSON(path));
	    			
	    			
	    		}
	    		
	    		$.when.apply($,jsonReqs)
	    			.done(function(data){
	    				var a = Array.prototype.slice.call(arguments);
	    				args = [];
	    				//check for sub array
	    				var temp = [];
	    				if (Object.prototype.toString.call(a[0]) === '[object Array]'){
	    					
	    					for (var i = 0; i < a.length; i++) {
	    						
	    						
	    						var toPush = a[i][0];
	    						temp.push(toPush);
	    					}
	    					data = temp;
	    				}
	    				else {
	    					var temp = [];
	    					temp.push(data);
	    					data = temp;
	    				}
	    				
	    				
	    				

	    				for (var i = 0; i < data.length; i++) {
	    					args.push([]);
	    					if (dependencyProperty != null){

		    					data[i] = data[i][dependencyProperty];
		    					if (typeof data === "undefined"){
		    						throw new Error("dependencyProperty argument incorrect, returning undefined on JSON object with sucessful Ajax");
		    					}
		    				}
	    					Object.keys(data[i]).forEach(function(key,value){
	    					
	    						args[i].push(data[i][key]);
	    					});
	    				}

	    				

	    				pushArgs(args);
	    				
	    				ori.resolve();
	    			})
	    			.fail(function(err){
	    				console.error("Your JSON file is likely bad, must use double quote for strings, or bad path.");
	    				console.error(err);

	    				
	    				ori.resolve();
	    			});	
	    		
	    		
	    	}
	    	else if (args.length > 0 && typeof args[0] === "string"){
	    		currDfd = $.Deferred();
	    		ori = currDfd;
	    		currDfd = currDfd.promise();
	    		var req = $.getJSON(args[0])
	    			.done(function(data){
	    				args = [[]];
	    				Object.keys(data).forEach(function(key,value){
	    					
	    					args[0].push(data[key]);
	    				});
	    				pushArgs(args);
	    				
	    				ori.resolve();
	    			})
	    			.fail(function(err){
	    				console.error("Your JSON file is likely bad, must use double quote for strings, or bad path.");
	    				console.error(err);

	    				
	    				ori.resolve();
	    			});
	    	}
	    	else {
	    		//check for nested dependencies.json or null (for default)
	    		var argNull = false;
	    		for (var i = 0; i < args.length; i++) {
	    			if (args[i] == null){
	    				argNull = true;
	    				break;
	    			}
	    		}
	    		if (argNull){
	    			
	    		}
	    		else {
	    			pushArgs(args);	
	    		}
	    		
	    	}

	    	



	    	return this;
	    }

	    AsyncLoader.prototype.go = function(cb){
	    	var dfd = $.Deferred();

	    	function goMain(){
		    		//fetch all dependencies and modules

		    	var commonDeps = Object.keys(uniqueDeps).map(function(key){
		    		
		    		return uniqueDeps[key];
		    	});

		    	var fileNames = fileNamesToLoad.map(function(elem){
		    		return elem.fileName;
		    	});

		    	var all = commonDeps.concat(fileNames);
		    	
		    	
		    	
		    	//each module should return a factory
		    	
	    		require(all, function(){

		    		var resolvedModules = Array.prototype.slice.call(arguments);
		    		
		    		var dependencies = resolvedModules.splice(0,(resolvedModules.length - fileNamesToLoad.length));

		    		//fileNamesToLoad.length-1
		    		
		    		//dependencies.length should equal length of uniqueDeps

		    		Object.keys(uniqueDeps).forEach(function(elem,index){
		    			uniqueDeps[elem] = dependencies[index];
		    			
		    		});
		    		
		    		for (var i = 0; i < fileNamesToLoad.length; i++) {
		    			for (var j = 0; j < fileNamesToLoad[i].deps.length; j++) {
		    				
		    				var currDep = fileNamesToLoad[i].deps;
		    				currDep[j] = uniqueDeps[currDep[j]];
		    			}
		    			
		    		}

		    		
		    		
		    		console.assert(resolvedModules.length == fileNamesToLoad.length, "fileNamesToLoad length is not equal to go() async require arguments");

		    		//for each resolved module apply necessary dependencies
		    		for (var i = 0; i < resolvedModules.length; i++) {
		    			if (typeof resolvedModules[i] === "undefined" ||
		    				typeof resolvedModules[i] !== "function"){
		    				throw new Error("Lazy Loaded module must provide a factory function that will be called by AsyncLoader");
		    			}
		    			//store returned object

		    			resolvedModules[i] = resolvedModules[i].apply(null,fileNamesToLoad[i].deps);
		    		}

		    		
		    		dfd.resolve.apply(null,resolvedModules);
		    		cb && cb.apply(cb,resolvedModules);


		    	});
	    	}

	    	if (currDfd != null){
	    		$.when(currDfd).done(function(){
	    			goMain();
	    		});
	    	}
	    	else {
	    		goMain();
	    	}

	    	
	    	
	    	

	    	return dfd.promise();
	    }

	    
	}
	return AsyncLoader;
});


