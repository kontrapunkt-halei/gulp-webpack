'use strict';

require('foundation');

// var compLoadFoundation = function(){};
// compLoadFoundation.prototype.log = function(){
//     // cache Dom
//     var $el = document.documentElement;
//
//     function init(){
//       $(document).foundation();
//       this.$el.setAttribute('data-useragent', navigator.userAgent);
//       console.log('load foundation')
//     }
//
//     return {
//       init: init
//     };
// }
// module.exports = new compLoadFoundation();

module.exports = {
    init: function(){
      this._cacheDom();
      this._render();
    },
    _cacheDom: function(){
      this.$el = document.documentElement;
    },
    _render: function(){
      $(document).foundation();
      this.$el.setAttribute('data-useragent', navigator.userAgent);
      console.log('load foundation')
    }
};

// var app = (function() {
// 	var docElem = document.documentElement,
// 		_userAgentInit = function() {
// 			docElem.setAttribute('data-useragent', navigator.userAgent);
// 		},
// 		_init = function() {
// 			$(document).foundation();
// 			_userAgentInit();
// 		};
// 	return {
// 		init: _init
// 	};
// })();
//
// (function(){
//   app.init();
// })();
