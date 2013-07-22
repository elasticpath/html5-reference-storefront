// Include and setup all the stuff for testing
define(function(require) {
    window.$ = window.jQuery = require('jquery');
    window.chai  = require('chai');
    window.assert = chai.assert;
    window.expect = chai.expect;
    //window.should = chai.should();
    //window.sinonChai    = require('sinon-chai'); // Buggy as hell right now
    //window.jqueryChai   = require('chai-jquery');
    
    //chai.use(sinonChai);
    //chai.use(jqueryChai);
});