import React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
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
import { useOutletContext } from "react-router-dom";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function CreateAccount() {
    const passedData = useOutletContext();

    //Handle Snackbar opened state, and message state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

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

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [establishment, setEstablishment] = useState("");

    const navigate = useNavigate();

    function reset() {
        setUsername("");
        setEmail("");
        setFName("");
        setLName("");
        setEstablishment("");
        setMunicipality("");
        setPassword("");
        setRepeatPassword("");
    }

    //Handling input for selector Municipality
    const handleChangeMunic = (event) => {
        setMunicipality(event.target.value);
    };

    //Handling input for selector Municipality
    const handleChangeEstablish = (event) => {
        setEstablishment(event.target.value);
    };

    const [establishmentArray, setEstablishmentArray] = useState([]);
    const [municipalityArray, setMunicipalityArray] = useState([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            setRoleIdentify(userID.account_roleID);
                            fetchMunicipalities(userID.provinceID);
                            break;
                        case 2:
                            setRoleIdentify(userID.account_roleID);
                            fetchEstablishments(userID.municipalityID);
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

    function fetchMunicipalities(provinceID) {
        const requestData = {
            provinceID: provinceID,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}/get_municipalities`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                const municipalityData = response.data.map((item) => ({
                    id: item.id,
                    name: item.municipalityName,
                }));
                console.log(municipalityData);

                setMunicipalityArray(municipalityData);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    function fetchEstablishments(municipalityID) {
        const requestData = {
            municipalityID: municipalityID,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}/get_establishments`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                const establishmentData = response.data.map((item) => ({
                    id: item.id,
                    name: item.establishmentName,
                }));
                console.log(establishmentData);

                setEstablishmentArray(establishmentData);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    const isEmailValid = (email) => {
        // Regular expression for email format validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    async function handleCreate() {
        if (
            username !== "" &&
            email !== "" &&
            fName !== "" &&
            lName !== "" &&
            password !== "" &&
            repeatPassword !== ""
        ) {
            if (isEmailValid(email)) {
                if (password == repeatPassword) {
                    try {
                        let role = 0;
                        let locationID = 0;

                        switch (roleIdentify) {
                            case 0:
                            // role = 1;
                            // locationID = provincial;
                            // save this for making a provincial account
                            case 1:
                                role = 2;
                                locationID = municipality;
                                break;
                            case 2:
                                role = 3;
                                locationID = establishment;
                                break;
                            default:
                                locationID = 0;
                        }

                        const response = await axios.post(
                            `${
                                import.meta.env.VITE_WEBSITE_URL
                            }/create_account`,
                            {
                                email: email,
                                firstname: fName,
                                lastname: lName,
                                username: username,
                                password: password,
                                account_roleID: role,
                                locationID: locationID,
                            }
                        );

                        // If the login is successful, you can console.log the response.
                        setMessage("Account created successfully");
                        setOpen(true);
                        reset();
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
                    setMessage("Passwords do not match");
                    setOpen(true);
                }
            } else {
                setMessage("Email is invalid");
                setOpen(true);
            }
        } else {
            setMessage("Some fields are empty");
            setOpen(true);
        }
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
        {
            key: 5,
            label: "Password",
            change: setPassword,
            value: password,
            adornment: <LockIcon />,
        },
        {
            key: 6,
            label: "Confirm Password",
            change: setRepeatPassword,
            value: repeatPassword,
            adornment: <LockIcon />,
        },
    ];

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
                        spacing={{ xs: 3, sm: 5 }}
                    >
                        <Grid container item direction="column">
                            <Grid item>
                                <Typography
                                    style={{ fontWeight: "bold" }}
                                    sx={{
                                        typography: { xs: "h5", sm: "h4" },
                                    }}
                                >
                                    Create a new account
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
                                    Create a new Guimaras Economic Portal user
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            item
                            rowSpacing={3}
                            columnSpacing={2}
                            // backgroundColor="white"
                        >
                            <Grid
                                item
                                xs={5}
                                style={{
                                    display:
                                        roleIdentify === 1 ? "flex" : "none",
                                }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="municlabel">
                                        Municipality
                                    </InputLabel>
                                    <Select
                                        labelId="municlabel"
                                        label="Municipality"
                                        value={municipality}
                                        onChange={handleChangeMunic}
                                    >
                                        {municipalityArray.map(
                                            ({ id, name }, i) => (
                                                <MenuItem key={i} value={id}>
                                                    {name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                    <FormHelperText>
                                        Select Municipality
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                width={{ xs: 1 }}
                                sm={6}
                                sx={{
                                    display:
                                        roleIdentify === 2 ? "flex" : "none",
                                }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="establishlabel">
                                        Establishment
                                    </InputLabel>
                                    <Select
                                        labelId="establishlabel"
                                        label="Establishment"
                                        value={establishment}
                                        onChange={handleChangeEstablish}
                                    >
                                        {establishmentArray.map(
                                            ({ id, name }, i) => (
                                                <MenuItem key={i} value={id}>
                                                    {name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                    <FormHelperText>
                                        Select Establishment
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid
                                container
                                item
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                justifyContent={"center"}
                            >
                                <Grid
                                    container
                                    item
                                    xs={6}
                                    spacing={2}
                                    direction="column"
                                    alignitems={"center"}
                                >
                                    {textFieldArray
                                        .slice(0, 3)
                                        .map(
                                            (
                                                {
                                                    label,
                                                    change,
                                                    adornment,
                                                    value,
                                                },
                                                i
                                            ) => (
                                                <Grid
                                                    item
                                                    width={{ xs: 1 }}
                                                    sm={2}
                                                    key={i}
                                                >
                                                    <TextfieldMain
                                                        label={label}
                                                        change={(event) =>
                                                            change(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        sador={adornment}
                                                        value={value}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={6}
                                    spacing={2}
                                    direction="column"
                                    alignitems={"center"}
                                >
                                    {textFieldArray
                                        .slice(3, 7)
                                        .map(
                                            (
                                                {
                                                    label,
                                                    change,
                                                    adornment,
                                                    value,
                                                },
                                                i
                                            ) => (
                                                <Grid
                                                    item
                                                    width={{ xs: 1 }}
                                                    sm={2}
                                                    key={i}
                                                >
                                                    {i == 0 ? (
                                                        <TextfieldMain
                                                            label={label}
                                                            change={(event) =>
                                                                change(
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                            sador={adornment}
                                                            value={value}
                                                        />
                                                    ) : (
                                                        <TextfieldPass
                                                            label={label}
                                                            change={(event) =>
                                                                change(
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                            sador={adornment}
                                                            value={value}
                                                        />
                                                    )}
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item width={1}>
                            <Box
                                sx={{
                                    width: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                    Create Account
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateAccount;
