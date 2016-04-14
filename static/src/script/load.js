'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.load = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(path) {
	if (window.template) if (window.template[path]) return new _promise2.default(function (resolve) {
		console.log('' + path);
		resolve(window.template[path]);
	});else window.template = {};
	return new _promise2.default(function (resolve) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
				window.template[path] = xhr.responseText;
				console.log(path + ' loaded');
				resolve(xhr.responseText);
			}
		};
		xhr.open('get', path);
		xhr.send(null);
	});
};

exports.load = load;
//# sourceMappingURL=load.js.map
