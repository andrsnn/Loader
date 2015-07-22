define(['jquery','loader'],function($,Loader){
	var loader = new Loader();

	loader.require("/test/testSubModules/nestedModule.js");

	return loader.export(function(nestedModule){
		return function module2(){

			this.nest = nestedModule;
			
		}
	});
	


	//where returnedModule = return
	

});