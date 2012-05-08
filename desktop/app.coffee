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


class App extends Backbone.LinkRouter

  routes:
	  ""      : "index"
	  "index" : "index"
	  "one"   : "one"
	  "two"   : "two"
	
  initialize: =>
    _.log "Desktop app init"
    Backbone.history.start
      pushState: true
      root: "/"
     
  middleware: =>
    @linkEvent and @linkEvent.preventDefault()
    #@activeView and @activeView.remove()

  index: =>
    @middleware()
    @activeView = new (require "app/index")
    _.log "index"

  one: =>
    @middleware()
    @activeView = new (require "app/one")
    _.log "one"

  two: =>
    @middleware()
    @activeView = new (require "app/two")
    _.log "two"


# main entry point
app = new App
