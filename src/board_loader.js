BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.BoardLoader = function (board, config) {
	this.board = board || {};
	if (undefined !== board.dependency) {
		this.loadDependency(board.dependency);
	}
	else {
		this.loadComponents(board.files);
	}
};
BOARDFUL.core.BoardLoader.prototype.loadDependency = function (dependency) {
	var that = this;
	BOARDFUL.FileMngr.load(dependency, function () {
		that.loadComponents();
	});
};
BOARDFUL.core.BoardLoader.prototype.loadComponents = function (components) {
	var that = this;
	if (undefined !== board.files) {
		BOARDFUL.FileMngr.load(components, function () {
			BOARDFUL.Game = new BOARDFUL.core.Game(that.board);
		});
	}
	else {
		BOARDFUL.Game = new BOARDFUL.core.Game(this.board);
	}
};