#
#
#
#


# global libs
window._ = require "lib/underscore"
window.Backbone = require "lib/backbone"
window.jade = require "lib/jade"

# plugins
require "plugins/underscore-ext"
require "plugins/backbone-ext"
require "plugins/jquery-color-animation"

#
class App extends Backbone.LinkRouter
  
  routes:
	  "one"         : "one"
	  "two"         : "two"
	  ""            : "index"
	
  models:
    common        : "/api/v1/common"
    index         : "/api/v1/index"
    one           : "/api/v1/one"
    two           : "/api/v1/two"
	
  initialize: =>
    window.app = @
    _.log "desktop init"
    pstate = if window.history and window.history.pushState then true else false
    _.each @models, (val, key) =>
      m = new Backbone.Model
      m.url = val
      @models[key] = m
    @models.common.fetch success: ->
      Backbone.history.start
        pushState: pstate
        hashChange: pstate
        root: "/"
    
  middleware: (route) =>
    if @linkEvent then @linkEvent.preventDefault()
    Klass = require "app/" + route
    _.log route
    viewChange = if @activeView? and @activeView not instanceof Klass then true else false
    @activeView? and @activeView.teardown?()
    @activeView = new Klass
    if viewChange then $('html, body').animate { scrollTop: 0 }
  
  one: =>
    @middleware "one"
    
  two: =>
    @middleware "two"

  index: =>
    @middleware "index"


# main entry point
new App
