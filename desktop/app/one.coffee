#
#
#
#


module.exports = class extends Backbone.View
  
  el: $("body")
  template: require "views/one"
  
  initialize: =>
    @el = $ @el
    callback = if @el.find(".one").length == 0 then @render else null
    app.models.one.fetch success: callback
  
  render: =>
    @el.html @template
      common: app.models.common.toJSON()
      one: app.models.one.toJSON()