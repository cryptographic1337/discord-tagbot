const mongoose = require('mongoose');
const {v4: uuid} = require('uuid');

const Keyword = require('./schemas/KeywordSchema');

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

exports.addKeyword = function (author, user_keyword, callback) {
	Keyword.findOne({keyword: user_keyword}, function (err, keyword) {
		if (err) return callback(err);

		if (!keyword) {
			Keyword.create({
				id: uuid(),
				keyword: user_keyword,
				users: [author]
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

exports.removeKeyword = function (author, keyword, callback) {
	Keyword.findOne({keyword: keyword}, function (err, keyword) {
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

exports.getAllKeywords = function (callback) {
	Keyword.find({}, function (err, keywords) {
		if (err) return callback(err);

		callback(null, keywords);
	})
}

exports.getUserKeywords = function (id, callback) {
	Keyword.find({}, function (err, keywords) {
		if (err) return callback(err);
		let user_keywords = [];

		keywords.forEach(result => {
			if (result.users.includes(id)) user_keywords.push(result.keyword);
		})

		callback(null, user_keywords);
	})
}