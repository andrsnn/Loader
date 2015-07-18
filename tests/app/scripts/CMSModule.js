(function (root, factory) {
    
    if (typeof window.CMSLoader !== "undefined" &&
        window.CMSLoader == true){
        define(function(){
            return factory;
        });
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['nestedModule2'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (nestedModule2) {
    
    return {
        nested: nestedModule2
    };
}));