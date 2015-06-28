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
BOARDFUL.core.Init = function () {
	BOARDFUL.core.checkEnvi();
	BOARDFUL.logger = new BOARDFUL.core.Logger();
	BOARDFUL.mngr = new BOARDFUL.core.Manager();
	//BOARDFUL.event_mngr = new BOARDFUL.core.EventManager();
};