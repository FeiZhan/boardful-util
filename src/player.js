BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.Player = function (owner, config) {
	this.type = "Player";
	this.owner = undefined;
	BOARDFUL.Mngr.add(this);
	this.config = config || {};
	this.card_list = {};
	this.addListeners();
};
BOARDFUL.core.Player.prototype.addListeners = function () {
};