const jwt = require('jsonwebtoken');
var response = require('../models/Response');
const Config = require('../config');

module.exports = (req, res, next) => {
	const token = req.headers['x-access-token'] || req.body.token || req.query.token

	if (token) {
		jwt.verify(token, Config.token_secret_key, (err, decoded) => {
			if (err) {
				res.json(response.setError(99, "Failed to authenticate token.", 'Account service error.'));
			} else {
				req.decode = decoded;
				next();
			}
		});
	} else {
		res.json(response.setError(99, "No token provided.", 'Account service error.'));
	}
};