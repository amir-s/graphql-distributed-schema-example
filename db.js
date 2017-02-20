const Sequelize = require('sequelize');

const db = new Sequelize('db', null, null, {
	dialect: 'sqlite',
	storage: './mydb.sqlite',
	logging: false
});

db.types = Sequelize;

module.exports = db;
