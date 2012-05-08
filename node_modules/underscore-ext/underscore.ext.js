//
//
//

_.extend(_, {
  
  log: function () {
    if (window.console) {
      window.console.log(Array.prototype.slice.call(arguments));
    }
  },
  
  isMobileBrowser: function () {
    return navigator.appVersion.toLowerCase().search("mobile") > -1
  },
  
});
