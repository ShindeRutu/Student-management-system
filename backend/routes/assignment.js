/** @format */

const express = require("express");
const router = express.Router();
const Assignment = require("../models/Other/Assignment");

router.post("/getAssignment", async (req, res) => {
	try {
		let assignment = await Assignment.find(req.body);
		if (!assignment) {
			return res
				.status(400)
				.json({ success: false, message: "No Assignment Available!" });
		}
		res.json({ success: true, message: "Assignment Found!", assignment });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/addAssignment", async (req, res) => {
	let { faculty, link, assignmentNumber, section, semester, subject, title } =
		req.body;
	try {
		await Assignment.create({
			faculty,
			link,
			section,
			semester,
			assignmentNumber,
			subject,
			title,
		});
		const data = {
			success: true,
			message: "Assignment Added!",
		};
		res.json(data);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.post("/updateAssignment/:id", async (req, res) => {
	let { faculty, link, subject, assignmentNumber, section, semester, title } =
		req.body;
	try {
		let assignment = await Assignment.findByIdAndUpdate(req.params.id, {
			faculty,
			section,
			semester,
			link,
			assignmentNumber,
			subject,
			title,
		});
		if (!assignment) {
			return res
				.status(400)
				.json({ success: false, message: "No Assignment Available!" });
		}
		res.json({
			success: true,
			message: "Assignment Updated!",
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.delete("/deleteAssignment/:id", async (req, res) => {
	try {
		let assignment = await Assignment.findByIdAndDelete(req.params.id);
		if (!assignment) {
			return res
				.status(400)
				.json({ success: false, error: "No Assignment Available!" });
		}
		res.json({
			success: true,
			message: "Assignment Deleted!",
			assignment,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
