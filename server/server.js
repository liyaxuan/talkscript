'use strict';

var _wechat = require('./wechat');

var _mongo = require('./mongo');

var _admin = require('./admin');

var _lesson = require('./lesson');

var crypto = require('crypto');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var xlsx = require('node-xlsx');

var app = express();

app.use(express.static('../static'));
app.use(express.static('../upload'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(80);

var storage = multer.diskStorage({
	destination: function destination(req, file, cb) {
		cb(null, '../upload');
	},
	filename: function filename(req, file, cb) {
		cb(null, req.query.name + req.query.numero + '.xlsx');
	}
});

var upload = multer({ storage: storage });

(0, _wechat.wechat)(app);

app.route('/teacher').get(function (req, res) {
	req.query.tid ? _admin.teacher.getOne(req, res) : _admin.teacher.getAll(req, res);
}).post(function (req, res) {
	_admin.teacher.postOne(req, res);
}).put(function (req, res) {
	_admin.teacher.putOne(req, res);
});

app.route('/lesson').get(function (req, res) {}).post(function (req, res) {
	_lesson.lesson.postOne(req, res);
}).put(function (req, res) {
	_lesson.lesson.selectOne(req, res);
});

/*
	E00: 登录失败, 教工号存在, 密码错误
	E01: 登录失败, 教工号不存在
	E02: 注册失败, 教工号已经注册
	E03: 更新教师信息失败, 没有找到教工号
	E04: 更新token失败
*/

app.post('/login', function (req, res) {
	var option = req.query.option;
	var username = req.body.username;
	var password = req.body.password;

	var md5 = crypto.createHash('md5');
	md5.update(username + password, 'utf8');
	var token = md5.digest('hex');

	(0, _mongo.mongo)({
		col: option,
		method: 'find',
		queryData: option == 'admin' ? { uid: username } : { tid: username }
	}).then(function (array) {
		if (array.length != 0 && array[0].pwd == password) {
			res.cookie('token', token);
			res.json({ result: 'success' });
			return (0, _mongo.mongo)({
				col: 'token',
				method: 'update',
				queryData: { username: username },
				updateData: { token: token }
			});
		} else if (array.length != 0 && array[0].pwd != password) {
			res.json({ result: 'fail', code: 'E00' });
		} else {
			res.json({ result: 'fail', code: 'E01' });
		}
	}, (0, _mongo.mongoErrHandler)(res)).then(function (doc) {
		var result = doc.result;
		console.log(result);
		if (result.n >= 1) res.json({ result: 'success' });else res.json({ result: 'fail', code: 'E04' });
	}, (0, _mongo.mongoErrHandler)(res));
});

/*
query:
	name: 标识课程名称
	numero: 标识教学班号
body: 
	excle: 文件
*/

app.post('/lesson/student', upload.single('excel'), function (req, res) {
	var excle = xlsx.parse(req.file.path);
	var student = excle[0].data.map(function (item, index, array) {
		if (item[1] === undefined) item[1] = array[index - 1][1];
		return {
			class_name: item[1],
			sid: item[2],
			name: item[3],
			gender: item[4]
		};
	});

	(0, _mongo.mongo)({
		col: 'lesson',
		method: 'update',
		queryData: {
			name: req.query.name,
			numero: req.query.numero
		},
		updateData: {
			$set: { student: student }
		},
		succ: function succ(doc) {
			if (doc.result.ok >= 1) res.json({ list: student });else res.json({ list: [] });
		}
	});
});

/*
query:
	tid: 标识教师
body:
	name: 标识课程名称
	numero: 标识教学班号

如果这条状态记录不存在, 则添加时间信息, 插入这条新记录;
如果这条状态记录已存在, 则更新时间信息, 更新这条旧记录
*/

app.post('/lesson/start', function (req, res) {
	var data = {
		tid: req.query.tid,
		name: req.body.name,
		numero: req.body.numero
	};

	(0, _mongo.mongo)({
		col: 'status',
		method: 'find',
		queryData: data,
		succ: function succ(doc) {
			if (doc.length == 0) {
				data.date = new Date();

				(0, _mongo.mongo)({
					col: 'status',
					method: 'insert',
					updateData: data,
					succ: function succ(doc) {
						res.json({ result: 'success' });
					}
				});
			} else {
				(0, _mongo.mongo)({
					col: 'status',
					method: 'update',
					queryData: data,
					updateData: { date: new Date() },
					succ: function succ(doc) {
						res.json({ result: 'fail' });
					}
				});
			}
		}
	});
});

/*
query:
	tid: 标识教师
	type: register, sign, single, double, text
	operation: start, stop
body: 
	stem: 题干
	option: { Array } 选项
*/

app.post('/lesson/interact', function (req, res) {
	console.log('233');
	for (var x in req.body) {
		console.log(x);
	}res.end();
	// let data = {
	// 	tid: req.query.tid,
	// 	type: req.query.name
	// };

	// mongo({
	// 	col: 'status',
	// 	method: 'update',
	// 	queryData: { tid: req.query.tid },
	// 	updateData: { date: new Date() }
	// 	succ: (doc) => {
	// 		res.json({ result: 'success' });
	// 	}
	// });
});

app.post('/lesson/stop', function (req, res) {
	var data = {
		tid: req.query.tid,
		name: req.body.name,
		numero: req.body.numero
	};

	(0, _mongo.mongo)({
		col: 'status',
		method: 'remove',
		queryData: data,
		succ: function succ(doc) {
			res.json({ result: 'success' });
		}
	});
});
//# sourceMappingURL=server.js.map
