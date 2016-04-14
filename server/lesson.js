'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.lesson = undefined;

var _mongo = require('./mongo');

var lesson = {
	getAll: function getAll(req, res) {
		(0, _mongo.mongo)({
			col: 'lesson',
			method: 'find'
		}).then(function (array) {
			array.forEach(function (item) {
				item.teach.forEach(function (item) {
					delete item.student;
				});
			});
			if (array.length != 0) res.json({ result: 'success', data: array });else res.json({ result: 'fail', data: array });
		}, (0, _mongo.mongoErrHandler)(res));
	},
	/*管理员新增一个教学班*/
	postOne: function postOne(req, res) {},
	/*教师选择一个教学班*/
	selectOne: function selectOne(req, res) {
		var name = req.query.name;
		var numero = req.query.numero;
		var tid = req.query.tid;
		(0, _mongo.mongo)({
			col: 'lesson',
			method: 'update',
			queryData: {
				name: name,
				'teach.numero': numero,
				'teach.tid': ''
			},
			updateData: { 'teach.tid': tid }
		}).then(function (doc) {
			var result = doc.result;
			console.log(result);
			if (result.n >= 1) res.json({ result: 'success' });else res.json({ result: 'fail', code: result });
		}, function (err) {
			res.json({ result: 'fail', code: err });
		});
	},
	/*管理员删除一个教学班*/
	deleteOne: function deleteOne(req, res) {
		var name = req.query.name;
		var numero = req.query.numero;

		(0, _mongo.mongo)({
			col: 'lesson',
			method: 'remove',
			queryData: {
				name: name,
				'teach.numero': numero
			}
		}).then(function (doc) {
			var result = doc.result;
			console.log(result);
			if (result.n >= 1) res.json({ result: 'success' });else res.json({ result: 'fail' });
		}, (0, _mongo.mongoErrHandler)(res));
	}
};

exports.lesson = lesson;
//# sourceMappingURL=lesson.js.map
