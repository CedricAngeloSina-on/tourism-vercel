import db from "./database.js";

//current year data
export function getTotalbyArea(
    req,
    res,
    filterType,
    filterValue,
    year,
    column,
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

    if (year !== "Recent 5 Years" && year !== "Recent 10 Years") {
        whereClause += ` AND YEAR(entry_forms.date) = ?-1`;
    }

    db.query(
        `SELECT
            IFNULL(${column}, 0) AS TOTAL
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

            res.status(200).json(results[0][`TOTAL`]);
        }
    );
}

// export function getTotalByRevenueAndExpenditure(
//     req,
//     res,
//     filterType,
//     filterValue,
//     year,
//     grouping,
//     revenueColumn,
//     expenditureColumn,
//     areaID = null
// ) {
//     let whereClause = `${filterType} = ?`;
//     let areaClause = "";

//     if (areaID) {
//         if (filterType === "provinces.id") {
//             areaClause = `AND municipalities.id = ${areaID}`;
//         } else if (filterType === "municipalities.id") {
//             areaClause = `AND establishments.id = ${areaID}`;
//         }
//         whereClause += ` ${areaClause}`;
//     }
//     let orderby = `GroupBy`;
//     if (grouping === "MONTHNAME") {
//         whereClause += ` AND YEAR(entry_forms.date) = ?`;
//         orderby = `MONTH(entry_forms.date)`;
//     }

//     db.query(
//         `SELECT
//             IFNULL(SUM(${revenueColumn}), 0) AS Revenue,
//             IFNULL(SUM(${expenditureColumn}), 0) AS Expenditure,
//             ${grouping}(entry_forms.date) AS GroupBy
//         FROM
//             entry_forms
//             INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
//             INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
//             INNER JOIN provinces ON municipalities.provinceID = provinces.id
//         WHERE ${whereClause}
//         GROUP BY GroupBy
//         ORDER BY ${orderby}`,
//         areaID ? [filterValue, year, areaID] : [filterValue, year],
//         (error, results) => {
//             if (error) {
//                 console.error("Database error: " + error.message);
//                 return res
//                     .status(500)
//                     .json({ message: "Internal server error" });
//             }

//             res.status(200).json(results);
//         }
//     );
// }
