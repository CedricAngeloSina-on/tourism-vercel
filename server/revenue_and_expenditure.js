import express from "express";

import db from "./database.js";
import { generateBarChartByRevenueAndExpenditure } from "./barchart.js";

const router = express.Router();

router.post("/get_revenue_and_expenditure_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    generateBarChartByRevenueAndExpenditure(
        req,
        res,
        filterType,
        filterValue,
        year,
        "revenue",
        "expenditure"
    );
});

router.post("/get_revenue_and_expenditure_by_area_barchart", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    generateBarChartByRevenueAndExpenditure(
        req,
        res,
        filterType,
        filterValue,
        year,
        "revenue",
        "expenditure",
        areaID
    );
});

export default router;
