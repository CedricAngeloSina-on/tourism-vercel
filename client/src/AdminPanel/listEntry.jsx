import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { format } from "date-fns";
import { useOutletContext } from "react-router-dom";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function ListEntry() {
    const passedData = useOutletContext();
    const [entriesArray, setEntriesArray] = useState([]);
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "date",
            headerName: "Date",
            width: 250,
            valueFormatter: (params) => {
                const isoDateString = params.value;
                const formattedDate = format(
                    new Date(isoDateString),
                    "MMMM yyyy"
                );
                return formattedDate;
            },
        },
        {
            field: "numberOfRooms",
            headerName: "Number of Rooms",
            width: 250,
        },
        {
            field: "numberOfSurveyedRooms",
            headerName: "No. of Surveyed Rooms",
            width: 300,
        },
        {
            field: "domesticGuestsArrivals",
            headerName: "Domestic Guests Arrivals",
            width: 250,
        },
        {
            field: "domesticGuestsNights",
            headerName: "Domestic Guests Nights",
            width: 250,
        },
        {
            field: "foreignGuestsArrivals",
            headerName: "Foreign Guests Arrivals",
            width: 250,
        },
        {
            field: "foreignGuestsNights",
            headerName: "Foreign Guests Nights",
            width: 250,
        },
        {
            field: "numberOfOccupiedRooms",
            headerName: "No. of Occupied Rooms",
            width: 250,
        },
    ];

    const rows = entriesArray;

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            console.log(userID.provinceID);
                            //  fetchEntries(userID.account_roleID); change this code to fetch data grouped by municipality
                            break;
                        case 2:
                            console.log(userID.municipalityID);
                            // fetchEntries(userID.account_roleID);  change this code to fetch data grouped by establishments
                            break;
                        case 3:
                            console.log(userID.establishmentID);
                            fetchEntries(userID.establishmentID);
                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                } else {
                    console.log("User ID not found in the response.");
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, []);

    function fetchEntries(establishmentID) {
        const requestData = {
            establishmentID: establishmentID,
        };
        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}/get_entries`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                setEntriesArray(response.data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    return (
        <Box
            sx={{
                height: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBarCustom
                appBarName={passedData.dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
            />
            <Box
                // flexGrow={1}
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "90%", maxHeight: "90%" }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                />
            </Box>
        </Box>
    );
}

export default ListEntry;
