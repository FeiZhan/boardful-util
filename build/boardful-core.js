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
BOARDFUL.core.Namespace("BOARDFUL.core");

// event
BOARDFUL.Event = function (arg) {
	this.type = "Event";
	this.owner = undefined;
	BOARDFUL.Mngr.add(this);
	this.name = arg.name;
	this.arg = arg;
	this.arg.creation_time = new Date();
};
// event level precedence
BOARDFUL.Event.LEVELS = ["top", "system", "server", "board", "room", "game", "extension", "player", "card", "rear"];

// event manager
BOARDFUL.core.EventManager = function (owner, config) {
	this.type = "EventManager";
	this.owner = owner;
	BOARDFUL.Mngr.add(this);
	this.config = config || {};
	this.current = undefined;
	this.list = new Array();
	this.listener_list = new Object();
	this.config.timeout = 20;

	this.logger = new BOARDFUL.core.Logger();
	this.logger.add(winston.transports.File, {
		filename: 'logs/event.log'
	})
	.remove(winston.transports.Console);
	this.logger.log('info', "----------launch----------");
	this.name_logger = new BOARDFUL.core.Logger();
	this.name_logger.add(winston.transports.File, {
		filename: 'logs/event_name.log'
	})
	.remove(winston.transports.Console);
	this.name_logger.log('info', "----------launch----------");
};
// see or push to the front of event list
BOARDFUL.core.EventManager.prototype.front = function (id) {
	if (undefined === id) {
		if (0 == this.list.length) {
			return undefined;
		}
	}
	else if ("array" == typeof id || "object" == typeof id) {
		this.list = id.concat(this.list);
		for (var i in id) {
			this.logger.log("info", "prepend events", BOARDFUL.Mngr.get(id[i]).name);
		}
	}
	else {
		this.list.unshift(id);
		this.logger.log("info", "prepend event", BOARDFUL.Mngr.get(id).name);
	}
	return BOARDFUL.Mngr.get(this.list[0]);
};
// add to the rear of event list
BOARDFUL.core.EventManager.prototype.add = function (id) {
	if ("array" == typeof id || "object" == typeof id) {
		this.list = this.list.concat(id);
		for (var i in id) {
			this.logger.log("info", "append events", BOARDFUL.Mngr.get(id[i]).name);
		}
	}
	else {
		this.list.push(id);
		this.logger.log("info", "append event", BOARDFUL.Mngr.get(id).name);
	}
};
// add event listener
BOARDFUL.core.EventManager.prototype.on = function (event, config) {
	if (! (event in this.listener_list)) {
		this.listener_list[event] = new Object();
	}
	config.level = config.level || "rear";
	if (! (config.level in this.listener_list[event])) {
		this.listener_list[event][config.level] = new Array();
	}
	this.listener_list[event][config.level].push(config);
	this.logger.log("info", "add listener", event);
};
// remove event listener
BOARDFUL.core.EventManager.prototype.off = function (event, config) {
	if (! (event in this.listener_list)) {
		return;
	}
	config.level = config.level || "extension";
	if (! (config.level in this.listener_list[event])) {
		return;
	}
	var index = this.listener_list[event][config.level].indexOf(config);
	if (index >= 0) {
		this.listener_list[event][config.level].splice(index, 1);
	}
};
// launch event manager
BOARDFUL.core.EventManager.prototype.run = function () {
	switch (BOARDFUL.Mngr.get(this.owner).status) {
	case "pause":
	case "exit":
	case "userinput":
	case "uieffect":
		break;
	case "run":
	default:
		if (this.list.length > 0) {
			// get the current event
			this.current = this.front();
			this.logger.log("info", "event", this.current.name, this.current);
			this.name_logger.log("info", this.current.name);
			this.list.shift();
			if (this.current && (this.current.name in this.listener_list)) {
				for (var i in BOARDFUL.Event.LEVELS) {
					if (BOARDFUL.Event.LEVELS[i] in this.listener_list[this.current.name]) {
						for (var j in this.listener_list[this.current.name][BOARDFUL.Event.LEVELS[i]]) {
							var listener = this.listener_list[this.current.name][BOARDFUL.Event.LEVELS[i]][j];
							this.logger.log("info", "listener", BOARDFUL.Mngr.get(listener.id).name);
							// trigger listener callback for event
							listener.callback(this.current.arg);
						}
					}
				}
			}
		}
		break;
	}
	var that = this;
	// start next event
	setTimeout(function () {
		that.run();
	}, this.config.timeout);
};

BOARDFUL.core.Namespace("BOARDFUL.core");

