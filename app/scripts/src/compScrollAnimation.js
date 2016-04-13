require('scrollMonitor');

module.exports = function(){
  var scrollEl 
    _scrollInit = function(){
      console.log('load scroll animation');
      elementWatcher.enterViewport(function(){
        console.log( 'I have entered the viewport' );
      });
      elementWatcher.exitViewport(function(){
        console.log( 'I have entered the viewport' );
      })
    };
  return{
    init: _scrollInit
  };
}
