'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.teacher = undefined;

var _mongo = require('./mongo.js');

var teacher = {
	getAll: function getAll(req, res) {
		(0, _mongo.mongo)({
			col: 'teacher',
			method: 'find'
		}).then(function (array) {
			res.json({ result: 'success', data: array });
		}, (0, _mongo.mongoErrHandler)(res));
	},
	getOne: function getOne(req, res) {
		var tid = req.query.tid;
		(0, _mongo.mongo)({
			col: 'teacher',
			method: 'find',
			queryData: { tid: tid }
		}).then(function (array) {
			res.json({ result: 'success', data: array[0] });
		}, (0, _mongo.mongoErrHandler)(res));
	},
	postOne: function postOne(req, res) {
		console.log(req.body);
		var tid = req.body.tid;
		var pwd = req.body.pwd;
		var name = req.body.name;
		var phone = req.body.phone;

		(0, _mongo.mongo)({
			col: 'teacher',
			method: 'find',
			queryData: { tid: tid }
		}).then(function (array) {
			if (array.length == 0) return (0, _mongo.mongo)({
				col: 'teacher',
				method: 'insert',
				updateData: { tid: tid, pwd: pwd, name: name, phone: phone }
			});else res.json({ result: 'fail', code: 'E02' });
		}, (0, _mongo.mongoErrHandler)(res)).then(function (doc) {
			var result = doc.result;
			console.log(result);
			if (result.n >= 1) res.json({ result: 'success' });
			eles;
			res.json({ result: 'fail', code: result });
		}, (0, _mongo.mongoErrHandler)(res));
	},
	putOne: function putOne(req, res) {
		console.log(req.body);
		var tid = req.body.tid;
		var pwd = req.body.pwd;
		var name = req.body.name;
		var phone = req.body.phone;

		(0, _mongo.mongo)({
			col: 'teacher',
			method: 'update',
			queryData: { tid: tid },
			updateData: { $set: { pwd: pwd, name: name, phone: phone } }
		}).then(function (doc) {
			var result = doc.result;
			console.log(result);
			if (result.n >= 1) res.json({ result: 'success' });else res.json({ result: 'fail', code: 'E03' });
		}, (0, _mongo.mongoErrHandler)(res));
	}
};

exports.teacher = teacher;
//# sourceMappingURL=admin.js.map
