BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.Deck = function (owner, config) {
	this.type = "Deck";
	this.owner = owner;
	BOARDFUL.Mngr.add(this);
	this.config = config || {};
	this.card_list = {};
	this.addListeners();
};
BOARDFUL.core.Deck.prototype.addListeners = function () {
	var that = this;
	if ("draw" === this.config.name) {
		BOARDFUL.EventMngr.on("InitCards", {
			level: "game",
			callback: function (arg) {
				that.initCards(arg);
			},
			id: that.id
		});
	}
};
BOARDFUL.core.Deck.prototype.initCards = function (arg) {
	var players = BOARDFUL.Mngr.get(this.owner).player_list;
	var event_list = [];
	for (var i in players) {
		var event = new BOARDFUL.core.Event({
			name: "CardsDraw",
			target: players[i],
			number: arg.number
		});
		event_list.push(event.id);
	}
	BOARDFUL.EventMngr.front(event_list);
};