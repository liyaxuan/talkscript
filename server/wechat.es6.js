let http = require('http');
let https = require('https');
let agent = require('superagent');
let xmlParser = require('express-xml-bodyparser');
let xml2js = require('xml2js');

export function wechat(app) {
	app.use(xmlParser({ normalizeTags: false }));

	app.get('/wechat', (req, res) => {
		res.send(req.query.echostr);
	});

	app.post('/wechat', (req, res) => {
		let xml = req.body.xml;

		let builder = new xml2js.Builder({
			rootName: 'xml',
			headless: true,
			cdata: true
		});

		let obj = {
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

export function getAccessToken() {
	return new Promise((resolve, reject) => {
		agent.get('https://api.weixin.qq.com/cgi-bin/token').query({
			grant_type: 'client_credential',
			appid: 'wx7f926eda7e850371',
			secret: 'de4befe2f34c79c632fbfe084af74102'
		}).end((err, res) => {
			let resMsg = JSON.parse(res.text);
			resMsg.errcode ? reject(resMsg) : resolve(resMsg.access_token);
		});
	});
};

function uploadImage({ access_token, filename }) {
	return new Promise((resolve, reject) => {
		agent.post('https://api.weixin.qq.com/cgi-bin/media/upload').query({
			access_token: access_token,
			type: 'image'
		}).attach('media', `../upload/${filename}`).end((err, res) => {
			let resMsg = JSON.parse(res.text);
			resMsg.errcode ? reject(resMsg) : resolve({ media_id: resMsg.media_id, access_token: access_token});
		});
	});		
};

let sendMessage = function ({ access_token, touser, type, content }) {
	return new Promise((resolve, reject) => {
		let reqBody = { touser: touser, msgtype: type};
		if(type == 'text')
			reqBody[type] = { content: content }
		else if(type == 'image')
			reqBody[type] = { media_id: content }

		agent.post('https://api.weixin.qq.com/cgi-bin/message/custom/send').query({
			access_token: access_token
		}).send(reqBody).end((err, res) => {
			let resMsg = JSON.parse(res.text);
			console.log(`sendMessage: ${resMsg}`);
			resMsg.errcode ? reject(resMsg) : resolve(resMsg, access_token);
		})
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