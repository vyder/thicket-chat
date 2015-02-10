var _            = require("underscore"),
    Promise      = require("bluebird"),
    express      = require("express"),
    thicket      = require("thicket"),
    Logger       = thicket.c("logger"),
    CLA          = thicket.c("appenders/console-log"),
    App          = thicket.c("app"),
    Bootstrapper = thicket.c("bootstrapper");

var Log = Logger.create("ChatApp");

var ChatApp = function() { this.initialize.apply(this, arguments); };

_.extend(ChatApp.prototype, App.prototype, {
  initialize: function() {
    App.prototype.initialize.apply(this, arguments);
    this._expressApp = express();
  },
  up: Promise.method(function(configuration) {
    Log.debug("Setting up default route");
    this._expressApp.get('/', function(req, res){
      res.send('hello world');
    });

    var port = parseInt(this._config['port']);

    this._server = this._expressApp.listen(port);
    Log.debug("Listening at http://127.0.0.1:" + port);
  }),
  down: Promise.method(function() {
    Log.debug("Shutting down the server...");
    this._server.close();
  })
});

Logger.root().setLogLevel(Logger.Level.Debug);
Logger.root().addAppender(new CLA());

var bootstrapper = new Bootstrapper({ applicationConstructor: ChatApp });
bootstrapper
  .bootstrap()
  .then(function(appContainer) {
    return appContainer.start();
  });
