#
#
#
#


# global libs
window._ = require "lib/underscore"
window.Backbone = require "lib/backbone"
window.jade = require "lib/jade"

# plugins
require "plugins/underscore.ext"


class App extends Backbone.Router

  routes:
	  ""      : "index"
	  "index" : "index"
	  "one"   : "one"
	  "two"   : "two"
	
  initialize: =>
    Backbone.history.start
      pushState: true
      root: "/"

    # cancel default link behavior and 
    # handle internally for supported routes
    $("a").live "click", (evt) =>
      @linkEvent = evt
      target = $ evt.currentTarget
      url = target.attr "href"
      
      # only deal with GET
      if !target.attr "data-method"
        fragment = Backbone.history.getFragment url
        matched = _.any Backbone.history.handlers, (handler) ->
          if handler.route.test fragment then return true
        if matched then @navigate url, trigger: true
        
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
_.log "Desktop init"
app = new App
