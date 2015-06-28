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