'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mongoErrHandler = exports.mongo = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = require('mongodb').MongoClient;

var mongo = function mongo(_ref) {
	var col = _ref.col;
	var method = _ref.method;
	var _ref$queryData = _ref.queryData;
	var queryData = _ref$queryData === undefined ? {} : _ref$queryData;
	var _ref$updateData = _ref.updateData;
	var updateData = _ref$updateData === undefined ? {} : _ref$updateData;

	return client.connect('mongodb://127.0.0.1:27017/talkscript').then(function (db) {
		if (method == 'find') var promise = db.collection(col)[method](queryData).toArray();else if (method == 'update') var promise = db.collection(col)[method](queryData, updateData, {
			multi: true
		});else if (method == 'delete') var promise = db.collection(col)[method](queryData);else if (method == 'insert') var promise = db.collection(col)[method](updateData);else {
			var promise;

			(function () {
				var err = method + ' is not allowed';
				console.log(err);
				promise = new _promise2.default(function (resolve, reject) {
					reject(err);
				});
			})();
		}
		return promise;
	}, function (err) {
		console.log(err);
	});
};

var mongoErrHandler = function mongoErrHandler(res) {
	return function (err) {
		res.json({ result: 'fail', code: err });
	};
};

exports.mongo = mongo;
exports.mongoErrHandler = mongoErrHandler;
//# sourceMappingURL=mongo.js.map
