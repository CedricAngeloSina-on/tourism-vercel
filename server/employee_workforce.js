import express from "express";

import db from "./database.js";

const router = express.Router();

//JOB TITLES LIST
router.get("/get_job_titles", (req, res) => {
    db.query(
        "SELECT id, name FROM `job_roles` ORDER BY name ASC",
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
});

//EMPLOYMENT STATUS
router.post("/get_total_employment_status", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getTotal(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(permanentEmployment + jobhireEmployment + projectbasedEmployment + parttimeEmployment)"
    );
});

router.post("/get_last_year_total_employment_status", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getLastYearTotal(
        req,
        res,
        filterType,
        filterValue,
        year,
        "SUM(permanentEmployment + jobhireEmployment + projectbasedEmployment + parttimeEmployment)"
    );
});

router.post("/get_employment_status", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getEmploymentStatus(req, res, filterType, filterValue, year);
});

router.post("/get_employment_status_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getEmploymentStatus(req, res, filterType, filterValue, year, areaID);
});

//EMPLOYMENT SEX
router.post("/get_employment_sex", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getEmploymentSex(req, res, filterType, filterValue, year);
});

router.post("/get_employment_sex_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getEmploymentSex(req, res, filterType, filterValue, year, areaID);
});

//JOB TITLES
router.post("/get_jobs", (req, res) => {
    const { filterType, filterValue, year } = req.body;
    getJobs(req, res, filterType, filterValue, year);
});

router.post("/get_jobs_by_area", (req, res) => {
    const { filterType, filterValue, year, areaID } = req.body;
    getJobs(req, res, filterType, filterValue, year, areaID);
});

function getTotal(
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

    db.query(
        `SELECT
            IFNULL(${column}, 0) AS TOTAL
        FROM employee_workforce
        INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause} AND YEAR(employee_workforce.date) = ${year}`,
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

function getLastYearTotal(
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

    db.query(
        `SELECT
            IFNULL(${column}, 0) AS TOTAL
        FROM employee_workforce
        INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
        INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
        INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause} AND YEAR(employee_workforce.date) = ${year} - 1`,
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

function getEmploymentStatus(
    req,
    res,
    filterType,
    filterValue,
    year,
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
        whereClause += ` AND YEAR(employee_workforce.date) = ?`;
        orderby = `MONTH(employee_workforce.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            IFNULL(SUM(permanentEmployment), 0) AS 'Permanent',
            IFNULL(SUM(jobhireEmployment), 0) AS 'Job Hire',
            IFNULL(SUM(projectbasedEmployment), 0) AS 'Project Based',
            IFNULL(SUM(parttimeEmployment), 0) AS 'Part-time',
            ${grouping}(employee_workforce.date) AS GroupBy
        FROM
            employee_workforce
            INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
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

function getEmploymentSex(
    req,
    res,
    filterType,
    filterValue,
    year,
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
        whereClause += ` AND YEAR(employee_workforce.date) = ?`;
        orderby = `MONTH(employee_workforce.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            IFNULL(SUM(maleEmployees), 0) AS 'Male',
            IFNULL(SUM(femaleEmployees), 0) AS 'Female',
            ${grouping}(employee_workforce.date) AS GroupBy
        FROM
            employee_workforce
            INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
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

function getJobs(req, res, filterType, filterValue, year, areaID = null) {
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
        whereClause += ` AND YEAR(employee_workforce.date) = ?`;
        orderby = `MONTH(employee_workforce.date)`;
    } else if (year === "Recent 5 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 5`;
    } else if (year === "Recent 10 Years") {
        grouping = "YEAR";
        orderby = `YEAR(employee_workforce.date) LIMIT 10`;
    }

    db.query(
        `SELECT
            jobs,
            ${grouping}(employee_workforce.date) AS GroupBy
        FROM
            employee_workforce
            INNER JOIN establishments ON employee_workforce.establishmentID = establishments.id
            INNER JOIN municipalities ON establishments.municipalityID = municipalities.id
            INNER JOIN provinces ON municipalities.provinceID = provinces.id
        WHERE ${whereClause}
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

export default router;
