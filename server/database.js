const mongoose = require('mongoose');
const {v4: uuid} = require('uuid');

const Keyword = require('./schemas/KeywordSchema');
const Whitelist = require('./schemas/WhitelistSchema');

// Connect to database
mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})

// Create connection
mongoose.connection.on('error', function (err) {
	console.error(err)
})

exports.addKeyword = function (author, user_keyword, server_id, callback) {
	Keyword.findOne({keyword: user_keyword, server_id: server_id}, function (err, keyword) {
		if (err) return callback(err);

		if (!keyword) {
			Keyword.create({
				id: uuid(),
				keyword: user_keyword,
				users: [author],
				server_id: server_id
			}, function (err) {
				if (err) return callback(err);

				callback(null)
			})
		} else {
			if (keyword.users.includes(author)) return callback("ERR_USER_ALREADY_SUBSCRIBED");

			Keyword.findOneAndUpdate({id: keyword.id}, {$push: {users: author}}, function (err) {
				if (err) return callback(err);

				callback(null);
			})
		}
	})
}

exports.removeKeyword = function (author, keyword, server_id, callback) {
	Keyword.findOne({keyword: keyword, server_id: server_id}, function (err, keyword) {
		if (err) return callback(err);
		if (!keyword.users.includes(author)) return callback("ERR_USER_NOT_SUBSCRIBED");

		if (keyword.users.length === 1) {
			Keyword.deleteOne({id: keyword.id}, function (err) {
				if (err) return callback(err);

				callback(null);
			})
		} else {
			Keyword.findOneAndUpdate({id: keyword.id}, {$pull: {users: author}}, function (err) {
				if (err) return callback(err);

				callback(null);
			})
		}
	})
}

exports.getUserKeywords = function (id, server_id, callback) {
	Keyword.find({server_id: server_id}, function (err, keywords) {
		if (err) return callback(err);
		let user_keywords = [];

		keywords.forEach(result => {
			if (result.users.includes(id)) user_keywords.push(result.keyword);
		})

		callback(null, user_keywords);
	})
}

exports.getAllKeywords = function (server_id, callback) {
	Keyword.find({server_id: server_id}, function (err, keywords) {
		if (err) return callback(err);

		callback(null, keywords);
	})
}

exports.addChannel = function(server_id, value, callback) {
	Whitelist.findOne({server: server_id}, function (err, setting) {
		if (err) return callback(err);

		if (!setting) {
			Whitelist.create({
				setting: 'whitelist',
				server: server_id,
				value: [value]
			}, function (err) {
				if (err) return callback(err);

				callback(null);
			})
		} else {
			Whitelist.findOneAndUpdate({server: server_id}, {$push: {value: value}}, function (err) {
				if (err) return callback(err);

				callback(null);
			})
		}
	})
}

exports.getWhitelist = function (server_id, callback) {
	Whitelist.findOne({server: server_id}, function (err, whitelist) {
		if (err) return callback(err);

		callback(null, whitelist.value);
	})
}