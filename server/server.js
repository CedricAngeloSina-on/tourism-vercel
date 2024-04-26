import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import db from "./database.js";

import place_Router from "./get_or_create_place.js";
import ae_types_Router from "./ae_types.js";
import entries_Router from "./entries.js";
import arrivals_Router from "./arrivals.js";
import overnights_Router from "./overnights.js";
import alos_Router from "./alos.js";
import occupancy_rate_Router from "./occupancy_rate.js";
import ages_Router from "./ages.js";
import market_segments_Router from "./market_segments.js";
import employee_workforce_Router from "./employee_workforce.js";
import revenue_and_expenditure_Router from "./revenue_and_expenditure.js";
import forecasting_Router from "./forecasting.js";
import maps_router from "./maps.js";
import dashboard_Router from "./dashboard.js";
import users_Router from "./users.js";

import "dotenv/config";
const app = express();
const saltRounds = 10;

//Middleware
app.use(express.json());
app.use(
    cors({
        origin: [`${process.env.VITE_WEBSITE_URL}`],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(place_Router);
app.use(ae_types_Router);
app.use(entries_Router);
app.use(arrivals_Router);
app.use(overnights_Router);
app.use(alos_Router);
app.use(occupancy_rate_Router);
app.use(market_segments_Router);
app.use(employee_workforce_Router);
app.use(ages_Router);
app.use(revenue_and_expenditure_Router);
app.use(forecasting_Router);
app.use(maps_router);
app.use(dashboard_Router);
app.use(users_Router);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        key: "userID",
        secret: "IDEAMS",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in seconds
        },
    })
);

// create account
app.post("/create_account", (req, res) => {
    const {
        email,
        firstname,
        lastname,
        username,
        password,
        account_roleID,
        account_typeID,
        locationID,
    } = req.body;

    // Hash the password using bcrypt
    bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
            // Insert the new user into the database with the hashed password
            db.query(
                `INSERT INTO accounts (email, username, password, firstname, lastname, account_roleID, provinceID, municipalityID, establishmentID, accountTypeID) 
                VALUES (?, ?, ?, ?, ?, ?, 
                    CASE 
                        WHEN ? = 1 THEN ? 
                        ELSE 0
                    END, 
                    CASE 
                        WHEN ? = 2 THEN ? 
                        ELSE 0 
                    END, 
                    CASE 
                        WHEN ? = 3 THEN ? 
                        ELSE 0 
                    END, ?)`,
                [
                    email,
                    username,
                    hashedPassword,
                    firstname,
                    lastname,
                    account_roleID,
                    account_roleID,
                    locationID,
                    account_roleID,
                    locationID,
                    account_roleID,
                    locationID,
                    account_typeID,
                ],
                (error, result) => {
                    if (error) {
                        console.error("Database error: " + error.message);
                        return res
                            .status(500)
                            .json({ message: "Internal server error" });
                    }

                    // Successfully created a new user
                    res.status(201).json({
                        message: "User created successfully",
                    });
                }
            );
        })
        .catch((hashError) => {
            console.error("Password hashing error: " + hashError.message);
            return res.status(500).json({ message: "Internal server error" });
        });
});

app.get("/check-login", (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        res.send({ loggedIn: true, userID: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

// API route for user login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the user with the given username exists in the database
    db.query(
        "SELECT * FROM accounts WHERE username = ? AND status = 1",
        [username],
        (error, results) => {
            if (error) {
                console.error("Database error: " + error.message);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Account does not exist.",
                });
            }

            const user = results[0];

            // Compare the provided password with the hashed password stored in the database
            bcrypt.compare(
                password,
                user.password,
                (compareError, passwordMatches) => {
                    if (compareError) {
                        return res
                            .status(500)
                            .json({ message: "Internal server error" });
                    }
                    if (!passwordMatches) {
                        return res
                            .status(401)
                            .json({ message: "Invalid credentials" });
                    }

                    // Successful login
                    req.session.user = {
                        id: user.id,
                        account_roleID: user.account_roleID,
                        provinceID: user.provinceID,
                        municipalityID: user.municipalityID,
                        establishmentID: user.establishmentID,
                    };
                    res.status(200).send({
                        message: "Login successful",
                        result: req.session.user,
                    });
                }
            );
        }
    );
});

//LOGOUT
app.post("/logout", (req, res) => {
    if (!req.session.user) {
        return;
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Session destroy error: " + error.message);
            return res.status(500).json({ message: "Internal server error" });
        }

        const cookies = Object.keys(req.cookies);
        cookies.forEach((cookieName) => {
            res.clearCookie(cookieName);
        });

        res.status(200).json({ message: "Logout successful" });
    });
});

const port = process.env.VITE_PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
