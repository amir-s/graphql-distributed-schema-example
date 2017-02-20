const db = require('./db');
const graph = require('graphql-dschema');

const User = db.models.user;
const Permission = db.define('permission', {
	label: {
		type: db.types.STRING,
		unique: true
	}
});

Permission.belongsToMany(User, { through: 'UserPermission' });
User.belongsToMany(Permission, { through: 'UserPermission' });

graph.type('permissionType', {
	name: 'Permission',
	fields: () => ({
		id: {type: graph.ql.GraphQLInt},
		label: {type: graph.ql.GraphQLString}
	})
});

graph.type('userType').extend(() => ({
	permissions: {
		type: new graph.ql.GraphQLList(graph.type('permissionType')),
		resolve: (user) => user.getPermissions()
	}
}));

module.exports = Permission;
