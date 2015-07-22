define(['require'],function(require){
	var nestedModule = function(){
		this.property = "nestedModule";
	}
	return new nestedModule();
});