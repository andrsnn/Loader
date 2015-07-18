define([
    'Loader','require'
], function (Loader,require) {
    window.CMSLoader = true;
    
    var loader = new Loader();

    loader.load("CMSModule").with(["./nestedModule2"]);

    loader.go(function(CMSModule){
        debugger;
    });
    

    /*
    Backbone.history.start();
    var loader = new Loader();
    loader.get("nestedModule1").done(function(nested1){
        console.log(nested1);
    });
*/




});