define(['jquery', 'require','underscore'],function($, require, _){

	var AsyncLoader = function(type) {
	    this.type = type;

	    var requireFileNames = [];
	    var requireDfdList = [];
	    var currContext = null;

	    var fileNamesToLoad = [];
	    var uniqueDeps = {};

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
	    			debugger;
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
		    					dfd.resolve(exp);
		    				}
		    			});
	    			})();
	    			
	    		}


	    		for (var i = 0; i < requireDfdList.length; i++) {
	    			debugger;
	    			var obj = requireDfdList[i].resolve(all[i]);
	    			obj = all[i];
	    		}
	    		if (typeof exp === "string"){
	    			var last = all.splice(all.length-1,1);
	    			dfd.resolve(last);
	    			last.apply(last,all);
	    		}
	    		else {
	    			dfd.resolve(exp);	
	    		}
	    		
	    	});
	    	return dfd.promise();
	    }

	    AsyncLoader.prototype.run = function(func){

	    	var dfd = $.Deferred();
	    	debugger;
	    	require(requireFileNames, function(){
	    		var all = Array.prototype.slice.call(arguments);

	    		var nestedPromises = [];
	    		
	    		
	    		for (var i = 0; i < all.length; i++) {
	    			//if there is a sub promise
	    			debugger;
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
	    	var args = Array.prototype.slice.call(arguments);

	    	var argsIndex = 0;
	    	for (var i = fileNamesToLoad.length - args.length; i < args.length; i++) {
	    		
	    		fileNamesToLoad[i].deps = args[argsIndex];

	    		//push each dependency onto unquie object (remove duplicates)
	    		for (var j = 0; j < args[argsIndex].length; j++) {
	    			uniqueDeps[args[argsIndex][j]] = args[argsIndex][j];
	    			
	    		}

	    	}



	    	return this;
	    }

	    AsyncLoader.prototype.go = function(cb){
	    	var dfd = $.Deferred();

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
	    		var dependencies = resolvedModules.splice(fileNamesToLoad.length-1,resolvedModules.length-1);

	    		//dependencies.length should equal length of uniqueDeps

	    		Object.keys(uniqueDeps).forEach(function(elem,index){
	    			uniqueDeps[elem] = dependencies[index];
	    			
	    		});
	    		
	    		for (var i = 0; i < fileNamesToLoad.length; i++) {
	    			for (var j = 0; j < fileNamesToLoad[i].deps.length; j++) {
	    				
	    				fileNamesToLoad[i].deps[j] = uniqueDeps[fileNamesToLoad[i].deps[j]];
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
	    	
	    	

	    	return dfd.promise();
	    }

	    //only handles 1 level of tested promises
	    //mmake recursive?
	    AsyncLoader.prototype.get = function(){
	    	
	    	var fileNames = Array.prototype.slice.call(arguments);
		        var dfd = $.Deferred();
		        var path;
		        if (typeof this.type === "undefined"){
		        	path = "";
		        }
		        else {
		        	path = this.type;
		        	//path = this.type + "/";
		        }
		        
		 
		        fileNames = _.map(fileNames, function(fileName){
		            return path + fileName;
		        });
		 	
		        require(fileNames, function() {
		        	
		        	
		        	var x = Array.prototype.slice.call(arguments);
		        	var allNestedPromises = [];
		        	debugger;
		        	x.forEach(function(elem,index){
		        		var nestedBool = 
		        			(typeof elem === "object" &&
		        			typeof elem.nestedPromise !== "undefined" &&
		        			elem.nestedPromise == true)
		        			 ? true : false;

		        		//if there is a nested promise do a DFS of the object
		        		if (nestedBool){
		        			(function DFS(obj){

		        				for (var key in obj){
		        					if (obj.hasOwnProperty(key)){
		        						//if property is a promise
		        						if (
		        							typeof obj[key].then !== "undefined" &&
		        							typeof obj[key].then === "function"
		        						){
		        							allNestedPromises.push(obj[key]);
		        						}
		        						else if(typeof obj[key] === "object"){
		        							//recurse
		        							DFS(obj[key]);
		        						}
		        					}
		        				}
		        				return;
		        			})(elem);
		        			$.when(allNestedPromises,function(result){

		        			});
		        		}

		        	});
		        	/*
		        	var nestedPromise = [];
		        	for (var i = 0; i < x.length; i++) {

		        		if (typeof x[i] !== "undefined" &&
		        			typeof x[i].then === "function"){
		        			
		        			nestedPromise.push(x[i]);
		        		}
		        	}
		        	if (nestedPromise.length > 0){
		        		
		        		$.when.apply(this, nestedPromise).done(function(){
		        			
		        			var y = Array.prototype.slice.call(arguments);
		        			for (var i = 0; i < y.length; i++) {
		        				x[x.indexOf(nestedPromise[i])] = y[i];
		        				
		        			}
		        			
							
		        			dfd.resolve.apply(dfd, x.concat(y));
		        		});
		        	}
		        	else {
		        		
		        		dfd.resolve.apply(dfd, arguments);	
		        	}
		        	
		            */
		        });
		 		
		        return dfd.promise();
	    }
	}
	return AsyncLoader;
});


