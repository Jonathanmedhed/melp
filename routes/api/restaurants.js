const express = require('express');
const router = express.Router();

const request = require('request');

// @route   GET api/restaurants
// @desc    return restaurants
// @access  Public
router.get('/', async (req, res) => {
	try {
		request.get(
			{
				url: 'https://recruiting-datasets.s3.us-east-2.amazonaws.com/data_melp.json',
				headers: {
					'content-type': 'application/json',
				},
			},
			(error, response, body) => {
				const data = JSON.parse(body);
				res.send(data);
			}
		);
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;