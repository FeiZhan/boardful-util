BOARDFUL.core.Namespace("BOARDFUL.core");

// check environment
BOARDFUL.core.Envi = new Object();
BOARDFUL.core.checkEnvi = function () {
	if (typeof module !== 'undefined' && module.exports) {
		BOARDFUL.core.Envi.type = "nodejs";
	} else {
		BOARDFUL.core.Envi.type = "browser";
		BOARDFUL.core.Envi.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		BOARDFUL.core.Envi.isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		BOARDFUL.core.Envi.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		// At least Safari 3+: "[object HTMLElementConstructor]"
		BOARDFUL.core.Envi.isChrome = !!window.chrome && !BOARDFUL.core.Envi.isOpera;              // Chrome 1+
		BOARDFUL.core.Envi.isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	}
};

// parse url parameters
BOARDFUL.core.parseUrlParam = function (query) {
	var query_string = {};
	var query = query || window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]], pair[1] ];
		  query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
		  query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
};
// parse url param and hash
BOARDFUL.core.parseUrl = function () {
	var param = BOARDFUL.core.parseUrlParam(window.location.search.substring(1));
	param["#"] = window.location.hash.substring(1);
	var param1 = BOARDFUL.core.parseUrlParam(window.location.hash.substring(1));
	for (var index in param1) {
		if (! (index in param)) {
			param[index] = param1[index];
		}
	}
	return param;
};