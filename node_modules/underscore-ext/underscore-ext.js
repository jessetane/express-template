//
//
//
//

_.mixin({
  
  log: function () {
    if (window.console) {
      window.console.log(Array.prototype.slice.call(arguments));
    }
  },
  
  isMobileBrowser: function () {
    return navigator.appVersion.toLowerCase().search("mobile") > -1
  },

  // returns the first object containing a given property with a matching value
  /*
  find : function(collection, attr, val) {
    return _.detect(collection, function (obj) {
      return obj[attr] == val;
    });
  },
  */

  // deep copies an object using jQuery's extend
  copy: function(obj) {
    return $.extend(true, {}, obj);
  },

  // inserts a string into another string at a given index and returns a copy
  insert: function(str, strToInsert, index) {
    return str.substr(0,index) + strToInsert + str.substr(index);
  },

  // dist formula
  distance: function (point1, point2) {
    var xs = point2.x - point1.x;
    var ys = point2.y - point1.y;
    return Math.sqrt(xs*xs + ys*ys);
  },
  
});
