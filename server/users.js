import express from "express";

import db from "./database.js";

const router = express.Router();

router.post("/get_users", (req, res) => {
    const { account_roleID, filterType, filterValue } = req.body;
    // filterType, filterValue
    db.query(
        `SELECT
        accounts.id AS id,
        username,
        CONCAT(lastname, ', ', firstname) AS FullName,
        email,
        created_at,
	status,
        CASE
            WHEN accounts.account_roleID = 1 THEN provinces.provinceName
            WHEN accounts.account_roleID = 2 THEN municipalities.municipalityName
            WHEN accounts.account_roleID = 3 THEN establishments.establishmentName
            ELSE ""  -- Add an appropriate default value if necessary
        END AS LocationName
    FROM
        accounts
    INNER JOIN
        establishments ON accounts.establishmentID = establishments.id
    INNER JOIN
        municipalities ON accounts.municipalityID = municipalities.id
    INNER JOIN
        provinces ON accounts.provinceID = provinces.id
    WHERE
        accounts.account_roleID = ?
        AND ${filterType} = ?
    ORDER BY
        created_at DESC;
    `,
        [account_roleID, filterValue],
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

router.post("/set_user_status", (req, res) => {
    const { account_status, account_ID } = req.body;

    db.query(
        `UPDATE accounts SET status = ? WHERE accounts.id = ?`,
        [account_status, account_ID],
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

router.post("/update_user_by_id", (req, res) => {
    const { email, username, firstname, lastname, account_ID } = req.body;

    db.query(
        `UPDATE accounts SET email = ?, username = ?, firstname = ?, lastname = ? WHERE accounts.id = ?`,
        [email, username, firstname, lastname, account_ID],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }
        }
    );
});

router.post("/get_user_by_id", (req, res) => {
    const { account_ID } = req.body;

    db.query(
        `SELECT email, username, firstname, lastname FROM accounts WHERE id = ?`,
        [account_ID],
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

export default router;
