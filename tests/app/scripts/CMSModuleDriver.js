define([
    'Loader'
], function (Loader) {
	var loader = new Loader();
	//populated from CMSDependencies file per module;
	var moduleName = "CMSModule";
	var modulePath = "CMSModule";
	var dependencies = [
		"backbone"
	];
	loader.require.apply(this,dependencies);

	return loader.export(modulePath);


});