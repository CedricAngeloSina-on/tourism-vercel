import db from "./database.js";

export function getStatisticsByFilter(
    req,
    res,
    filterType,
    filterValue,
    year,
    columnName
) {
    db.query(
        `SELECT
            IFNULL(SUM(${columnName}), 0) AS TOTAL,
            establishments.id AS EstablishmentID,
            municipalities.id AS MunicipalityID,
            provinces.id AS ProvincesID
        FROM
            entry_forms
        INNER JOIN
            establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN
            municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN
            provinces ON municipalities.provinceID = provinces.id
        WHERE ${filterType} = ? AND YEAR(entry_forms.date) = ?`,
        [filterValue, year],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Return the sum as a JSON response
            res.status(200).json(results[0][`TOTAL`]);
        }
    );
}

export function getTopGuestsPerformerFilter(
    req,
    res,
    filterType,
    filterValue,
    year,
    columnName
) {
    db.query(
        `SELECT
            IFNULL(SUM(${columnName}), 0) AS TOTAL,
            CASE
                WHEN '${filterType}' = 'municipalities.id' THEN establishments.establishmentName
                WHEN '${filterType}' = 'provinces.id' THEN municipalities.municipalityName
                ELSE "None"
            END AS FilteredName
        FROM
            entry_forms
        INNER JOIN
            establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN
            municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN
            provinces ON municipalities.provinceID = provinces.id
        WHERE ${filterType} = ? AND YEAR(entry_forms.date) = ?
        GROUP BY
            CASE
                WHEN '${filterType}' = 'municipalities.id' THEN establishments.id
                WHEN '${filterType}' = 'provinces.id' THEN municipalities.id
                ELSE establishments.id
            END
        ORDER BY
            TOTAL DESC
        LIMIT 1
        `,
        [filterValue, year],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Return the sum as a JSON response
            res.status(200).json(results[0]);
        }
    );
}

export function getTopAEPerformerFilter(
    req,
    res,
    filterType,
    filterValue,
    year,
    columnName
) {
    db.query(
        `SELECT     
            IFNULL(SUM(${columnName}), 0) AS TOTAL,
            ae_types.aeName AS aeName
        FROM
            entry_forms 
        INNER JOIN
            establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN
            ae_types ON establishments.aeTypeID = ae_types.id
        INNER JOIN
            municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN
            provinces ON municipalities.provinceID = provinces.id
        WHERE ${filterType} = ? AND YEAR(entry_forms.date) = ?
        GROUP BY establishments.aeTypeID
        ORDER BY
            TOTAL DESC
        LIMIT 1    
        `,
        [filterValue, year],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Return the sum as a JSON response
            res.status(200).json(results[0]);
        }
    );
}

//for alos
export function getStatisticsByAverage(
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
            IFNULL((${columnName}), 0) AS TOTAL
        FROM
            entry_forms
        INNER JOIN
            establishments ON entry_forms.establishmentID = establishments.id
        INNER JOIN
            municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN
            provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause} AND YEAR(entry_forms.date) = ?`,
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
