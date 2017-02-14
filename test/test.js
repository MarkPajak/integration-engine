var assert = require('assert');



describe('my feature', function() {
  it('works', function() {
    assert.equal('A', 'A');
  });

  it('fails gracefully', function() {
    assert.throws(function() {
      throw 'Error!';
    });
  });
});

describe('my other fe;ature', function() {
  it('async', function(done) {
    setTimeout(function() {
      done();
    }, 25);
  });
});

