// namespace
var BOARDFUL = BOARDFUL || {};
BOARDFUL.core = BOARDFUL.core || {};

// define namespaces
BOARDFUL.core.Namespace = function (name) {
	var names = name.split(".");
	var current = window;
	for (var i in names) {
		if (undefined === current[names[i]]) {
			current[names[i]] = {};
		}
		current = current[names[i]];
	}
	return current;
};
// init BOARDFUL
BOARDFUL.core.Init = function (config) {
	BOARDFUL.core.checkEnvi();

	// create logger
	BOARDFUL.Logger = new BOARDFUL.core.Logger();
	BOARDFUL.Logger.add(winston.transports.File, {
		//filename: 'logs/boardful_' + new Date().toString() + '.log'
		filename: 'logs/boardful.log'
	})
	.remove(winston.transports.Console);
	BOARDFUL.Logger.log('info', "----------launch----------");
	// create debug logger
	BOARDFUL.Debugger = new BOARDFUL.core.Logger();
	BOARDFUL.Debugger.add(winston.transports.File, {
		filename: 'logs/debug.log'
	})
	.remove(winston.transports.Console);
	BOARDFUL.Debugger.log('info', "----------launch----------");

	BOARDFUL.Logger.log('info', "launch type", config);
	BOARDFUL.Logger.log('info', "environment", BOARDFUL.core.Envi);

	BOARDFUL.core.UrlParam = BOARDFUL.core.parseUrl();
	BOARDFUL.Logger.log('info', "url param", BOARDFUL.core.UrlParam);
	BOARDFUL.Mngr = new BOARDFUL.core.Manager();
	BOARDFUL.FileMngr = new BOARDFUL.core.FileManager();
};
// start a board
BOARDFUL.core.runBoard = function (file) {
	BOARDFUL.FileMngr.load([file], function (contents) {
		BOARDFUL.Game = new BOARDFUL.core.Game(contents[file]);
		BOARDFUL.Game.run();
	});
};