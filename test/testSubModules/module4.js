(function(root,factory){
    define(function(){
        return factory;
    });
})(this,function($,Backbone,outOfContextModule1,outOfContextModule2){

    return {
        jquery: $,
        Backbone: Backbone,
        mod1: outOfContextModule1,
        mod2: outOfContextModule2
    };
});