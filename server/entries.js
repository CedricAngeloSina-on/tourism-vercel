import express from "express";

import db from "./database.js";

const router = express.Router();

//EAFORMS

router.post("/get_entries", (req, res) => {
    const { establishmentID } = req.body;
    // filterType, filterValue
    db.query(
        `SELECT 
                id,
                date,
                numberOfRooms, 
                numberOfSurveyedRooms, 
                domesticGuestsArrivals, 
                domesticGuestsNights, 
                foreignGuestsArrivals, 
                foreignGuestsNights, 
                numberOfOccupiedRooms 
            FROM 
                entry_forms 
            WHERE 
                establishmentID = ?`,
        [establishmentID],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Return the sum as a JSON response
            res.status(200).json(results);
        }
    );
});

router.post("/create_entry", (req, res) => {
    const {
        date,
        establishmentID,
        numberOfRooms,
        numberOfSurveyedRooms,
        numberOfOccupiedRooms,

        maleDomesticArrivals,
        femaleDomesticArrivals,
        maleForeignArrivals,
        femaleForeignArrivals,

        maleDomesticOvernights,
        femaleDomesticOvernights,
        maleForeignOvernights,
        femaleForeignOvernights,

        revenue,
        expenditure,
    } = req.body;

    // Insert the new user into the database
    db.query(
        "INSERT INTO `entry_forms` (date, establishmentID, numberOfRooms, numberOfSurveyedRooms, numberOfOccupiedRooms, maleDomesticArrivals, femaleDomesticArrivals, maleForeignArrivals, femaleForeignArrivals, maleDomesticOvernights, femaleDomesticOvernights, maleForeignOvernights, femaleForeignOvernights, revenue, expenditure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            date,
            establishmentID,

            numberOfRooms,
            numberOfSurveyedRooms,
            numberOfOccupiedRooms,

            maleDomesticArrivals,
            femaleDomesticArrivals,
            maleForeignArrivals,
            femaleForeignArrivals,

            maleDomesticOvernights,
            femaleDomesticOvernights,
            maleForeignOvernights,
            femaleForeignOvernights,

            revenue,
            expenditure,
        ],
        (error, result) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Successfully created a new user
            res.status(200).json({
                message: "entry created successfully",
            });
        }
    );
});

router.post("/create_market_segments_entry", (req, res) => {
    const {
        date,
        establishmentID,

        //market segments
        children,
        teenagers,
        youngAdults,
        adults,
        seniors,

        ncr,
        car,
        r1,
        r2,
        r3,
        r4A,
        r4B,
        r5,
        r6,
        r7,
        r8,
        r9,
        r10,
        r11,
        r12,
        r13,
        barmm,

        foreign_countries,
    } = req.body;

    db.query(
        "INSERT INTO `market_segments` (date, establishmentID, children, teenagers, youngAdults, adults, seniors, NCR, CAR, R1, R2, R3, R4A, R4B, R5, R6, R7, R8, R9, R10, R11, R12, R13, BARMM, foreign_countries) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            date,
            establishmentID,

            children,
            teenagers,
            youngAdults,
            adults,
            seniors,

            ncr,
            car,
            r1,
            r2,
            r3,
            r4A,
            r4B,
            r5,
            r6,
            r7,
            r8,
            r9,
            r10,
            r11,
            r12,
            r13,
            barmm,

            JSON.stringify(foreign_countries),
        ],
        (error, result) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Successfully created a new user
            res.status(200).json({
                message: "entry created successfully",
            });
        }
    );
});

//WORKFORCE FORMS
router.post("/create_workforce_entry", (req, res) => {
    const {
        date,
        establishmentID,

        //workforce
        permanentEmployment,
        jobhireEmployment,
        projectbasedEmployment,
        parttimeEmployment,
        maleEmployees,
        femaleEmployees,

        jobs,
        wantedJobs,
    } = req.body;

    db.query(
        "INSERT INTO `employee_workforce` (date, establishmentID, permanentEmployment, jobhireEmployment, projectbasedEmployment, parttimeEmployment, maleEmployees, femaleEmployees, jobs, wantedJobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            date,
            establishmentID,

            permanentEmployment,
            jobhireEmployment,
            projectbasedEmployment,
            parttimeEmployment,
            maleEmployees,
            femaleEmployees,

            JSON.stringify(jobs),
            JSON.stringify(wantedJobs),
        ],
        (error, result) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            // Successfully created a new user
            res.status(200).json({
                message: "entry created successfully",
            });
        }
    );
});

export default router;
