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