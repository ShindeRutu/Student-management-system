/** @format */

const mongoose = require("mongoose");

const Semester = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Semester", Semester);
