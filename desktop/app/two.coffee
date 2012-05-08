#
#
#
#


module.exports = class extends Backbone.View
  
  el: $("body")
  template: require "views/two"
  
  initialize: =>
    @el = $ @el
    @el.html @template({ data: "+js" })
