#
#
#
#


module.exports = class extends Backbone.View
  
  el: $("body")
  template: require "views/two"
  
  initialize: =>
    @el = $ @el
    callback = if @el.find(".two").length == 0 then @render else null
    app.models.two.fetch success: callback
  
  render: =>
    @el.html @template
      common: app.models.common.toJSON()
      two: app.models.two.toJSON()
