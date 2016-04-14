let load = (path) => {
	if(window.template)
		if(window.template[path])
			return new Promise((resolve) => {
				console.log(`${path}`);
				resolve(window.template[path]);
			});
	else
		window.template = {};
	return new Promise((resolve) => {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if(xhr.readyState == 4)
				if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					window.template[path] = xhr.responseText;
					console.log(`${path} loaded`);
					resolve(xhr.responseText);
				}
		};
		xhr.open('get', path);
		xhr.send(null);
	});	
};

export { load };