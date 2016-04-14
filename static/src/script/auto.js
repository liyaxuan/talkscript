(function () {
	var meta = document.createElement('meta');
	meta.setAttribute('name', 'viewport');
	var rate = (document.documentElement || document.body).clientWidth/320;

	meta.setAttribute('content', 'width=device-width, maximum-scale=' + rate + ', minimum-scale=' + rate + ', user-scalable=no');

	var head = document.getElementsByTagName('head')[0];
	head.appendChild(meta);	
})();