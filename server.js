var http=require("http");
var qs=require("querystring")
var server=http.createServer(function (req, res) {
	req.on("data", function (data) {
		console.log(qs.parse(decodeURIComponent(data)));
	});
	req.on("end", function () {
		console.log("It's end");
	});
}).listen(80);