define(['jquery','loader'],function($,Loader){
	var loader = new Loader();

	loader.require("/test/testSubModules/nestedModule3.js");

	return loader.export(function(nestedModule3){
		return function nestedModule2(){

			this.nest = nestedModule3;
			
		}
	});
	


	//where returnedModule = return
	

});