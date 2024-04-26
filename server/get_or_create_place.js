import express from "express";

import db from "./database.js";

const router = express.Router();

//create municipalities
router.post("/create_municipality", (req, res) => {
	const { municipalityName, provinceID } = req.body;
	// Query the database to retrieve all accounts
	db.query(
		"INSERT INTO `municipalities` (`municipalityName`, `provinceID`) VALUES (?, ?)",
		[municipalityName, provinceID],
		(error, results) => {
			if (error) {
				console.error("Database error: " + error.message);
				return res
					.status(500)
					.json({ message: "Internal server error" });
			}

			// Return the list of accounts as a JSON response
			res.status(200).json(results);
		}
	);
});

//create establishments
router.post("/create_establishment", (req, res) => {
	const { establishmentName, municipalityID, aeTypeID, coorLat, coorLng } =
		req.body;
	// Query the database to retrieve all accounts
	db.query(
		"INSERT INTO `establishments` (`establishmentName`, `municipalityID`, `aeTypeID`, `coorLat`, `coorLng`) VALUES (?, ?, ?, ?, ?)",
		[establishmentName, municipalityID, aeTypeID, coorLat, coorLng],
		(error, results) => {
			if (error) {
				console.error("Database error: " + error.message);
				return res
					.status(500)
					.json({ message: "Internal server error" });
			}

			// Return the list of accounts as a JSON response
			res.status(200).json(results);
		}
	);
});

//get all municipalities
router.post("/get_municipalities", (req, res) => {
	const { provinceID } = req.body;
	// Query the database to retrieve all accounts
	db.query(
		"SELECT id, municipalityName FROM `municipalities` WHERE provinceID = ? ORDER BY id",
		[provinceID],
		(error, results) => {
			if (error) {
				console.error("Database error: " + error.message);
				return res
					.status(500)
					.json({ message: "Internal server error" });
			}

			// Return the list of accounts as a JSON response
			res.status(200).json(results);
		}
	);
});

//get all establishments
router.post("/get_establishments", (req, res) => {
	const { municipalityID } = req.body;
	// Query the database to retrieve all accounts
	db.query(
		"SELECT id, establishmentName FROM `establishments` WHERE `municipalityID` = ? ORDER BY id",
		[municipalityID],
		(error, results) => {
			if (error) {
				console.error("Database error: " + error.message);
				return res
					.status(500)
					.json({ message: "Internal server error" });
			}

			// Return the list of accounts as a JSON response
			res.status(200).json(results);
		}
	);
});

export default router;
