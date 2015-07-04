BOARDFUL.core.Namespace("BOARDFUL.core");

// file loader
BOARDFUL.core.FileLoader = function (mngr, list, callback) {
	this.mngr = mngr;
	this.list = list;
	this.callback = callback;
	this.done = false;
	this.load();
};
// load files and wait
BOARDFUL.core.FileLoader.prototype.load = function () {
	this.done = true;
	for (var i in this.list) {
		if (! (this.list[i] in this.mngr.name_list) || "loaded" != this.mngr.list[this.mngr.name_list[this.list[i]]].status) {
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
		var param = {};
		for (var i in this.list) {
			param[this.list[i]] = this.mngr.list[this.mngr.name_list[this.list[i]]].content;
		}
		this.callback(param);
	}
};
// load a file
BOARDFUL.core.FileLoader.prototype.loadFile = function (file) {
	switch (BOARDFUL.core.Envi.type) {
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
		this.mngr.add(file, script, "loaded");
		this.mngr.logger.log("info", "file loaded", file);
	} catch (err) {
		this.mngr.add(file, "", "failed");
		this.mngr.logger.log("info", "file failed", file, err);
	}
};
// load a file via ajax by browser
BOARDFUL.core.FileLoader.prototype.loadByAjax = function (file) {
	var that = this;
	var true_file = "./" + file;
	if (".js" == file.substr(file.length - 3)) {
		// load a js script
		$.getScript(true_file)
			.done(function( script, textStatus ) {
				that.mngr.add(file, script, "loaded");
				that.mngr.logger.log("info", "js loaded", file);
			})
			.fail(function( jqxhr, settings, exception ) {
				that.mngr.add(file, "", "failed");
				that.mngr.logger.log("info", "js failed", file);
			});
	}
	else if (".css" == file.substr(file.length - 4)) {
		// load a css
		$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', true_file) );
		this.mngr.add(file, "", "loaded");
		this.mngr.logger.log("info", "css loaded", file);
	}
	else if (".json" == file.substr(file.length - 5)) {
		$.getJSON(true_file, function(data, textStatus, jqXHR) {
			that.mngr.add(file, data, "loaded");
			that.mngr.logger.log("info", "json loaded", file);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			that.mngr.add(file, "", "failed");
			that.mngr.logger.log("info", "json failed", file, textStatus, errorThrown);
		})
		.always(function(data, textStatus, jqXHR) {
		});
	}
	else {
		this.mngr.add(file, "", "loaded");
		this.mngr.logger.log("info", "file unknown", file);
	}
};