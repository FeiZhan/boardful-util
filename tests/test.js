// test cases
var test = function () {
	BOARDFUL.core.Init();

	test.core();
	test.util();
	test.platform();
	test.logger();
	test.manager();
	test.event();
};
test.core = function () {
	console.debug("Test case core - namespace:");
	BOARDFUL.core.Namespace("BOARDFUL.a.b.c");
	console.debug('typeof(BOARDFUL.a.b.c) === "object":', typeof(BOARDFUL.a.b.c) === "object");
};
test.util = function () {
	console.debug("Test case util - 0:");
};
test.platform = function () {
	console.debug("Test case platform - environment:");
	BOARDFUL.core.checkEnvi();
	console.debug(BOARDFUL.core.Envi);

	console.debug("Test case platform - url:");
	console.debug(BOARDFUL.core.parseUrl());
};
test.logger = function () {
	console.debug("Test case logger - 0:");
	BOARDFUL.logger.log("debug", "sadfsdf", 23423, {}, undefined);

	console.debug("Test case logger - 1:");
	BOARDFUL.logger.log("log", "sadfsdf", 23423, {}, undefined);
};
test.manager = function () {
	console.debug("Test case manager - 0:");
};
test.event = function () {
	console.debug("Test case event - 0:");
};