var example = function () {
	BOARDFUL.core.Init();
	setInterval(function () {
		var event = new BOARDFUL.core.Event();
		BOARDFUL.event_mngr.front(event);
	}, 500);
	BOARDFUL.event_mngr.run();
};