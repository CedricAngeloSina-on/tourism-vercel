import db from "./database.js";

//current year data sum
export function generateBarChartBySex(
    req,
    res,
    filterType,
    filterValue,
    year,
    maleColumns,
    femaleColumns,
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
        `SELECT
            IFNULL(SUM(${maleColumns}), 0) AS Male,
            IFNULL(SUM(${femaleColumns}), 0) AS Female,
            ${grouping}(entry_forms.date) AS GroupBy
        FROM entry_forms
        INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
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

export function generateBarChartByOrigin(
    req,
    res,
    filterType,
    filterValue,
    year,
    domesticColumn,
    foreignColumn,
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
        `SELECT
            IFNULL(SUM(${domesticColumn}), 0) AS 'Domestic',
            IFNULL(SUM(${foreignColumn}), 0) AS 'Foreign',
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
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

export function generateBarChartByAETypes(
    req,
    res,
    filterType,
    filterValue,
    year,
    totalColumn,
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
        `SELECT
            SUM(CASE WHEN ae_types.aeName = 'Tourist Inn' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS 'Tourist Inn',
            SUM(CASE WHEN ae_types.aeName = 'Serviced Residence' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS 'Serviced Residence',
            SUM(CASE WHEN ae_types.aeName = 'Resort' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Resort,
            SUM(CASE WHEN ae_types.aeName = 'Pension House' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS 'Pension House',
            SUM(CASE WHEN ae_types.aeName = 'Others' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Others,
            SUM(CASE WHEN ae_types.aeName = 'Motel' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Motel,
            SUM(CASE WHEN ae_types.aeName = 'Hotel' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Hotel,
            SUM(CASE WHEN ae_types.aeName = 'Homestay' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Homestay,
            SUM(CASE WHEN ae_types.aeName = 'Condotel' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Condotel,
            SUM(CASE WHEN ae_types.aeName = 'Apartelle' THEN IFNULL(${totalColumn}, 0) ELSE 0 END) AS Apartelle,
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
            INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
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

export function generateORBarChartByAETypes(
    req,
    res,
    filterType,
    filterValue,
    year,
    column1,
    column2,
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
        `SELECT
            SUM(CASE WHEN ae_types.aeName = 'Tourist Inn' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Tourist Inn' THEN ${column2} ELSE 0 END) * 100 AS 'Tourist Inn',
            SUM(CASE WHEN ae_types.aeName = 'Serviced Residence' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Serviced Residence' THEN ${column2} ELSE 0 END) * 100 AS 'Serviced Residence',
            SUM(CASE WHEN ae_types.aeName = 'Resort' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Resort' THEN ${column2} ELSE 0 END) * 100 AS Resort,
            SUM(CASE WHEN ae_types.aeName = 'Pension House' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Pension House' THEN ${column2} ELSE 0 END) * 100 AS 'Pension House',
            SUM(CASE WHEN ae_types.aeName = 'Others' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Others' THEN ${column2} ELSE 0 END) * 100 AS Others,
            SUM(CASE WHEN ae_types.aeName = 'Motel' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Motel' THEN ${column2} ELSE 0 END) * 100 AS Motel,
            SUM(CASE WHEN ae_types.aeName = 'Hotel' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Hotel' THEN ${column2} ELSE 0 END) * 100 AS Hotel,
            SUM(CASE WHEN ae_types.aeName = 'Homestay' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Homestay' THEN ${column2} ELSE 0 END) * 100 AS Homestay,
            SUM(CASE WHEN ae_types.aeName = 'Condotel' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Condotel' THEN ${column2} ELSE 0 END) * 100 AS Condotel,
            SUM(CASE WHEN ae_types.aeName = 'Apartelle' THEN ${column1} ELSE 0 END) / SUM(CASE WHEN ae_types.aeName = 'Apartelle' THEN ${column2} ELSE 0 END) * 100 AS Apartelle,
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
            INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
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

export function generateBarChartByRevenueAndExpenditure(
    req,
    res,
    filterType,
    filterValue,
    year,
    revenueColumn,
    expenditureColumn,
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
        `SELECT
            IFNULL(SUM(${revenueColumn}), 0) AS Revenue,
            IFNULL(SUM(${expenditureColumn}), 0) AS Expenditure,
            IFNULL(SUM(${revenueColumn} - ${expenditureColumn}), 0) AS Income,
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
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

//current year data average
export function generateALOSandORBarchartByOverall(
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
        `SELECT
            ${columnName},
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
            INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
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

export function generateALOSandORBarChartByOrigin(
    req,
    res,
    filterType,
    filterValue,
    year,
    domesticColumn,
    foreignColumn,
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
        `SELECT
            IFNULL(${domesticColumn}, 0) AS 'Domestic',
            IFNULL(${foreignColumn}, 0) AS 'Foreign',
            ${grouping}(entry_forms.date) AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
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

export function generateALOSandORBarChartByAETypes(
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
        `SELECT
        IFNULL((${columnName}), 0) AS 'Average Length of Stay by AE Type (Days)',
        ae_types.aeName AS GroupBy
        FROM
            entry_forms
            INNER JOIN establishments ON entry_forms.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
            INNER JOIN ae_types ON establishments.aeTypeID = ae_types.id
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

//analytics
