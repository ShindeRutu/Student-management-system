/** @format */

const mongoose = require("mongoose");

const Assignment = new mongoose.Schema(
	{
		faculty: {
			type: String,
			required: true,
		},
		section: {
			type: String,
			required: true,
		},
		semester: {
			type: Number,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		assignmentNumber: {
			type: Number,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Assignment", Assignment);
