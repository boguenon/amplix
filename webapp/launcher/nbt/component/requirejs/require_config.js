require.config({

	urlArgs: "v=20191201133906",

	baseUrl: './nbt/',
	paths: {
		'auth/js/main': 'auth/js/main.min',
		custom : '/custom',
		nbextensions : './nbextensions',
		kernelspecs : '/kernelspecs',
		underscore : 'components/underscore/underscore-min',
		backbone : 'components/backbone/backbone-min',
		jed: 'components/jed/jed',
		jquery: 'components/jquery/jquery.min',
		json: 'components/requirejs-plugins/src/json',
		text: 'components/requirejs-text/text',
		bootstrap: 'components/bootstrap/dist/js/bootstrap.min',
		bootstraptour: 'components/bootstrap-tour/build/js/bootstrap-tour.min',
		'jquery-ui': 'components/jquery-ui/jquery-ui.min',
		moment: 'components/moment/min/moment-with-locales',
		codemirror: 'components/codemirror',
		termjs: 'components/xterm.js/xterm',
		typeahead: 'components/jquery-typeahead/dist/jquery.typeahead.min',
	},
	map: { // for backward compatibility
		"*": {
			"jqueryui": "jquery-ui",
		}
	},
	shim: {
		typeahead: {
			deps: ["jquery"],
			exports: "typeahead"
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		bootstrap: {
			deps: ["jquery"],
			exports: "bootstrap"
		},
		bootstraptour: {
			deps: ["bootstrap"],
			exports: "Tour"
		},
		"jquery-ui": {
			deps: ["jquery"],
			exports: "$"
		}
	},
	waitSeconds: 30,
});

require.config({
	map: {
		'*':{
			'contents': 'services/contents',
		}
	}
});

// error-catching custom.js shim.
define("custom", function (require, exports, module) {
	try {
		var custom = require('custom/custom');
		console.debug('loaded custom.js');
		return custom;
	} catch (e) {
		console.error("error loading custom.js", e);
		return {};
	}
})

document.nbjs_translations = {"domain": "nbjs", "locale_data": {"nbjs": {"": {"domain": "nbjs"}}}};
document.documentElement.lang = navigator.language.toLowerCase();