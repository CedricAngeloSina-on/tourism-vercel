import express from "express";

import { getStatisticsByAverage } from "./filter.js";
import {
    generateALOSandORBarchartByOverall,
    generateORBarChartByAETypes,
} from "./barchart.js";
import { getTotalbyArea } from "./last_year_total.js";

const router = express.Router();
router.post("/get_occupancy_rate", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByAverage(
        req,
        res,
        filterType,
        filterValue,
        year,
        "(SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100"
    );
});

router.post("/get_last_year_occupancy_rate", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "(SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100"
    );
});

router.post("/get_last_year_occupancy_rate_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "(SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100",
        areaID
    );
});

router.post("/get_occupancy_rate_by_overall_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL(((SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100), 0) AS 'Occupancy Rate'"
    );
});

router.post("/get_occupancy_rate_by_overall_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL(((SUM(numberOfOccupiedRooms)/SUM(numberOfRoomsForTheMonth)) * 100), 0) AS 'Occupancy Rate'",
        areaID
    );
});

router.post("/get_occupancy_rate_by_aetypes_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateORBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "numberOfOccupiedRooms",
        "numberOfRoomsForTheMonth"
    );
});

router.post("/get_occupancy_rate_by_aetypes_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateORBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "numberOfOccupiedRooms",
        "numberOfRoomsForTheMonth",
        areaID
    );
});

export default router;
