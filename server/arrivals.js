import express from "express";

import db from "./database.js";
import {
    getStatisticsByFilter,
    getTopGuestsPerformerFilter,
    getTopAEPerformerFilter,
} from "./filter.js";
import {
    generateBarChartBySex,
    generateBarChartByOrigin,
    generateBarChartByAETypes,
} from "./barchart.js";
import { getTotalbyArea } from "./last_year_total.js";

const router = express.Router();

// Total Arrivals
router.post("/get_arrivals", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsArrivals"
    );
});

router.post("/get_last_year_arrivals", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsArrivals)"
    );
});

router.post("/get_last_year_arrivals_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsArrivals)",
        areaID
    );
});

// Domestic Arrivals
router.post("/get_domestic_arrivals", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsArrivals"
    );
});

// Foreign Arrivals
router.post("/get_foreign_arrivals", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "foreignGuestsArrivals"
    );
});

router.post("/get_arrivals_by_establishment", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTopGuestsPerformerFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsArrivals"
    );
});

router.post("/get_arrivals_by_AE", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTopAEPerformerFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsArrivals"
    );
});

router.post("/get_arrivals_by_sex_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartBySex(
        req,
        res,
        filterType,
        filterValue,
        year,
        "maleDomesticArrivals + maleForeignArrivals",
        "femaleDomesticArrivals + femaleForeignArrivals"
    );
});

router.post("/get_arrivals_by_sex_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartBySex(
        req,
        res,
        filterType,
        filterValue,
        year,
        "maleDomesticArrivals + maleForeignArrivals",
        "femaleDomesticArrivals + femaleForeignArrivals",
        areaID
    );
});

router.post("/get_arrivals_by_origin_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsArrivals",
        "foreignGuestsArrivals"
    );
});

router.post("/get_arrivals_by_origin_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsArrivals",
        "foreignGuestsArrivals",
        areaID
    );
});

router.post("/get_arrivals_by_aetypes_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsArrivals"
    );
});
router.post("/get_arrivals_by_aetypes_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsArrivals",
        areaID
    );
});

export default router;