// file loader
BOARDFUL.core.FileLoader = function (list, callback) {
	this.list = list;
	this.callback = callback;
	this.done = false;
	this.load();
};
// load files and wait
BOARDFUL.core.FileLoader.prototype.load = function () {
	this.done = true;
	for (var i in this.list) {
		if (! (this.list[i] in BOARDFUL.File.name_list) || "loaded" != BOARDFUL.File.list[BOARDFUL.File.name_list[this.list[i]]].status) {
			this.done = false;
			this.loadFile(this.list[i]);
		}
	}
	var that = this;
	if (! this.done) {
		setTimeout(function () {
			that.load();
		}, 500);
	} else {
		this.callback();
	}
};
// load a file
BOARDFUL.core.FileLoader.prototype.loadFile = function (file) {
	switch (BOARDFUL.Envi.type) {
	case "browser":
		this.loadByAjax(file);
		break;
	case "nodejs":
		this.loadByRequire(file);
		break;
	default:
		break;
	}
}
BOARDFUL.core.FileLoader.prototype.loadByRequire = function (file) {
	try {
		var script = require("../" + file);
		BOARDFUL.File.add(file, script, "loaded");
		BOARDFUL.File.logger.log("info", "file loaded", file);
	} catch (err) {
		BOARDFUL.File.add(file, "", "failed");
		BOARDFUL.File.logger.log("info", "file failed", file, err);
	}
};
// load a file via ajax by browser
BOARDFUL.core.FileLoader.prototype.loadByAjax = function (file) {
	var true_file = "../" + file;
	if (".js" == file.substr(file.length - 3)) {
		// load a js script
		$.getScript(true_file)
			.done(function( script, textStatus ) {
				BOARDFUL.File.add(file, script, "loaded");
				BOARDFUL.File.logger.log("info", "js loaded", file);
			})
			.fail(function( jqxhr, settings, exception ) {
				BOARDFUL.File.add(file, "", "failed");
				BOARDFUL.File.logger.log("info", "js failed", file);
			});
	}
	else if (".css" == file.substr(file.length - 4)) {
		// load a css
		$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', true_file) );
		BOARDFUL.File.add(file, "", "loaded");
		BOARDFUL.File.logger.log("info", "css loaded", file);
	}
	else if (".json" == file.substr(file.length - 5)) {
		$.getJSON(true_file, function(data, textStatus, jqXHR) {
			BOARDFUL.File.add(file, data, "loaded");
			BOARDFUL.File.logger.log("info", "json loaded", file);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			BOARDFUL.File.add(file, "", "failed");
			BOARDFUL.File.logger.log("info", "json failed", file);
		})
		.always(function(data, textStatus, jqXHR) {
		});
	}
	else {
		BOARDFUL.File.add(file, "", "loaded");
		BOARDFUL.File.logger.log("info", "file unknown", file);
	}
};
BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.FileManager = function () {
	this.list = [];
	this.name_list = {};
	this.next_id = 0;
};
// add to file list
BOARDFUL.core.FileManager.prototype.add = function (file, content, status) {
	// new file
	if (! (file in this.name_list)) {
		this.list[this.next_id] = {
			name: file,
			type: "",
			content: content,
			status: status
		};
		this.name_list[file] = this.next_id;
		++ this.next_id;
	}
	else {
		this.list[this.name_list[file]] = {
			name: file,
			content: content,
			status: status
		};
	}
};
// get file list in current html
BOARDFUL.core.FileManager.prototype.getFromHtml = function () {
	$("script").each(function () {
		this.add($(this).attr("src"), $(this), "loaded");
	});
};
BOARDFUL.core.Namespace("BOARDFUL.core");
var winston = {
	transports: {
		File: "File",
		Console: "Console"
	}
};

// logger
BOARDFUL.core.Logger = function () {
	var logger;
	switch (BOARDFUL.core.Envi.type) {
	case "nodejs":
		winston = require('winston');
		logger = new (BOARDFUL.core.WinstonLogger) ({
			transports: [
				new (winston.transports.Console)()
			]
		});
		break;
	case "browser":
		logger = new BOARDFUL.core.DefaultLogger();
		break;
	default:
		logger = new BOARDFUL.core.DefaultLogger();
		break;
	}
	return logger;
};

// default logger
BOARDFUL.core.DefaultLogger = function () {
	this.enable = true;
	this.list = new Array();
	//return console;
};
BOARDFUL.core.DefaultLogger.prototype.log = function () {
	var content = "";
	for (var i in arguments) {
		if ("array" == typeof arguments[i] || "object" == typeof arguments[i] || "function" == typeof arguments[i]) {
			content += BOARDFUL.core.toString(arguments[i]);
		} else {
			content += arguments[i];
		}
		content += " ";
	}
	this.list.push({
		time: new Date(),
		content: content
	});
	if (this.enable) {
		console.log.apply(console, arguments);
	}
	return this;
};
BOARDFUL.core.DefaultLogger.prototype.add = function (type) {
	if ("Console" == type) {
		this.enable = true;
	}
	return this;
};
BOARDFUL.core.DefaultLogger.prototype.remove = function (type) {
	if ("Console" == type) {
		this.enable = false;
	}
	return this;
};

