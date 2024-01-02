/** @format */

const mongoose = require("mongoose");

const Section = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Section", Section);
