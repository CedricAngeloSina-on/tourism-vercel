import express from "express";

import db from "./database.js";

const router = express.Router();

//OVERALL
router.post("/get_ages_overall", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getAges(req, res, filterType, filterValue, null, year);
});

router.post("/get_ages_overall_by_month", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getAges(req, res, filterType, filterValue, month, year);
});

router.post("/get_ages_overall_by_area", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getAges(req, res, filterType, filterValue, null, year, areaID);
});

router.post("/get_ages_overall_by_area_by_month", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getAges(req, res, filterType, filterValue, month, year, areaID);
});

function getAges(
    req,
    res,
    filterType,
    filterValue,
    month = null,
    year,
    areaID = null
) {
    let whereClause = `${filterType} = ? AND YEAR(market_segments.date) = ?`;
    let areaClause = "";

    if (month) {
        whereClause += ` AND MONTHNAME(market_segments.date) = ? `;
    }

    if (areaID) {
        if (filterType === "provinces.id") {
            areaClause = `AND municipalities.id = ${areaID}`;
        } else if (filterType === "municipalities.id") {
            areaClause = `AND establishments.id = ${areaID}`;
        }
        whereClause += ` ${areaClause}`;
    }

    db.query(
        `SELECT
            IFNULL(SUM(children), 0) AS 'Children (0 - 12 Years)',
            IFNULL(SUM(teenagers), 0) AS 'Teenagers (13 - 17 Years)',
            IFNULL(SUM(youngAdults), 0) AS 'Young Adults (18 - 35 Years)',
            IFNULL(SUM(adults), 0) AS 'Adults (36 - 64 Years)',
            IFNULL(SUM(seniors), 0) AS 'Seniors (65 or Above)'
        FROM market_segments
        INNER JOIN establishments ON market_segments.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause}`,
        areaID
            ? [filterValue, year, month, areaID]
            : [filterValue, year, month],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }
            res.status(200).json(results);
        }
    );
}

export default router;
