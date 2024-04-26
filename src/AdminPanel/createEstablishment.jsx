import React from "react";
import { useState, useEffect, useRef } from "react";
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
import { Map, PlacesAutocomplete } from "../assets/components/maps";
import { useJsApiLoader } from "@react-google-maps/api";
import { useOutletContext } from "react-router-dom";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function CreateEstablishment() {
    const passedData = useOutletContext();
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    //Handle Snackbar opened state, and message state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const placesAutocompleteRef = useRef();

    const navigate = useNavigate();

    const handleSelect = (value) => {
        setSelected(value);
    };

    const [selected, setSelected] = useState(null);
    useEffect(() => {
        console.log(selected);
    }, [selected]);

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

    const [establishment, setEstablishment] = useState("");
    const [municipalityID, setMunicipalityID] = useState("");
    const [aeType, setAEType] = useState("");
    const [aeArray, setAEArray] = useState([]);

    const handleChangeAEType = (event) => {
        setAEType(event.target.value);
    };

    useEffect(() => {
        axios
            .get(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/check-login`
            )
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            setRoleIdentify(userID.account_roleID);
                            break;
                        case 2:
                            setRoleIdentify(userID.account_roleID);
                            setMunicipalityID(userID.municipalityID);
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

        axios
            .get(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_aetypes`
            ) // Replace with the actual URL of your backend API
            .then((response) => {
                console.log(response.data);
                setAEArray(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    async function handleCreate() {
        if (establishment !== "") {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/create_establishment`,
                    {
                        establishmentName: establishment,
                        municipalityID: municipalityID,
                        aeTypeID: aeType,
                        coorLat: selected.lat,
                        coorLng: selected.lng,
                    }
                );

                setMessage("Establishment Created Successfully");
                setOpen(true);
                setEstablishment("");
                setAEType("");

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
                    sx={{
                        width: { xs: "90%" },
                        height: "80%",
                        display: "flex",
                    }}
                >
                    <Box width={1 / 2}>
                        <Grid
                            container
                            direction="column"
                            alignItems={{ xs: "center", md: "flex-start" }}
                            textAlign={{ xs: "center", md: "left" }}
                            // backgroundColor="blue"
                            spacing={{ xs: 3, sm: 5, lg: 5 }}
                        >
                            <Grid container item direction="column">
                                <Grid item>
                                    <Typography
                                        style={{ fontWeight: "bold" }}
                                        sx={{
                                            typography: { xs: "h5", sm: "h4" },
                                        }}
                                    >
                                        Create a new establishment
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
                                        Create a new establishment under your
                                        municipality
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item width={1}>
                                <Box width={1}>
                                    <TextfieldMain
                                        label="Establishment Name"
                                        change={(event) =>
                                            setEstablishment(event.target.value)
                                        }
                                        value={establishment}
                                    />
                                </Box>
                            </Grid>
                            <Grid item width={{ xs: 1 }}>
                                <Box width={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="aelabel">
                                            Accommodation Establishment Type
                                        </InputLabel>
                                        <Select
                                            labelId="aelabel"
                                            label="Accommodation Establishment Type"
                                            value={aeType}
                                            onChange={handleChangeAEType}
                                        >
                                            {aeArray.map(
                                                ({ id, aeName }, i) => (
                                                    <MenuItem
                                                        key={i}
                                                        value={id}
                                                    >
                                                        {aeName}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                        <FormHelperText>
                                            Select Accommodation Establishment
                                            Type
                                        </FormHelperText>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item width={{ xs: 1 }}>
                                <Box width={1}>
                                    {isLoaded ? (
                                        <PlacesAutocomplete
                                            setSelected={handleSelect}
                                        />
                                    ) : (
                                        <></>
                                    )}
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
                                            width: {
                                                xs: 1,
                                                sm: 1 / 2,
                                                md: 1 / 2,
                                            },
                                            height: 50,
                                        }}
                                        onClick={handleCreate}
                                    >
                                        Create Establishment
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ width: 1 / 2, height: 1 }}>
                        <Box sx={{ width: 1, height: 1, padding: 2 }}>
                            {isLoaded ? <Map selected={selected} /> : <></>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateEstablishment;
