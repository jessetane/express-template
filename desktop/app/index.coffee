#
#
#
#


module.exports = class extends Backbone.View
  
  el: $("body")
  template: require "views/index"
  
  initialize: =>
    @el = $ @el
    @el.html @template({ data: "+js" })
