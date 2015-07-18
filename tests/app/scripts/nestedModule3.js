define(['jquery','Loader'],function($,Loader){
	var nested3 = function(){
		this.nestedPromise = true;
		this.nested3 = null;
	}
	return new nested3();
});