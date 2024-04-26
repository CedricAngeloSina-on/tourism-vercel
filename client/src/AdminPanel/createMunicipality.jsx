import React from "react";
import { useState, useEffect } from "react";
// import { Link as RouterLink } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Button,
    FormControl,
    FormHelperText,
    //   FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Fade,
    Snackbar,
    IconButton,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import { TextfieldMain, TextfieldPass } from "../assets/components/Textfield";
import axios from "axios";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function CreateMunicipality() {
    const passedData = useOutletContext();

    //Handle Snackbar opened state, and message state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function snackClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    //Snackbar fragment
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={snackClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const [municipality, setMunicipality] = useState("");
    const [provinceID, setProvinceID] = useState("");

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            setRoleIdentify(userID.account_roleID);
                            setProvinceID(userID.provinceID);
                            break;
                        case 2:
                            navigate("/manage", { replace: true });
                            break;
                        case 3:
                            navigate("/manage", { replace: true });
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

    async function handleCreate() {
        if (municipality !== "") {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_WEBSITE_URL}/create_municipality`,
                    {
                        municipalityName: municipality,
                        provinceID: provinceID,
                    }
                );

                setMessage("Municipality Created Successfully");
                setOpen(true);
                setMunicipality("");
                console.log(response.data.message);
            } catch (error) {
                setMessage(error.response.data.message);
                setOpen(true);
                console.error(
                    "user error:",
                    error.response ? error.response.data : error.message
                );
            }
        } else {
            setMessage("Some fields are empty");
            setOpen(true);
        }
    }

    //Hide certain fields depending on user role
    const [roleIdentify, setRoleIdentify] = useState(0);

    //Insert Query code to determine Account Role

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
                flexGrow={1}
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={snackClose}
                    message={message}
                    action={action}
                    TransitionComponent={Fade}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                />
                <Box
                    // backgroundColor="yellow"
                    sx={{
                        width: { xs: "90%" },
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        alignItems={{ xs: "center", md: "flex-start" }}
                        textAlign={{ xs: "center", md: "left" }}
                        // backgroundColor="blue"
                        spacing={{ xs: 3, sm: 5, lg: 10 }}
                    >
                        <Grid container item direction="column">
                            <Grid item>
                                <Typography
                                    style={{ fontWeight: "bold" }}
                                    sx={{
                                        typography: { xs: "h5", sm: "h4" },
                                    }}
                                >
                                    Create a new municipality
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: "body2",
                                            sm: "subtitle1",
                                        },
                                    }}
                                >
                                    Create a new municipality under your
                                    province
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item width={1}>
                            <Box width={1 / 2}>
                                <TextfieldMain
                                    label="Municipality Name"
                                    change={(event) =>
                                        setMunicipality(event.target.value)
                                    }
                                    value={municipality}
                                />
                            </Box>
                        </Grid>
                        <Grid item width={1}>
                            <Box
                                sx={{
                                    width: 1,
                                    display: "flex",
                                    // bgcolor: "grey",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        width: { xs: 1, sm: 1 / 2, md: 1 / 3 },
                                        height: 50,
                                    }}
                                    onClick={handleCreate}
                                >
                                    Create Municipality
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateMunicipality;
