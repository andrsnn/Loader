define(function(require){
	
	var Loader = function(){
		this.dependencies = {};
		Loader.prototype.require = function(arr, callback){
			var self = this;


			
			/*
			(function (){
				
				if (typeof self.dependencies[name] !== "undefined"){
					
					return;
				}
				require([path], function(ret){
				//console.log(ret.constructor.name);
				self.dependencies[name] = ret;
				
				
				//self.dependencies[]
				
				});
			})();
			*/
			
		}
	}

	return new Loader();
});