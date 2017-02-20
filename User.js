const db = require('./db');
const graph = require('graphql-dschema');

const User = db.define('user', {
  name: db.types.STRING
});


graph.type('userType', {
	name: 'User',
	description: 'User Object',
	fields: () => ({
		id: {type: graph.ql.GraphQLInt},
		name: {type: graph.ql.GraphQLString}
	})
});


graph.type('query').extend(() => ({
	allUsers: {
		type: new graph.ql.GraphQLList(graph.type('userType')),
		resolve: () => User.findAll()
	}
}));

module.exports = User;
