require.config({
  baseUrl: '../',
  paths: {
    'jquery'        : 'app/bower_components/jquery/dist/jquery',
    'underscore'    : 'app/bower_components/underscore/underscore',
    'backbone'      : 'app/bower_components/backbone/backbone',
    'mocha'         : 'app/bower_components/mocha/mocha',
    'chai'          : 'app/bower_components/chai/chai',
    'chai-jquery'   : 'app/bower_components/chai-jquery/chai-jquery',
    'should':'app/bower_components/should/should',
    'loader':'Loader'
  },
  shim: {
    'chai-jquery': ['jquery', 'chai']
  }
  
});

define(['chai','jquery','mocha','require'],function(Chai,$,Mocha,require) {
  
  
  
  
  
  
  //place tests here

  // Chai
  /*
  var should = chai.should();
  chai.use(chaiJquery);
  */

  mocha.setup('bdd');

  

  /*
  //test call format
  require([
    'specs/model-tests.js',
  ], function(require) {
    mocha.run();
  });
  */

  require(['mainTest.js'],function(require){
    mocha.run();
  });
});