import express from "express";
import db from "./database.js";
const router = express.Router();

//LOCATIONS
router.post("/get_locations", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getLocations(req, res, filterType, filterValue);
});

router.post("/get_locations_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getLocations(req, res, filterType, filterValue, areaID);
});

//ALOS
router.post("/get_alos_heatmap", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getHeatmapALOSorOR(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)"
    );
});

router.post("/get_alos_heatmap_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getHeatmapALOSorOR(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)",
        areaID
    );
});

//OR
router.post("/get_occupancy_rate_heatmap", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getHeatmapALOSorOR(
        req,
        res,
        filterType,
        filterValue,
        year,
        "(SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100"
    );
});

router.post("/get_occupancy_rate_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getHeatmapALOSorOR(
        req,
        res,
        filterType,
        filterValue,
        year,
        "(SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100",
        areaID
    );
});

//LOCAL
router.post("/get_local_scatterplot", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        year,
        `SUM(NCR) AS NCR,
        SUM(CAR) AS CAR,
        SUM(R1) AS R1,
        SUM(R2) AS R2,
        SUM(R3) AS R3,
        SUM(R4A) AS R4A,
        SUM(R4B) AS R4B,
        SUM(R5) AS R5,
        SUM(R6) AS R6,
        SUM(R7) AS R7,
        SUM(R8) AS R8,
        SUM(R9) AS R9,
        SUM(R10) AS R10,
        SUM(R11) AS R11,
        SUM(R12) AS R12,
        SUM(R13) AS R13,
        SUM(BARMM) AS BARMM`
    );
});

router.post("/get_foreign_scatterplot", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        year,
        "foreign_countries"
    );
});

//ORIGIN
router.post("/get_local_scatterplot_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        year,
        `SUM(NCR) AS NCR,
        SUM(CAR) AS CAR,
        SUM(R1) AS R1,
        SUM(R2) AS R2,
        SUM(R3) AS R3,
        SUM(R4A) AS R4A,
        SUM(R4B) AS R4B,
        SUM(R5) AS R5,
        SUM(R6) AS R6,
        SUM(R7) AS R7,
        SUM(R8) AS R8,
        SUM(R9) AS R9,
        SUM(R10) AS R10,
        SUM(R11) AS R11,
        SUM(R12) AS R12,
        SUM(R13) AS R13,
        SUM(BARMM) AS BARMM`,
        areaID
    );
});

router.post("/get_foreign_scatterplot_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getScatterPlot(
        req,
        res,
        filterType,
        filterValue,
        year,
        "foreign_countries",
        areaID
    );
});

function getHeatmapALOSorOR(
    req,
    res,
    filterType,
    filterValue,
    year,
    columnName,
    areaID = null
) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";

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
        establishments.establishmentName,
        establishments.coorLat,
        establishments.coorLng,
        IFNULL((${columnName}), 0) AS 'TOTAL'
    FROM
        entry_forms
        INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
    WHERE ${whereClause} AND YEAR(entry_forms.date) = ?
    GROUP BY establishmentID`,
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

function getScatterPlot(
    req,
    res,
    filterType,
    filterValue,
    year,
    columnName,
    areaID = null
) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";

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
    WHERE ${whereClause} AND YEAR(market_segments.date) = ?`,
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

function getLocations(req, res, filterType, filterValue, areaID = null) {
    let whereClause = `${filterType} = ?`;
    let areaClause = "";

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
        establishments.establishmentName, 
        ae_types.aeName,
        establishments.coorLat,
        establishments.coorLng
    FROM
        establishments
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
    WHERE ${whereClause} AND establishments.coorLat IS NOT NULL AND establishments.coorLng IS NOT NULL`,
        areaID ? [filterValue, areaID] : [filterValue],
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
