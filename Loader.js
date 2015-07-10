define(function(require){
	var Loader = function(){
		this.dependencies = {};
		Loader.prototype.require = function(name){
			require([name], function(){
				debugger;
			});
		}
	}

	return new Loader();
});