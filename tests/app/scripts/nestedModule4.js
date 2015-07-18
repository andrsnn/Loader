define(['jquery','Loader'],function($,Loader){
	var nestedModule4 = function(){
		var loader = new Loader();
		var nest5 = loader.require("nestedModule5");
		var self = this;

		return loader.export(self,function(){
			this.something = 'x';
		});
		
	}
	return new nestedModule4();
	


	//where returnedModule = return
	

});