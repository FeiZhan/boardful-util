BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.Table = function (owner, config) {
	this.type = "Table";
	this.owner = undefined;
	BOARDFUL.Mngr.add(this);
	this.config = config || {};
	this.card_list = {};
	this.addListeners();
};
BOARDFUL.core.Table.prototype.addListeners = function () {
};