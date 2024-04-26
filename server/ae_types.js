import express from "express";

import db from "./database.js";

const router = express.Router();

router.get("/get_aetypes", (req, res) => {
    // Query the database to retrieve all accounts
    db.query(
        "SELECT id, aeName FROM `ae_types` WHERE id != 0",
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
