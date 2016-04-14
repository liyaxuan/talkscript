let client = require('mongodb').MongoClient;

let mongo = ({ col, method, queryData = {}, updateData = {} }) => {
	return client.connect('mongodb://127.0.0.1:27017/talkscript').then((db) => {
		if(method == 'find')
			var promise = db.collection(col)[method](queryData).toArray();
		else if(method == 'update')
			var promise = db.collection(col)[method](queryData, updateData, {
				multi: true
			});
		else if(method == 'delete')
			var promise = db.collection(col)[method](queryData);
		else if(method == 'insert')
			var promise = db.collection(col)[method](updateData);
		else {
			let err = `${method} is not allowed`;
			console.log(err);
			var promise = new Promise((resolve, reject) => {
				reject(err);
			});
		}
		return promise;
	}, (err) => {
		console.log(err);	
	});
};

let mongoErrHandler = (res) => {
	return function (err) {
		res.json({ result: 'fail', code: err });
	};
};

export { mongo, mongoErrHandler };