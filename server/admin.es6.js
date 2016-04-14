import { mongo, mongoErrHandler } from './mongo.js';

let teacher = {
	getAll: (req, res) => {
		mongo({
			col: 'teacher',
			method: 'find'
		}).then((array) => {
			res.json({ result: 'success', data: array });
		}, mongoErrHandler(res));
	},
	getOne: (req, res) => {
		let tid = req.query.tid;
		mongo({
			col: 'teacher',
			method: 'find',
			queryData: { tid: tid }
		}).then((array) => {
			res.json({ result: 'success', data: array[0] });
		}, mongoErrHandler(res));		
	},
	postOne: (req, res) => {
		console.log(req.body);
		let tid = req.body.tid;
		let pwd = req.body.pwd;
		let name = req.body.name;
		let phone = req.body.phone;

		mongo({
			col: 'teacher',
			method: 'find',
			queryData: { tid: tid }
		}).then((array) => {
			if(array.length == 0)
				return mongo({
					col: 'teacher',
					method: 'insert',
					updateData: { tid: tid, pwd: pwd, name: name, phone: phone }
				});
			else
				res.json({ result: 'fail', code: 'E02' });
		}, mongoErrHandler(res)).then((doc) => {
			let result = doc.result;
			console.log(result);
			if(result.n >= 1)
				res.json({ result: 'success' });
			eles
				res.json({ result: 'fail', code: result });
		}, mongoErrHandler(res));
	},
	putOne: (req, res) => {
		console.log(req.body);
		let tid = req.body.tid;
		let pwd = req.body.pwd;
		let name = req.body.name;
		let phone = req.body.phone;

		mongo({
			col: 'teacher',
			method: 'update',
			queryData: { tid: tid },
			updateData: { $set: { pwd: pwd, name: name, phone: phone } }
		}).then((doc) => {
			let result = doc.result;
			console.log(result);
			if(result.n >= 1)
				res.json({ result: 'success' });
			else
				res.json({ result: 'fail', code: 'E03' });
		}, mongoErrHandler(res));
	}
};

export { teacher };