const app = require('koa')();
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const co = require('co');

const graph = require('graphql-dschema');
const db = require('./db');

const User = require('./User');
const Permission = require('./Permission');

const casual = require('casual');

// setup db
co(function*() {
	yield db.sync({force: true});

	let permissions = yield [
		Permission.create({
			label: 'read'
		}),
		Permission.create({
			label: 'write'
		}),
		Permission.create({
			label: 'execute'
		})
	];

	for (let i=0;i<5;i++) {
		let user = yield User.create({
			name: casual.name
		})
		yield user.setPermissions(permissions.filter(i => casual.boolean));
	}

	let users = yield User.findAll();
	for (let user of users) {
		let permissions = yield user.getPermissions();
		console.log(`${user.name} [${permissions.map(i => i.label).join(', ')}]`);
	}
}).catch(console.error);





const router = new Router();
router.all('/', graphqlHTTP({
	schema: graph.generate(),
	graphiql: true
}));


app
	.use(router.routes())
	.use(router.allowedMethods())
	
app.listen(3000, () => {
	console.log("Started server on port 3000");
});