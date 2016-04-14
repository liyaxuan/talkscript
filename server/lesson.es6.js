import { mongo, mongoErrHandler } from './mongo';

let lesson = {
	getAll: (req, res) => {
		mongo({
			col: 'lesson',
			method: 'find'
		}).then((array) => {
			array.forEach((item) => {
				item.teach.forEach((item) => {
					delete item.student;
				});
			});
			if(array.length != 0)
				res.json({ result: 'success', data: array });
			else
				res.json({ result: 'fail', data: array });
		}, mongoErrHandler(res));
	},
	/*管理员新增一个教学班*/
	postOne: (req, res) => {

	},
	/*教师选择一个教学班*/
	selectOne: (req, res) => {
		let name = req.query.name;
		let numero = req.query.numero;	
		let tid = req.query.tid;
		mongo({
			col: 'lesson',
			method: 'update',
			queryData: {
				name: name,
				'teach.numero': numero,
				'teach.tid': ''
			},
			updateData: { 'teach.tid': tid }
		}).then((doc) => {
			let result = doc.result;
			console.log(result);
			if(result.n >= 1)
				res.json({ result: 'success' });
			else
				res.json({ result: 'fail', code: result })
		}, (err) => {
			res.json({ result: 'fail', code: err });
		});
	},
	/*管理员删除一个教学班*/
	deleteOne: (req, res) => {
		let name = req.query.name;
		let numero = req.query.numero;

		mongo({
			col: 'lesson',
			method: 'remove',
			queryData: {
				name: name,
				'teach.numero': numero
			}
		}).then((doc) => {
			let result = doc.result;
			console.log(result);
			if(result.n >= 1)
				res.json({ result: 'success' });
			else
				res.json({ result: 'fail' });
		}, mongoErrHandler(res));
	}
};

export { lesson };