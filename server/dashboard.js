import express from "express";

import db from "./database.js";

const router = express.Router();

router.post("/get_dashboard_name", (req, res) => {
    const { accountID, account_roleID } = req.body;

    db.query(
        `SELECT
        CASE
          WHEN accounts.account_roleID = 1 THEN provinces.provinceName
          WHEN accounts.account_roleID = 2 THEN municipalities.municipalityName
          WHEN accounts.account_roleID = 3 THEN establishments.establishmentName
          ELSE NULL
        END AS LocationName
      FROM
        accounts
      INNER JOIN
        establishments ON accounts.establishmentID = establishments.id
      INNER JOIN
        municipalities ON accounts.municipalityID = municipalities.id
      INNER JOIN
        provinces ON accounts.provinceID = provinces.id
      WHERE accounts.id = ? AND accounts.account_roleID = ?`,
        [accountID, account_roleID],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Return the sum as a JSON response
            res.status(200).json(results[0][`LocationName`]);
        }
    );
});

function getBarChart(req, res, filterType, filterValue, year, columnName) {
    let whereClause = `${filterType} = ?`;
    let grouping = "";

    let orderby = `GroupBy`;

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        grouping = "MONTHNAME";
        whereClause += ` AND YEAR(entry_forms.date) = ?`;
        orderby = `MONTH(entry_forms.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(entry_forms.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(entry_forms.date) LIMIT 10`;
    }

    db.query(
        `SELECT IFNULL(SUM(${columnName}), 0) AS TOTAL, ${grouping}(entry_forms.date) AS GroupBy
       FROM entry_forms
       INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
       INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
       INNER JOIN provinces ON municipalities.provinceID = provinces.id
       WHERE ${whereClause}
       GROUP BY GroupBy
       ORDER BY ${orderby}`,
        [filterValue, year],
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

router.post("/get_arrivals_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getBarChart(req, res, filterType, filterValue, year, "totalGuestsArrivals");
});

router.post("/get_overnights_barchart", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getBarChart(req, res, filterType, filterValue, year, "totalGuestsNights");
});

export default router;
