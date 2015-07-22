define(['jquery','loader'],function($,Loader){
	var loader = new Loader();

	loader.require("/test/testSubModules/nestedModule2.js");

	return loader.export(function(nestedModule2){
		return function module3(){

			this.nest = new nestedModule2();
			
		}
	});
	

});