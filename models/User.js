const Sequelize = require('sequelize');

const db = require('../config/database');

const User = db.define('user', {
    name: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
    phone: {type: Sequelize.STRING},
    age: {type: Sequelize.INTEGER},
    state: {type: Sequelize.STRING},
    img: {type: Sequelize.STRING},
});


module.exports = User;