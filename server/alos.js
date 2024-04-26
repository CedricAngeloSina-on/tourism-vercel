import express from "express";

import { getStatisticsByAverage } from "./filter.js";
import {
    generateALOSandORBarchartByOverall,
    generateALOSandORBarChartByOrigin,
    generateBarChartByAETypes,
} from "./barchart.js";
import { getTotalbyArea } from "./last_year_total.js";

const router = express.Router();

// Total ALOS
router.post("/get_alos", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByAverage(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)"
    );
});

router.post("/get_alos_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getStatisticsByAverage(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)",
        areaID
    );
});

router.post("/get_last_year_alos", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)"
    );
});

router.post("/get_last_year_alos_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)/SUM(totalGuestsArrivals)",
        areaID
    );
});

router.post("/get_alos_by_overall_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL(SUM(totalGuestsNights)/SUM(totalGuestsArrivals), 0) AS 'Average Length of Stay (Days)'"
    );
});

router.post("/get_alos_by_overall_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL(SUM(totalGuestsNights)/SUM(totalGuestsArrivals), 0) AS 'Average Length of Stay (Days)'",
        areaID
    );
});

router.post("/get_alos_by_origin_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateALOSandORBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(domesticGuestsNights)/SUM(domesticGuestsArrivals)",
        "SUM(foreignGuestsNights)/SUM(foreignGuestsArrivals)"
    );
});

router.post("/get_alos_by_origin_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateALOSandORBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(domesticGuestsNights)/SUM(domesticGuestsArrivals)",
        "SUM(foreignGuestsNights)/SUM(foreignGuestsArrivals)",
        areaID
    );
});

router.post("/get_alos_by_aetypes_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalALOS"
    );
});

router.post("/get_alos_by_aetypes_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalALOS",
        areaID
    );
});

//PREDICT
/////////////////////////////
router.post("/get_predict_alos_by_overall_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(totalGuestsNights)/SUM(totalGuestsArrivals) )), 0) AS 'Average Length of Stay (Days)'"
    );
});

router.post("/get_predict_alos_by_overall_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateALOSandORBarchartByOverall(
        req,
        res,
        filterType,
        filterValue,
        year,
        "IFNULL( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(totalGuestsNights)/SUM(totalGuestsArrivals) )), 0) AS 'Average Length of Stay (Days)'",
        areaID
    );
});

router.post("/get_predict_alos_by_origin_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateALOSandORBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(domesticGuestsNights)/SUM(domesticGuestsArrivals)) )",
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(foreignGuestsNights)/SUM(foreignGuestsArrivals)) )"
    );
});

router.post("/get_predict_alos_by_origin_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateALOSandORBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(domesticGuestsNights)/SUM(domesticGuestsArrivals)) )",
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / (SUM(foreignGuestsNights)/SUM(foreignGuestsArrivals)) )",
        areaID
    );
});

router.post("/get_predict_alos_by_aetypes_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / totalALOS )"
    );
});

router.post("/get_predict_alos_by_aetypes_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / ( ( numberOfRooms * averageOccupancyRate * averageNumberOfGuestRooms * dayofmonth(last_day(date)) ) / totalALOS )",
        areaID
    );
});

export default router;
