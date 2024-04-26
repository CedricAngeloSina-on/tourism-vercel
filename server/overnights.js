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

// Total Overnights
router.post("/get_overnights", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsNights"
    );
});

router.post("/get_last_year_overnights", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)"
    );
});

router.post("/get_last_year_overnights_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getTotalbyArea(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(totalGuestsNights)",
        areaID
    );
});

router.post("/get_domestic_overnights", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsNights"
    );
});

router.post("/get_foreign_overnights", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getStatisticsByFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "foreignGuestsNights"
    );
});

router.post("/get_overnights_by_establishment", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTopGuestsPerformerFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsNights"
    );
});

router.post("/get_overnights_by_AE", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTopAEPerformerFilter(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsNights"
    );
});

//////////////////////////////////////////////////

router.post("/get_overnights_by_sex_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartBySex(
        req,
        res,
        filterType,
        filterValue,
        year,
        "maleDomesticOvernights + maleForeignOvernights",
        "femaleDomesticOvernights + femaleForeignOvernights"
    );
});

router.post("/get_overnights_by_sex_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartBySex(
        req,
        res,
        filterType,
        filterValue,
        year,
        "maleDomesticOvernights + maleForeignOvernights",
        "femaleDomesticOvernights + femaleForeignOvernights",
        areaID
    );
});

router.post("/get_overnights_by_origin_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsNights",
        "foreignGuestsNights"
    );
});

router.post("/get_overnights_by_origin_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByOrigin(
        req,
        res,
        filterType,
        filterValue,
        year,
        "domesticGuestsNights",
        "foreignGuestsNights",
        areaID
    );
});

router.post("/get_overnights_by_aetypes_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsNights"
    );
});

router.post("/get_overnights_by_aetypes_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByAETypes(
        req,
        res,
        filterType,
        filterValue,
        year,
        "totalGuestsNights",
        areaID
    );
});

export default router;
