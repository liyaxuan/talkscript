'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.wechat = wechat;
exports.getAccessToken = getAccessToken;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var https = require('https');
var agent = require('superagent');
var xmlParser = require('express-xml-bodyparser');
var xml2js = require('xml2js');

function wechat(app) {
	app.use(xmlParser({ normalizeTags: false }));

	app.get('/wechat', function (req, res) {
		res.send(req.query.echostr);
	});

	app.post('/wechat', function (req, res) {
		var xml = req.body.xml;

		var builder = new xml2js.Builder({
			rootName: 'xml',
			headless: true,
			cdata: true
		});

		var obj = {
			ToUserName: xml.FromUserName,
			FromUserName: xml.ToUserName,
			CreateTime: new Date(),
			MsgType: 'text',
			Content: 'Hello'
		};

		console.log(builder.buildObject(obj));
		res.send(builder.buildObject(obj));
	});
};

function getAccessToken() {
	return new _promise2.default(function (resolve, reject) {
		agent.get('https://api.weixin.qq.com/cgi-bin/token').query({
			grant_type: 'client_credential',
			appid: 'wx7f926eda7e850371',
			secret: 'de4befe2f34c79c632fbfe084af74102'
		}).end(function (err, res) {
			var resMsg = JSON.parse(res.text);
			resMsg.errcode ? reject(resMsg) : resolve(resMsg.access_token);
		});
	});
};

function uploadImage(_ref) {
	var access_token = _ref.access_token;
	var filename = _ref.filename;

	return new _promise2.default(function (resolve, reject) {
		agent.post('https://api.weixin.qq.com/cgi-bin/media/upload').query({
			access_token: access_token,
			type: 'image'
		}).attach('media', '../upload/' + filename).end(function (err, res) {
			var resMsg = JSON.parse(res.text);
			resMsg.errcode ? reject(resMsg) : resolve({ media_id: resMsg.media_id, access_token: access_token });
		});
	});
};

var sendMessage = function sendMessage(_ref2) {
	var access_token = _ref2.access_token;
	var touser = _ref2.touser;
	var type = _ref2.type;
	var content = _ref2.content;

	return new _promise2.default(function (resolve, reject) {
		var reqBody = { touser: touser, msgtype: type };
		if (type == 'text') reqBody[type] = { content: content };else if (type == 'image') reqBody[type] = { media_id: content };

		agent.post('https://api.weixin.qq.com/cgi-bin/message/custom/send').query({
			access_token: access_token
		}).send(reqBody).end(function (err, res) {
			var resMsg = JSON.parse(res.text);
			console.log('sendMessage: ' + resMsg);
			resMsg.errcode ? reject(resMsg) : resolve(resMsg, access_token);
		});
	});
};

// getAccessToken().then((access_token) => {
// 	return uploadImage({
// 		access_token: access_token,
// 		filename: '1.jpg'
// 	});
// }, (errMsg) => { console.log(errMsg); })
// .then(({ media_id, access_token }) => {
// 	console.log(access_token);
// 	return sendMessage({
// 		access_token: access_token,
// 		content: media_id,
// 		touser: 'o0kZNwNDAfCw3lz_7ELS34TGyZzU',
// 		type: 'image'
// 	});
// }, (errMsg) => { console.log(errMsg); }).then((resMsg, access_token) => {

// });
//# sourceMappingURL=wechat.js.map
