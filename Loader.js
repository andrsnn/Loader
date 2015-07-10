define(function(require){
	var Loader = function(){
		this.dependencies = {};
		Loader.prototype.load = function(name){
			require(name, function(){
				debugger;
			});
		}
	}

	return new Loader();
});