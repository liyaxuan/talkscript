import { load } from './preload';

function ajax({method, url, param = {}, data, succ, fail}) {
	let resource = Vue.resource(url);
	if(method == 'save' || method == 'update') {
		// let requestBody = new FormData();
		// for(let attribute in data )
		// 	requestBody.append(attribute, data[attribute]);

		resource[method](param, data).then(succ, fail);
	}
	else
		resource[method](param).then(succ, fail);	
};

let Login = load('src/view/login.html').then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			data: function () {
				return {
					username: '19290000',
					password: '520779',
					option: 'teacher'
				};
			},
			template: html,
			methods: {
				select: function (identity, event) {
					$('.radio > .btn').removeClass('selected');
					$(event.target).addClass('selected');
					this.option = identity;
				},
				login: function () {
					ajax({
						method: 'save',
						url: '/login',
						param: { option: this.option },
						data: {
							username: this.username,
							password: this.password
						},
						succ: (response) => {
							let data = response.data;
							if(data.result == 'success') {
								router.go({ path: '/home' });
								localStorage.setItem('tid', this.tid);
							}
							else
								alert('用户名或密码错误');
						},
						fail: (response) => {

						}
					});
				}
			}
		}));
	});
});

let admin = 'src/view/admin';
let teacher = 'src/view/teacher';

let AdminHome = load(`${admin}/home.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			template: html
		}));
	});
});

let AdminLesson = load(`${admin}/lesson.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			template: html
		}));
	});
});

let Register = load(`${admin}/register.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			data: function () {
				return { tid: '1929000', name: 'dsafdas', phone: 'sdafadsf', pwd: 'asdfasdf' };
			},
			template: html,
			methods: {
				register: function () {
					let _this = this;
					ajax({
						method: 'save',
						url: '/register',
						data: { tid: _this.tid, name: _this.name, phone: _this.phone, pwd: _this.pwd },
						succ: (response) => {

						}
					})
				}
			}
		}));		
	})
});

let TeacherHome = load(`${teacher}/home.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			template: html
		}));
	});
});

let TeacherLesson = load(`${teacher}/lesson.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			data: function () {
				return {
					list: [],
					isWarn: false
				};
			},
			template: html,
			ready: function () {
				let _this = this;

				ajax({
					method: 'get',
					url: '/lesson',
					param:  { tid: localStorage.getItem('tid') },
					succ: function (response) {
						/*视图载入后立刻ajax, 如果返回的不是空数组
						关闭警告, 赋值model中的list*/
						if(response.data.list.length != 0){
							_this.list = response.data.list;
						}
						else {
							_this.isWarn = true;
						}
					},
					fail: function (response) {

					}
				});
			}
		}));
	});
});

let Student = load(`${teacher}/student.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			template: html
		}));
	});
});

let Teach = load(`${teacher}/teach.html`).then((html) => {
	return new Promise((resolve) => {
		resolve(Vue.extend({
			template: html
		}));
	});
});

Promise.all([Login, AdminHome, AdminLesson, Register,
	TeacherHome, TeacheerLesson, Student, Teach])
.then(([Login, AdminHome, AdminLesson, Register,
	TeacherHome, TeacheerLesson, Student, Teach]) => {
		let App = Vue.extend({});

		let router = new VueRouter();

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