import express from "express";

import db from "./database.js";

const router = express.Router();

router.post("/get_forecasting_jobs", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getJobs(req, res, filterType, filterValue, year);
});

router.post("/get_forecasting_jobs_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getJobs(req, res, filterType, filterValue, year, areaID);
});

router.post("/get_forecasting_ages", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getAges(req, res, filterType, filterValue, year);
});

router.post("/get_forecasting_ages_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getAges(req, res, filterType, filterValue, year, areaID);
});

router.post("/get_forecasting_sex", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getSex(req, res, filterType, filterValue, year);
});

router.post("/get_forecasting_sex_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getSex(req, res, filterType, filterValue, year, areaID);
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

router.post("/get_forecasting_local", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getRegionPoints(req, res, filterType, filterValue, local, year);
});

router.post("/get_forecasting_local_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getRegionPoints(req, res, filterType, filterValue, local, year, areaID);
});

router.post("/get_forecasting_foreign", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getRegionPoints(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        year
    );
});

router.post("/get_forecasting_foreign_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getRegionPoints(
        req,
        res,
        filterType,
        filterValue,
        "foreign_countries",
        year,
        areaID
    );
});

function getJobs(req, res, filterType, filterValue, year, areaID = null) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";
    let grouping = "";

    if (areaID) {
        if (filterType === "provinces.id") {
            areaClause = `AND municipalities.id = ${areaID}`;
        } else if (filterType === "municipalities.id") {
            areaClause = `AND establishments.id = ${areaID}`;
        }
        whereClause += ` ${areaClause}`;
    }

    let orderby = `GroupBy`;

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        grouping = "YEAR";
        whereClause += ` AND YEAR(employee_workforce.date) = ?`;
        orderby = `YEAR(employee_workforce.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            jobs, 
            wantedJobs,
            IFNULL(${grouping}(employee_workforce.date), ${year}) AS GroupBy
        FROM
            employee_workforce
            INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause}
        ORDER BY ${orderby}`,
        areaID ? [filterValue, year, areaID] : [filterValue, year],
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

function getAges(req, res, filterType, filterValue, year, areaID = null) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";
    let grouping = "";

    if (areaID) {
        if (filterType === "provinces.id") {
            areaClause = `AND municipalities.id = ${areaID}`;
        } else if (filterType === "municipalities.id") {
            areaClause = `AND establishments.id = ${areaID}`;
        }
        whereClause += ` ${areaClause}`;
    }

    let orderby = `GroupBy`;

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        grouping = "YEAR";
        whereClause += ` AND YEAR(market_segments.date) = ?`;
        orderby = `YEAR(market_segments.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(market_segments.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(market_segments.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            IFNULL(SUM(children), 0) AS 'Children (0 - 12 Years)',
            IFNULL(SUM(teenagers), 0) AS 'Teenagers (13 - 17 Years)',
            IFNULL(SUM(youngAdults), 0) AS 'Young Adults (18 - 35 Years)',
            IFNULL(SUM(adults), 0) AS 'Adults (36 - 64 Years)',
            IFNULL(SUM(seniors), 0) AS 'Seniors (65 or Above)',
            IFNULL(${grouping}(market_segments.date), ${year}) AS GroupBy
        FROM market_segments
        INNER JOIN establishments ON market_segments.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause}
        GROUP BY GroupBy
        ORDER BY ${orderby}`,
        areaID ? [filterValue, year, areaID] : [filterValue, year],
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

function getSex(req, res, filterType, filterValue, year, areaID = null) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";
    let grouping = "";

    if (areaID) {
        if (filterType === "provinces.id") {
            areaClause = `AND municipalities.id = ${areaID}`;
        } else if (filterType === "municipalities.id") {
            areaClause = `AND establishments.id = ${areaID}`;
        }
        whereClause += ` ${areaClause}`;
    }

    let orderby = `GroupBy`;

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        grouping = "YEAR";
        whereClause += ` AND YEAR(entry_forms.date) = ?`;
        orderby = `YEAR(entry_forms.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(entry_forms.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(entry_forms.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            IFNULL(SUM(maleDomesticArrivals), 0) AS 'Domestic Male Tourists',
            IFNULL(SUM(femaleDomesticArrivals), 0) AS 'Domestic Female Tourists',
            IFNULL(SUM(maleForeignArrivals), 0) AS 'Foreign Male Tourists',
            IFNULL(SUM(femaleForeignArrivals), 0) AS 'Foreign Female Tourists',
            IFNULL(${grouping}(entry_forms.date), ${year}) AS GroupBy
        FROM entry_forms
        INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause}`,
        areaID ? [filterValue, year, areaID] : [filterValue, year],
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

function getRegionPoints(
    req,
    res,
    filterType,
    filterValue,
    columnName,
    year,
    areaID = null
) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";
    let grouping = "";

    if (areaID) {
        if (filterType === "provinces.id") {
            areaClause = `AND municipalities.id = ${areaID}`;
        } else if (filterType === "municipalities.id") {
            areaClause = `AND establishments.id = ${areaID}`;
        }
        whereClause += ` ${areaClause}`;
    }

    let orderby = `GroupBy`;

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        grouping = "YEAR";
        whereClause += ` AND YEAR(market_segments.date) = ?`;
        orderby = `YEAR(market_segments.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(market_segments.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(market_segments.date) LIMIT 10`;
    }
    db.query(
        `SELECT
        ${columnName},
        IFNULL(${grouping}(market_segments.date), ${year}) AS GroupBy
    FROM
        market_segments
        INNER JOIN establishments ON market_segments.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
        WHERE ${whereClause}`,
        areaID ? [filterValue, year, areaID] : [filterValue, year],
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
