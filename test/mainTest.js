define(function(require) {
 

 var $ = require('jquery');

var loader;
var should;

describe('AsyncLoader',function(){
	before(function(done){
		require(['should'],function(s){

			should = s;
			done();
		});
	});

	it('Should load its own AMD dependencies properly',function(done){
		loader = require('loader');
		
		done();
	});

	it('The require/run methods should call Lazy Load out of context modules',function(done){
		var load = new loader();
		
		load.require('/test/testSubModules/module1.js');
		load.run(function(sub){
			(typeof sub).should.be.exactly("function");
			done();
		});

		
	});

	it('The require/run methods should load modules written with the loader.export wrapper', function(done){
		var load = new loader();

		load.require('/test/testSubModules/module2.js');
		load.run(function(module2){
			(typeof module2).should.be.exactly("function");
			var x = new module2();
			x.should.have.property('nest').and.be.a.Object();
			x.nest.should.have.property('property').and.be.exactly("nestedModule");

			
			done();
		});
	});

	it('The require/run methods should load modules written with the loader.export wrapper and wait for nested lazy loading',function(done){
		var load = new loader();

		load.require('/test/testSubModules/module3.js');
		load.run(function(module3){
			(typeof module3).should.be.exactly("function");
			var x = new module3();
			
			x.should.have.property('nest').and.be.a.Object();
			x.nest.should.have.property('nest').and.be.a.Object();
			x.nest.nest.should.have.property('property').and.be.exactly("nestedModule3");
			
			done();
		});

	});

	//see module4 for define factory wrapper
	//load/with will currently NOT resolve sub modules promises/loading
	it('The load/go methods should pass module dependencies that are in and out of context to the define factory wrapper,and put the module in context',function(done){
		var load = new loader();

		load.load('/test/testSubModules/module4.js').with(['jquery','backbone','/test/testSubModules/outOfContextModule1.js','/test/testSubModules/outOfContextModule2.js']);
		load.go(function(module4){
			module4.should.have.property('Backbone').and.be.a.Object();
			module4.should.have.property('jquery').and.be.a.Function();
			module4.should.have.property('mod1').and.be.a.Object();
			module4.should.have.property('mod2').and.be.a.Object();
			module4.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module4.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			var mod4 = require('/test/testSubModules/module4.js');
			//puts the module4 wrapper into context
			mod4.should.be.a.Function();
			done();
		});
	});

	it('The load/go methods should load a comma delimited parameters of required modules, and should resolve circular dependencies',function(done){
		var load = new loader();
		load.load("/test/testSubModules/module4.js","/test/testSubModules/modulesWithDeps/module5.js").with(
			['jquery','backbone','/test/testSubModules/outOfContextModule1.js','/test/testSubModules/outOfContextModule2.js'],
			['jquery','backbone','/test/testSubModules/outOfContextModule1.js','/test/testSubModules/outOfContextModule2.js']
		);
		load.go(function(module4,module5){
			module4.should.have.property('Backbone').and.be.a.Object();
			module4.should.have.property('jquery').and.be.a.Function();
			module4.should.have.property('mod1').and.be.a.Object();
			module4.should.have.property('mod2').and.be.a.Object();
			module4.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module4.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");

			module5.should.have.property('Backbone').and.be.a.Object();
			module5.should.have.property('jquery').and.be.a.Function();
			module5.should.have.property('mod1').and.be.a.Object();
			module5.should.have.property('mod2').and.be.a.Object();
			module5.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module5.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			
			done();
		});
		
	});

	it('The load/go methods should load dependencies from public file when given a path in the with method',function(done){
		var load = new loader();

		load.load('/test/testSubModules/modulesWithDeps/module5.js').with('/test/testSubModules/modulesWithDeps/dependencies.json');
		load.go(function(module5){
			module5.should.have.property('Backbone').and.be.a.Object();
			module5.should.have.property('jquery').and.be.a.Function();
			module5.should.have.property('mod1').and.be.a.Object();
			module5.should.have.property('mod2').and.be.a.Object();
			module5.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module5.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			done();
		});



	});

	it('The load/go methods should default to attempting to loading dependencies from dependencies.json at each modules supplied directory, when no arguments are supplied to with',function(done){
		var load = new loader();
		load.load('/test/testSubModules/modulesWithDeps/module5.js').with();
		load.go(function(module5){
			module5.should.have.property('Backbone').and.be.a.Object();
			module5.should.have.property('jquery').and.be.a.Function();
			module5.should.have.property('mod1').and.be.a.Object();
			module5.should.have.property('mod2').and.be.a.Object();
			module5.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module5.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			done();
		});
	});



	it('The load/go methods should default load dependencies when no args are supplied to with, and should load the dependencyName provided in the options object',function(done){

		var load = new loader({
			dependencyName: "CMS.json",
			dependencyProperty: "dependencies"
		});

		load.load('/test/testSubModules/modulesWithDepCustom/module6.js').with();
		load.go(function(module6){
			module6.should.have.property('Backbone').and.be.a.Object();
			module6.should.have.property('jquery').and.be.a.Function();
			module6.should.have.property('mod1').and.be.a.Object();
			module6.should.have.property('mod2').and.be.a.Object();
			module6.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module6.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			
			done();
		});
		
	});

	it('The load/go methods should load mutiple modules given multiple dependency files per module',function(done){
		var load = new loader({
			dependencyName: "dependencies.json"
		});
		load.load("/test/testSubModules/modulesWithDeps2/module7.js","/test/testSubModules/modulesWithDeps/module5.js").with();
		load.go(function(module4,module5){
			
			module4.should.have.property('Backbone').and.be.a.Object();
			module4.should.have.property('jquery').and.be.a.Function();
			module4.should.have.property('mod1').and.be.a.Object();
			module4.should.have.property('mod2').and.be.a.Object();
			module4.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module4.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");

			module5.should.have.property('Backbone').and.be.a.Object();
			module5.should.have.property('jquery').and.be.a.Function();
			module5.should.have.property('mod1').and.be.a.Object();
			module5.should.have.property('mod2').and.be.a.Object();
			module5.mod1.should.have.property('context').and.be.exactly("outOfContextModule1");
			module5.mod2.should.have.property('context').and.be.exactly("outOfContextModule2");
			
			done();
		});

	});



});

});