import express from "express";

import db from "./database.js";

const router = express.Router();

//OVERALL
router.post("/get_sex_overall", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getSex(req, res, filterType, filterValue, null, year);
});

router.post("/get_sex_overall_by_month", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getSex(req, res, filterType, filterValue, month, year);
});

router.post("/get_sex_overall_by_area", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getSex(req, res, filterType, filterValue, null, year, areaID);
});

router.post("/get_sex_overall_by_area_by_month", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getSex(req, res, filterType, filterValue, month, year, areaID);
});

let local = `IFNULL(SUM(NCR), 0) AS NCR,
IFNULL(SUM(CAR), 0) AS CAR,
IFNULL(SUM(R1), 0) AS 'Region I',
IFNULL(SUM(R2), 0) AS 'Region II',
IFNULL(SUM(R3), 0) AS 'Region III',
IFNULL(SUM(R4A), 0) AS 'Region IV-A',
IFNULL(SUM(R4B), 0) AS 'Region IV-B',
IFNULL(SUM(R5), 0) AS 'Region V',
IFNULL(SUM(R6), 0) AS 'Region VI',
IFNULL(SUM(R7), 0) AS 'Region VII',
IFNULL(SUM(R8), 0) AS 'Region VIII',
IFNULL(SUM(R9), 0) AS 'Region IX',
IFNULL(SUM(R10), 0) AS 'Region X',
IFNULL(SUM(R11), 0) AS 'Region XI',
IFNULL(SUM(R12), 0) AS 'Region XII',
IFNULL(SUM(R13), 0) AS 'Region XIII',
IFNULL(SUM(BARMM), 0) AS BARMM`;

// //LOCAL
router.post("/get_local", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getScatterPlot(req, res, filterType, filterValue, local, null, year);
});

router.post("/get_local_by_month", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getScatterPlot(req, res, filterType, filterValue, local, month, year);
});

router.post("/get_local_by_area", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        local,
        null,
        year,
        areaID
    );
});

router.post("/get_local_by_area_by_month", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        local,
        month,
        year,
        areaID
    );
});

// //FOREIGN
router.post("/get_foreign", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        null,
        year
    );
});

router.post("/get_foreign_by_month", (req, res) => {
    const { filterType, filterValue, month, year } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        month,
        year
    );
});

router.post("/get_foreign_by_area", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        null,
        year,
        areaID
    );
});

router.post("/get_foreign_by_area_by_month", (req, res) => {
    const { filterType, filterValue, month, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        month,
        year,
        areaID
    );
});

function getSex(
    req,
    res,
    filterType,
    filterValue,
    month = null,
    year,
    areaID = null
) {
    let whereClause = `${filterType} = ? AND YEAR(entry_forms.date) = ?`;
    let areaClause = "";

    if (month) {
        whereClause += ` AND MONTHNAME(entry_forms.date) = ? `;
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
            IFNULL(SUM(maleDomesticArrivals), 0) AS 'Domestic Male Tourists',
            IFNULL(SUM(femaleDomesticArrivals), 0) AS 'Domestic Female Tourists',
            IFNULL(SUM(maleForeignArrivals), 0) AS 'Foreign Male Tourists',
            IFNULL(SUM(femaleForeignArrivals), 0) AS 'Foreign Female Tourists'
        FROM entry_forms
        INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
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

function getScatterPlot(
    req,
    res,
    filterType,
    filterValue,
    columnName,
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
        ${columnName}
    FROM
        market_segments
        INNER JOIN establishments ON market_segments.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
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
