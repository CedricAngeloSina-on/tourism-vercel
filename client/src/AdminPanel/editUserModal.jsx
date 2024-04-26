import React from "react";
import { useState, useEffect } from "react";
import { Box, Grid, Button, Card } from "@mui/material";
import { TextfieldMain } from "../assets/components/Textfield";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function EditUser(props) {
    const account_ID = props.uID;
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    useEffect(() => {
        const requestData = {
            account_ID: account_ID,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_user_by_id`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                const userDetails = response.data[0];
                setEmail(userDetails.email);
                setUsername(userDetails.username);
                setFName(userDetails.firstname);
                setLName(userDetails.lastname);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, [account_ID]); // Make sure to include account_ID in the dependency array if it's a variable from the component scope.

    function UpdateUserDetails() {
        const requestData = {
            email: email,
            username: username,
            firstname: fName,
            lastname: lName,
            account_ID: account_ID,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/update_user_by_id`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    const textFieldArray = [
        {
            key: 1,
            label: "Email",
            change: setEmail,
            value: email,
            adornment: <EmailIcon />,
        },
        {
            key: 2,
            label: "First Name",
            change: setFName,
            value: fName,
            adornment: <PersonIcon />,
        },
        {
            key: 3,
            label: "Last Name",
            change: setLName,
            value: lName,
            adornment: <PersonIcon />,
        },
        {
            key: 4,
            label: "Username",
            change: setUsername,
            value: username,
            adornment: <PersonIcon />,
        },
    ];

    return (
        <Card
            sx={{
                width: "50%",
                height: "50%",
                bgcolor: "white",
                padding: 5,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h1>USER ID: {account_ID}</h1>
            <Box sx={{ width: 1, height: "80%" }}>
                <Grid
                    container
                    height={1}
                    direction={{ xs: "column" }}
                    // rowSpacing={2}
                    justifyContent={"space-evenly"}
                    // alignItems={"flex-start"}
                >
                    <Grid
                        container
                        item
                        // width={1}
                        columnSpacing={2}
                        alignitems={"center"}
                    >
                        {textFieldArray
                            .slice(0, 2)
                            .map(({ label, change, adornment, value }, i) => (
                                <Grid item width={{ xs: 1 }} sm={6} key={i}>
                                    <TextfieldMain
                                        label={label}
                                        change={(event) =>
                                            change(event.target.value)
                                        }
                                        sador={adornment}
                                        value={value}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                    <Grid
                        container
                        item
                        // width={1}
                        columnSpacing={2}
                        alignitems={"center"}
                    >
                        {textFieldArray
                            .slice(2, 4)
                            .map(({ label, change, adornment, value }, i) => (
                                <Grid item width={{ xs: 1 }} sm={6} key={i}>
                                    <TextfieldMain
                                        label={label}
                                        change={(event) =>
                                            change(event.target.value)
                                        }
                                        sador={adornment}
                                        value={value}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: 1, height: "20%" }}>
                <Grid
                    container
                    height={1}
                    columnSpacing={2}
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                >
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                UpdateUserDetails();
                                props.onCloseModal();
                            }}
                        >
                            Confirm
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={props.onCloseModal}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}

export default EditUser;
