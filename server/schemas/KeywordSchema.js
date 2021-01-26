const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	id: {type: String, unique: true},
	keyword: {type: String, unique: true},
	users: Array
})

module.exports = mongoose.model('Keywords', schema);