define(function(require){
	var Loader = function(){
		this.dependencies = {};
		Loader.prototype.require = function(name){
			require([name], function(arg){
				debugger;
			});
		}
	}

	return new Loader();
});