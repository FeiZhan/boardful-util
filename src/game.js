BOARDFUL.core.Namespace("BOARDFUL.core");

BOARDFUL.core.Game = function (board, config) {
	this.type = "Game";
	this.owner = undefined;
	BOARDFUL.Mngr.add(this);
	this.board = board || {};
	this.config = config || {};
	this.table_list = {};
	this.deck_list = {};
	this.player_list = {};
	this.cardset_list = {};
	BOARDFUL.EventMngr = new BOARDFUL.core.EventManager();
	this.addListeners();
};
BOARDFUL.core.Game.prototype.addListeners = function () {
	var that = this;
	BOARDFUL.EventMngr.on("GameInit", {
		level: "game",
		callback: function (arg) {
			that.gameInit(arg);
		},
		id: that.id
	});
	BOARDFUL.EventMngr.on("TableCreate", {
		level: "game",
		callback: function (arg) {
			that.tableCreate(arg);
		},
		id: that.id
	});
	BOARDFUL.EventMngr.on("DeckCreate", {
		level: "game",
		callback: function (arg) {
			that.deckCreate(arg);
		},
		id: that.id
	});
	BOARDFUL.EventMngr.on("PlayerCreate", {
		level: "game",
		callback: function (arg) {
			that.playerCreate(arg);
		},
		id: that.id
	});
	BOARDFUL.EventMngr.on("CardSetCreate", {
		level: "game",
		callback: function (arg) {
			that.cardSetCreate(arg);
		},
		id: that.id
	});
	BOARDFUL.EventMngr.on("GameStart", {
		level: "game",
		callback: function (arg) {
			that.gameStart(arg);
		},
		id: that.id
	});
};
BOARDFUL.core.Game.prototype.run = function () {
	BOARDFUL.Game.status = "run";
	BOARDFUL.EventMngr.run();
	var event_list = [];
	var event = new BOARDFUL.core.Event({
		name: "GameInit"
	});
	event_list.push(event.id);
	BOARDFUL.EventMngr.front(event_list);
};
BOARDFUL.core.Game.prototype.gameInit = function (arg) {
	this.board.board = this.board.board || {};
	var event_list = [];
	if (undefined !== this.board.board.tables) {
		var table_num = parseInt(this.board.board.tables.number);
		for (var i = 0; i < table_num; ++ i) {
			var event = new BOARDFUL.core.Event({
				name: "TableCreate",
				target: this.board.board.tables.names[i]
			});
			event_list.push(event.id);
		}
	}
	if (undefined !== this.board.board.decks) {
		var deck_num = parseInt(this.board.board.decks.number);
		for (var i = 0; i < deck_num; ++ i) {
			var event = new BOARDFUL.core.Event({
				name: "DeckCreate",
				target: this.board.board.decks.names[i]
			});
			event_list.push(event.id);
		}
	}
	if (undefined !== this.board.board.players) {
		var player_num = parseInt(this.board.board.players.number);
		for (var i = 0; i < player_num; ++ i) {
			var event = new BOARDFUL.core.Event({
				name: "PlayerCreate",
				target: this.board.board.players.names[i]
			});
			event_list.push(event.id);
		}
	}
	if (undefined !== this.board.board.cardSets) {
		var card_num = parseInt(this.board.board.cardSets.number);
		for (var i = 0; i < card_num; ++ i) {
			var event = new BOARDFUL.core.Event({
				name: "CardSetCreate",
				target: this.board.board.cardSets.namespaces[i]
			});
			event_list.push(event.id);
		}
	}
	var event = new BOARDFUL.core.Event({
		name: "GameStart"
	});
	event_list.push(event.id);
	BOARDFUL.EventMngr.front(event_list);
};
BOARDFUL.core.Game.prototype.tableCreate = function (arg) {
	this.table_list[arg.target] = new BOARDFUL.core.Table(this.id, {
		name: arg.target
	});
};
BOARDFUL.core.Game.prototype.deckCreate = function (arg) {
	this.deck_list[arg.target] = new BOARDFUL.core.Deck(this.id, {
		name: arg.target
	});
};
BOARDFUL.core.Game.prototype.playerCreate = function (arg) {
	this.player_list[arg.target] = new BOARDFUL.core.Player(this.id, {
		name: arg.target
	});
};
BOARDFUL.core.Game.prototype.cardSetCreate = function (arg) {
};
BOARDFUL.core.Game.prototype.gameStart = function (arg) {
	this.board.flow = this.board.flow || {};
	var event_list = [];
	if (undefined !== this.board.flow.initCards) {
		var event = new BOARDFUL.core.Event({
			name: "InitCards",
			number: this.board.flow.initCards
		});
		event_list.push(event.id);
	}
	if (undefined !== this.board.flow.roundAction) {
		var event = new BOARDFUL.core.Event({
			name: "RoundActionStart"
		});
		event_list.push(event.id);
		if (undefined !== this.board.flow.roundAction.drawPhase) {
			var event = new BOARDFUL.core.Event({
				name: "RoundActionDrawPhase",
				number: this.board.flow.roundAction.drawPhase
			});
			event_list.push(event.id);
		}
		if (undefined !== this.board.flow.roundAction.playPhase) {
			var event = new BOARDFUL.core.Event({
				name: "RoundActionPlayPhase",
				number: this.board.flow.roundAction.playPhase
			});
			event_list.push(event.id);
		}
		if (undefined !== this.board.flow.roundAction.endPhase) {
			var event = new BOARDFUL.core.Event({
				name: "RoundActionEndPhase",
				number: this.board.flow.roundAction.endPhase
			});
			event_list.push(event.id);
		}
		var event = new BOARDFUL.core.Event({
			name: "RoundActionEnd"
		});
		event_list.push(event.id);
	}
	if (undefined !== this.board.flow.playerAction) {
		var event = new BOARDFUL.core.Event({
			name: "playerActionStart"
		});
		event_list.push(event.id);
		var event = new BOARDFUL.core.Event({
			name: "playerActionEnd"
		});
		event_list.push(event.id);
	}
	BOARDFUL.EventMngr.front(event_list);
};