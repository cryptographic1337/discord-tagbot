const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	server: String,
	value: Array
})

module.exports = mongoose.model('Settings', schema);