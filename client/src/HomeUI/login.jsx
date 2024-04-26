import React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    Fade,
    Snackbar,
    IconButton,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { TextfieldMain, TextfieldPass } from "../assets/components/Textfield";
import guimLogin from "../assets/images/guimLogin.png";

function LoginUI() {
    //Handle Snackbar opened state, and message state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    function snackClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    useEffect(() => {
        axios
            .get(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/check-login`
            )
            .then((response) => {
                console.log(response);
                if (response.data.loggedIn == true) {
                    navigate("/manage");
                }
            });
    }, []);

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

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    //Username Red Error
    const isUsernameEmpty = username.length === 0;
    const showUsernameError = usernameChanged && isUsernameEmpty;

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        setUsernameChanged(true);
    }

    //Password Red Error
    const isPasswordEmpty = password.length === 0;
    const showPasswordError = passwordChanged && isPasswordEmpty;

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        setPasswordChanged(true);
    }

    //Rememberme
    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    async function handleLogin() {
        setUsernameChanged(true);
        setPasswordChanged(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/login`,
                {
                    username: username,
                    password: password,
                }
            );

            // If the login is successful, you can console.log the response.
            console.log(response.data.message);
            navigate("/manage");
        } catch (error) {
            // Handle login failure or any errors here.
            //setMessage("error");
            setMessage(error.response.data.message);
            setOpen(true);
            console.error(
                "Login error:",
                error.response ? error.response.data : error.message
            );
        }
    }

    return (
        <Box height="100vh" display="flex" justifyContent="center">
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
                height="100%"
                width="50%"
                // backgroundColor="blue"
                sx={{
                    backgroundImage: `url(${guimLogin})`,
                    // filter: "brightness(50%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: {
                        xs: "none",
                        sm: "none",
                        md: "block",
                    },
                    // width: { xs: 0, sm: 0 },
                }}
            />
            <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                sx={{
                    width: { xs: 1, sm: 1, md: 1 / 2 },
                    backgroundImage: { xs: `url(${guimLogin})`, md: "none" },
                    backgroundSize: { xs: "cover" },
                    backgroundPosition: { xs: "center" },
                }}
            >
                <Box
                    sx={{
                        backgroundColor: {
                            xs: "rgba(255, 255, 255, 0.8)",
                            md: "transparent",
                        },
                        width: { xs: 1, sm: 450, md: 350, lg: 450, xl: 500 },
                    }}
                    p={2}
                >
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={5}
                    >
                        <Grid
                            container
                            item
                            direction="column"
                            alignItems={{ xs: "center", md: "flex-end" }}
                        >
                            <Grid item>
                                <Typography
                                    style={{ fontWeight: "bold" }}
                                    sx={{ typography: { xs: "h5", sm: "h3" } }}
                                >
                                    Welcome
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
                                    Login to Guimaras Economic Portal
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            item
                            spacing={2}
                            direction="column"
                            // backgroundColor="white"
                        >
                            <Grid item>
                                <TextfieldMain
                                    error={showUsernameError}
                                    helper={
                                        showUsernameError ? "Empty Field" : " "
                                    }
                                    label="Username"
                                    change={handleUsernameChange}
                                    value={username}
                                    sador={<PersonIcon />}
                                />
                            </Grid>
                            <Grid item>
                                <TextfieldPass
                                    error={showPasswordError}
                                    helper={
                                        showPasswordError ? "Empty Field" : " "
                                    }
                                    label="Password"
                                    change={handlePasswordChange}
                                    value={password}
                                    type="password"
                                    sador={<LockIcon />}
                                />
                            </Grid>
                            <Grid
                                container
                                item
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                justifyContent={{
                                    xs: "flex-start",
                                    sm: "space-between",
                                }}
                                flexDirection={{ xs: "column", sm: "row" }}
                            >
                                <Grid item>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={
                                                    handleRememberMeChange
                                                }
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    typography: {
                                                        xs: "body2",
                                                        sm: "subtitle1",
                                                    },
                                                }}
                                            >
                                                Remember me
                                            </Typography>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        width: 1,
                                        height: 50,
                                    }}
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </Grid>
                            <Grid
                                container
                                item
                                justifyContent={{
                                    xs: "center",
                                    md: "flex-end",
                                }}
                            ></Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default LoginUI;
