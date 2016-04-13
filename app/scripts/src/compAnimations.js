'use strict';
require('velocity');
require('velocityUi');

module.exports = function(myOpacity){
  console.log('load page animation');
  $('.callout').css('background-color', 'red');
  $('.callout').velocity({
    opacity:myOpacity
  });
};
