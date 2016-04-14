let http = require('http');
let qs = require('querystring');
let mongoClient = require('mongodb').MongoClient;

let insertTeacher = () => {
	let teacher = ['郭平', '伍星', '黄宏宇', '李东晖', '古平', '何婧媛', '杨瑞龙', '刘骥', '张敏'];
	let data = [];

	for(let i = 0; i < teacher.length; i++)
		data.push({
			'tid': 19290000 + i + '',
			'name': teacher[i],
			'phone': '152' + Math.floor(9999*Math.random()) + Math.floor(999*Math.random()),
			'pwd': Math.floor(999999*Math.random())
		});

	// mongoClient.connect('mongodb://127.0.0.1:27017/talkscript').then((db) => {
	// 	db.collection('teacher').insert(data).then((doc) => {
	// 		console.log(doc);
	// 	}).catch((err) => {
	// 		throw err;
	// 	})
	// }).catch((err) => {
	// 	console.log(err);
	// });

	let data_2 = data.map((item) => {
		return {
			username: item.tid,
			token: ''
		};
	});

	data_2.push({
		username: 'admin',
		token: ''
	});

	mongoClient.connect('mongodb://127.0.0.1:27017/talkscript').then((db) => {
		db.collection('token').insert(data_2).then((doc) => {
			console.log(doc);
		}).catch((err) => {
			throw err;
		})
	}).catch((err) => {
		console.log(err);
	});
};

let insertLesson = () => {
	let courseName = ['计算机概论', '面向对象程序设计', 'Java程序设计', '计算机网络', '汇编程序设计', '编译原理', '算法分析与设计'];

	mongoClient.connect('mongodb://127.0.0.1:27017/talkscript').then((db) => {	
		let temp = courseName.map(function (item) {
			let teach = [];
			for(var i = 0; i < 4; i++)
				teach.push({
					numero: '0' + (i + 1),
					tid: '',
					student: []					
				});
			return {
				name: item,
				teach: teach
			};
		});
		db.collection('lesson').insert(temp).then((doc) => {
			console.log(doc);
		}).catch((err) => {
			throw err;
		});
	}).catch((err) => {
		console.log(err);
	});	
};

insertTeacher();