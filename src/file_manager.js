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