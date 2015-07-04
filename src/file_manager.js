BOARDFUL.core.Namespace("BOARDFUL.core");

// file manager
BOARDFUL.core.FileManager = function () {
	this.list = [];
	this.name_list = {};
	this.next_id = 0;

	// file mngr logger
	this.logger = new BOARDFUL.core.Logger();
	this.logger.add(winston.transports.File, {
		filename: 'logs/file.log'
	})
	.remove(winston.transports.Console);
	this.logger.log('info', "----------launch----------");
};
// load files
BOARDFUL.core.FileManager.prototype.load = function (files, callback) {
	var loader = new BOARDFUL.core.FileLoader(this, files, callback);
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
	this.logger.log('info', "files in html", this.name_list);
};