define(function(require){
	var Loader = function(){
		this.dependencies = {};
		Loader.prototype.require = function(name){
			var self = this;
			require([name], function(ret){
				self.dependencies[]
				debugger;
			});
		}
	}

	return new Loader();
});