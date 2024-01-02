/** @format */

const express = require("express");
const router = express.Router();
const Semester = require("../models/Other/Semester");

router.get("/getSemester", async (req, res) => {
	try {
		let semesters = await Semester.find();

		const data = {
			success: true,
			message: "All Semesters Loaded!",
			semesters,
		};
		res.json(data);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.post("/addSemester", async (req, res) => {
	let { name } = req.body;
	try {
		let semester = await Semester.findOne({ name });
		if (semester) {
			const data = {
				success: false,
				message: "Already Exists!",
			};
			res.status(400).json(data);
		} else {
			await Semester.create(req.body);
			const data = {
				success: true,
				message: "Semester Added!",
			};
			res.json(data);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.delete("/deleteSemester/:id", async (req, res) => {
	try {
		let mark = await Semester.findByIdAndDelete(req.params.id);
		if (!mark) {
			return res
				.status(400)
				.json({ success: false, message: "No Semester Data Exists!" });
		}
		const data = {
			success: true,
			message: "Semester Deleted!",
		};
		res.json(data);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});
module.exports = router;
