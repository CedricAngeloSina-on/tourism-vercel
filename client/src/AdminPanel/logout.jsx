import React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Box, Typography, Card, Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import axios from "axios";

function Logout() {
    const navigate = useNavigate();
    //Puts all 0 on click
    async function logout() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_WEBSITE_URL}/logout`
            );
            // If the login is successful, you can console.log the response.
            navigate("/home/login");
            console.log(response.data.message);
        } catch (error) {
            // Handle login failure or any errors here.
            //setMessage("error");
            console.error(
                "Lougout error:",
                error.response ? error.response.data : error.message
            );
        }
    }

    function onLogOut() {
        navigate("/manage");
    }

    return (
        <Box
            height={{ xs: "100vh", lg: 1 }}
            padding={2}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card variant="outlined" sx={{ height: "50%", width: "50%" }}>
                <Box
                    height={"70%"}
                    width={1}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LogoutRoundedIcon sx={{ fontSize: 50 }} />
                    <Typography
                        style={{ fontWeight: "bold" }}
                        sx={{ typography: { xs: "h5", sm: "h3" } }}
                    >
                        Logout
                    </Typography>
                    <Typography
                        sx={{ typography: { xs: "body2", sm: "subtitle1" } }}
                    >
                        Are you sure you want to logout?
                    </Typography>
                </Box>
                <Box
                    height={"30%"}
                    width={1}
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}
                >
                    <Box
                        height={1}
                        width={"40%"}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={logout}
                            sx={{ width: 1 }}
                        >
                            Yes
                        </Button>
                    </Box>
                    <Box
                        height={1}
                        width={"40%"}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={onLogOut}
                            sx={{ width: 1 }}
                        >
                            No
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}

export default Logout;

{
    /* <Button variant="contained" size="large" onClick={logout}>
							Logout
						</Button> */
}