// winston logger for nodejs
BOARDFUL.core.WinstonLogger = function (config) {
	this.winston = new (winston.Logger) (config);
	this.winston.log_base = this.winston.log;
	// new log function
	this.winston.log = function () {
		if ("nodejs" == BOARDFUL.core.Envi.type) {
			for (var i in arguments) {
				// convert to string
				if ("array" == typeof arguments[i] || "object" == typeof arguments[i] || "function" == typeof arguments[i]) {
					arguments[i] = BOARDFUL.core.toString(arguments[i]);
				}
			}
		}
		return this.log_base.apply(this, arguments);
	};
	return this.winston;
};
BOARDFUL.core.Namespace("BOARDFUL.core");

// object manager
BOARDFUL.core.Manager = function () {
	this.logger = new BOARDFUL.core.Logger();
	this.logger.add(winston.transports.File, {
		filename: 'logs/mngr.log'
	})
	.remove(winston.transports.Console);
	this.logger.log('info', "----------launch----------");
	this.next_id = 0;
	this.list = new Object();
};
// get object by id
BOARDFUL.core.Manager.prototype.get = function (id) {
	return this.list[id];
};
// add object
BOARDFUL.core.Manager.prototype.add = function (object) {
	object.id = this.next_id;
	object.type = object.type || object.constructor.name;
	if (! ("name" in object)) {
		object.name = object.type + "_" + object.id;
	}
	++ this.next_id;
	this.list[object.id] = object;
	this.logger.log("info", "add", object.name, object);
	return object.id;
};
BOARDFUL.core.Namespace("BOARDFUL.core");

// check environment
BOARDFUL.core.Envi = new Object();
BOARDFUL.core.checkEnvi = function () {
	if (typeof module !== 'undefined' && module.exports) {
		BOARDFUL.core.Envi.type = "nodejs";
	} else {
		BOARDFUL.core.Envi.type = "browser";
		BOARDFUL.core.Envi.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		BOARDFUL.core.Envi.isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		BOARDFUL.core.Envi.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		// At least Safari 3+: "[object HTMLElementConstructor]"
		BOARDFUL.core.Envi.isChrome = !!window.chrome && !BOARDFUL.core.Envi.isOpera;              // Chrome 1+
		BOARDFUL.core.Envi.isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	}
};

// parse url parameters
BOARDFUL.core.parseUrlParam = function (query) {
	var query_string = {};
	var query = query || window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]], pair[1] ];
		  query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
		  query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
};
// parse url param and hash
BOARDFUL.core.parseUrl = function () {
	var param = BOARDFUL.core.parseUrlParam(window.location.search.substring(1));
	param["#"] = window.location.hash.substring(1);
	var param1 = BOARDFUL.core.parseUrlParam(window.location.hash.substring(1));
	for (var index in param1) {
		if (! (index in param)) {
			param[index] = param1[index];
		}
	}
	return param;
};
BOARDFUL.core.Namespace("BOARDFUL.core");

// get function from string, with or without scopes
BOARDFUL.core.getFunctionFromString = function (string) {
	var scope = window;
	var scopeSplit = string.split('.');
	for (i = 0; i < scopeSplit.length - 1; i++)
	{
		scope = scope[scopeSplit[i]];
		if (scope == undefined) return;
	}
	return scope[scopeSplit[scopeSplit.length - 1]];
};
// convert to string
BOARDFUL.core.toString = function (value) {
	var str = value;
	try {
		str = JSON.stringify(value);
	}
	catch (err) {
		// circular json, convert two levels
		if ("array" == typeof value || "object" == typeof value || "function" == typeof value) {
			str = "{";
			for (var i in value) {
				str += i + ":";
				if ("array" == typeof value[i] || "object" == typeof value[i] || "function" == typeof value[i]) {
					str += "{";
					for (var j in value[i]) {
						str += j + ":";
						if ("array" == typeof value[i][j] || "object" == typeof value[i][j] || "function" == typeof value[j]) {
							str += typeof value[i][j];
						} else {
							str += value[i][j];
						}
						str += ",";
					}
					str += "}";
				} else {
					str += value[i];
				}
				str += ",";
			}
			str += "}";
		} else {
			str = "" + value;
		}
	}
	return str;
};

// shuffle
BOARDFUL.core.shuffle = function (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};