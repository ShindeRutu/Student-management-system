/** @format */

const express = require("express");
const router = express.Router();
const Section = require("../models/Other/Section");

router.get("/getSection", async (req, res) => {
	try {
		let sections = await Section.find();

		const data = {
			success: true,
			message: "All Sections Loaded!",
			sections,
		};
		res.json(data);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.post("/addSection", async (req, res) => {
	let { name } = req.body;
	try {
		let section = await Section.findOne({ name });
		if (section) {
			const data = {
				success: false,
				message: "Already Exists!",
			};
			res.status(400).json(data);
		} else {
			await Section.create(req.body);
			const data = {
				success: true,
				message: "Section Added!",
			};
			res.json(data);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.delete("/deleteSection/:id", async (req, res) => {
	try {
		let mark = await Section.findByIdAndDelete(req.params.id);
		if (!mark) {
			return res
				.status(400)
				.json({ success: false, message: "No Section Data Exists!" });
		}
		const data = {
			success: true,
			message: "Section Deleted!",
		};
		res.json(data);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});
module.exports = router;
