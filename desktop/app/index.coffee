#
#
#
#


module.exports = class extends Backbone.View
  
  el: $("body")
  template: require "views/index"
  
  initialize: =>
    @el = $ @el
    callback = if @el.find(".index").length == 0 then @render else null
    app.models.index.fetch success: callback
  
  render: =>
    @el.html @template
      common: app.models.common.toJSON()
      index: app.models.index.toJSON()