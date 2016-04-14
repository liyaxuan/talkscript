'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _preload = require('./preload');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ajax(_ref) {
	var method = _ref.method;
	var url = _ref.url;
	var _ref$param = _ref.param;
	var param = _ref$param === undefined ? {} : _ref$param;
	var data = _ref.data;
	var succ = _ref.succ;
	var fail = _ref.fail;

	var resource = Vue.resource(url);
	if (method == 'save' || method == 'update') {
		// let requestBody = new FormData();
		// for(let attribute in data )
		// 	requestBody.append(attribute, data[attribute]);

		resource[method](param, data).then(succ, fail);
	} else resource[method](param).then(succ, fail);
};

var Login = (0, _preload.load)('src/view/login.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			data: function data() {
				return {
					username: '19290000',
					password: '520779',
					option: 'teacher'
				};
			},
			template: html,
			methods: {
				select: function select(identity, event) {
					$('.radio > .btn').removeClass('selected');
					$(event.target).addClass('selected');
					this.option = identity;
				},
				login: function login() {
					var _this2 = this;

					ajax({
						method: 'save',
						url: '/login',
						param: { option: this.option },
						data: {
							username: this.username,
							password: this.password
						},
						succ: function succ(response) {
							var data = response.data;
							if (data.result == 'success') {
								router.go({ path: '/home' });
								localStorage.setItem('tid', _this2.tid);
							} else alert('用户名或密码错误');
						},
						fail: function fail(response) {}
					});
				}
			}
		}));
	});
});

var admin = 'src/view/admin';
var teacher = 'src/view/teacher';

var AdminHome = (0, _preload.load)(admin + '/home.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			template: html
		}));
	});
});

var AdminLesson = (0, _preload.load)(admin + '/lesson.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			template: html
		}));
	});
});

var Register = (0, _preload.load)(admin + '/register.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			data: function data() {
				return { tid: '1929000', name: 'dsafdas', phone: 'sdafadsf', pwd: 'asdfasdf' };
			},
			template: html,
			methods: {
				register: function register() {
					var _this = this;
					ajax({
						method: 'save',
						url: '/register',
						data: { tid: _this.tid, name: _this.name, phone: _this.phone, pwd: _this.pwd },
						succ: function succ(response) {}
					});
				}
			}
		}));
	});
});

var TeacherHome = (0, _preload.load)(teacher + '/home.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			template: html
		}));
	});
});

var TeacherLesson = (0, _preload.load)(teacher + '/lesson.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			data: function data() {
				return {
					list: [],
					isWarn: false
				};
			},
			template: html,
			ready: function ready() {
				var _this = this;

				ajax({
					method: 'get',
					url: '/lesson',
					param: { tid: localStorage.getItem('tid') },
					succ: function succ(response) {
						/*视图载入后立刻ajax, 如果返回的不是空数组
      关闭警告, 赋值model中的list*/
						if (response.data.list.length != 0) {
							_this.list = response.data.list;
						} else {
							_this.isWarn = true;
						}
					},
					fail: function fail(response) {}
				});
			}
		}));
	});
});

var Student = (0, _preload.load)(teacher + '/student.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			template: html
		}));
	});
});

var Teach = (0, _preload.load)(teacher + '/teach.html').then(function (html) {
	return new _promise2.default(function (resolve) {
		resolve(Vue.extend({
			template: html
		}));
	});
});

_promise2.default.all([Login, AdminHome, AdminLesson, Register, TeacherHome, TeacheerLesson, Student, Teach]).then(function (_ref2) {
	var _ref3 = (0, _slicedToArray3.default)(_ref2, 8);

	var Login = _ref3[0];
	var AdminHome = _ref3[1];
	var AdminLesson = _ref3[2];
	var Register = _ref3[3];
	var TeacherHome = _ref3[4];
	var TeacheerLesson = _ref3[5];
	var Student = _ref3[6];
	var Teach = _ref3[7];

	var App = Vue.extend({});

	var router = new VueRouter();

	router.map({
		'/login': {
			component: Login
		},
		'/admin': {
			component: AdminHome,
			subRoutes: {
				'/register': {
					component: Register
				},
				'/lesson': {
					component: AdminLesson
				},
				'/teacher': {
					component: Teacher
				}
			}
		},
		'/teacher': {
			component: TeacherHome,
			subRoutes: {
				'/lesson': {
					component: TeacherLesson
				},
				'/student': {
					component: Student
				},
				'/teach': {
					component: Teach
				}
			}
		}
	});

	router.start(App, '.app');
});
//# sourceMappingURL=app.js.map
