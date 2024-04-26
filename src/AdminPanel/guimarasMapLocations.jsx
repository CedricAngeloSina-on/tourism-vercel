import { React, useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    Button,
    AppBar,
    Toolbar,
    Grid,
    Tooltip,
    IconButton,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
    Autocomplete,
    TextField,
    Skeleton,
} from "@mui/material";

import axios from "axios";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { Heatmap, MapWithMarkers } from "../assets/components/maps";
import { PlacesAutocomplete } from "../assets/components/maps";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useJsApiLoader } from "@react-google-maps/api";

function GuimarasMap() {
    const [libraries] = useState(["places", "visualization", "markers"]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        version: "3.55",
    });

    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);
    const [selector, setSelector] = useState("Locations");
    const [year, setYear] = useState(currentYear);
    const [userData, setUserData] = useState(null);

    const [establishment, setEstablishment] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [municipalityArray, setMunicipalityArray] = useState([]);
    const [municipalityDefault, setMunicipalityDefault] = useState();

    const [points, setPoints] = useState({});
    const [points2, setPoints2] = useState({});

    const navigate = useNavigate();

    const handleSelect = (value) => {
        setSelected(value);
    };

    const handleSelect2 = (value) => {
        setSelected2(value);
    };

    const [selected, setSelected] = useState(null);
    const [selected2, setSelected2] = useState(null);

    const dataSelector = [
        {
            key: 1,
            label: "Locations",
        },
    ];

    const fetchData = (url, requestData, successCallback) => {
        axios
            .post(url, requestData)
            .then((response) => {
                console.log("Response:", response.data);
                successCallback(response.data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    };

    //Fetching data for graphs on first render of page
    useEffect(() => {
        axios
            .get(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/check-login`
            )
            .then((response) => {
                const { userID } = response.data;
                setUserData(userID);

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            console.log(userID.provinceID);
                            fetchMunicipalities(userID.provinceID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            fetchDataForDashboard(
                                "provinces.id",
                                userID.provinceID,
                                year
                            );
                            fetchLocations(
                                "provinces.id",
                                userID.provinceID,
                                year
                            );
                            fetchLocations2(
                                "provinces.id",
                                userID.provinceID,
                                municipality
                            );
                            break;
                        case 2:
                            console.log(userID.municipalityID);
                            // fetchEstablishments(userID.municipalityID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            fetchDataForDashboard(
                                "municipalities.id",
                                userID.municipalityID,
                                year
                            );
                            fetchLocations(
                                "municipalities.id",
                                userID.municipalityID,
                                year
                            );
                            fetchLocations2(
                                "municipalities.id",
                                userID.municipalityID,
                                establishment
                            );
                            break;
                        case 3:
                            navigate("/manage", { replace: true });
                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                }
                console.log(roleIdentify);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, [year]);

    //Set Dashboard Name
    function fetchDashboardName(accountID, account_roleID) {
        const requestData = {
            accountID: accountID,
            account_roleID: account_roleID,
        };

        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_dashboard_name`,
            requestData,
            (data) => {
                setDashboardName(data.toLocaleString());
            }
        );
    }

    function fetchDataForDashboard(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        console.log(requestData);
    }

    function fetchMunicipalities(provinceID) {
        const requestData = {
            provinceID: provinceID,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_municipalities`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                const municipalityData = response.data.map((item) => ({
                    id: item.id,
                    name: item.municipalityName,
                }));

                setMunicipalityArray(municipalityData);
                setMunicipality(municipalityData[0].id);
                setMunicipalityDefault(municipalityData[0]);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    const handleFilterClick = () => {
        const userID = userData;
        console.log("Im here first");

        if (userID) {
            switch (userID.account_roleID) {
                case 1:
                    fetchLocations("provinces.id", userID.provinceID, year);
                    fetchLocations2(
                        "provinces.id",
                        userID.provinceID,
                        municipality
                    );
                    break;
                case 2:
                    fetchLocations(
                        "municipalities.id",
                        userID.municipalityID,
                        year
                    );
                    fetchLocations2(
                        "municipalities.id",
                        userID.municipalityID,
                        establishment
                    );
                    break;
                case 3:
                    break;
                default:
                    console.log("hehehe");
                    break;
            }
        }
    };

    useEffect(() => {
        handleFilterClick();
        console.log("value", points);
        console.log("I never left!");
    }, [selector]);

    useEffect(() => {
        handleFilterClick();
    }, [municipality]);

    function fetchLocations(filterType, filterValue) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
        };

        if (selector === "Locations") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_locations`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here
                    console.log("ALOS:", response.data);
                    setPoints(response.data);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    function fetchLocations2(filterType, filterValue, areaID) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            areaID: areaID,
        };

        if (selector === "Locations") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_locations_by_area`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here
                    console.log("ALOS2:", response.data);
                    setPoints2(response.data);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    //Handle changing date filter (Month, Year)
    const handleChangeFilter = (event, newValue) => {
        setYear(newValue);
        setPoints({});
        setPoints2({});
        console.log(newValue);
    };

    // const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    return (
        <Box
            sx={{
                bgcolor: "#EEEEEE",
            }}
        >
            <AppBar
                position="static"
                elevation={1}
                sx={{
                    width: 1,
                    height: 60,
                    bgcolor: "white",
                }}
            >
                <Toolbar
                    sx={{
                        height: 1,
                        width: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 1,
                            height: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="button"
                            color="datatext.main"
                            sx={{ fontSize: 18 }}
                        >
                            {roleIdentify == "1"
                                ? "Province of "
                                : roleIdentify == "2"
                                ? "Municipality of "
                                : ""}
                            {dashboardName}
                        </Typography>
                        <Box
                            sx={{
                                height: 1,
                                paddingLeft: 2,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <AccountCircleRoundedIcon
                                sx={{ color: "black", fontSize: 35 }}
                            />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    paddingX: 5,
                    paddingBottom: 5,
                }}
            >
                <Grid container direction="column" rowSpacing={2}>
                    <Grid container item xs>
                        <Grid
                            container
                            item
                            xs
                            columnSpacing={2}
                            sx={{ paddingTop: 2 }}
                            //   bgcolor="red"
                        >
                            <Grid container item xs={7}>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="h3"
                                        color="datatext.main"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Locations
                                    </Typography>
                                    <Tooltip
                                        title={
                                            "Heatmap showing concentrations of guests regarding the Locations or occupancy rate"
                                        }
                                        placement="right"
                                        arrow
                                    >
                                        <IconButton size="small">
                                            <InfoRoundedIcon
                                                sx={{ color: "datatext.main" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={5}
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                                columnSpacing={2}
                            >
                                <Grid item xs={5}>
                                    <Autocomplete
                                        disableClearable
                                        size="small"
                                        value={year}
                                        onChange={handleChangeFilter}
                                        disablePortal
                                        id="Filter"
                                        options={years}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={"Filter by Year"}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    {/* <Grid
                        item
                        xs={8}
                        display="flex"
                        alignItems="center"
                        // sx={{ display: roleIdentify == 3 ? "none" : "flex" }}
                    >
                        <Typography
                            variant="h4"
                            color="datatext.main"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Heatmap
                        </Typography>
                    </Grid> */}
                    {/* <Grid
                        container
                        item
                        columnSpacing={2}
                        // bgcolor="red"
                        display="flex"
                        alignItems="center"
                        // sx={{ paddingTop: 10 }}
                    >
                        <Grid item>
                            <Typography variant="body2" color="datatext.main">
                                View Heatmap By:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ToggleButtonGroup
                                color="guimaras"
                                value={selector}
                                exclusive
                                onChange={(event, newSelector) => {
                                    if (newSelector !== null) {
                                        setIsButtonDisabled(true);
                                        setSelector(newSelector);
                                        setPoints({});
                                        setTimeout(() => {
                                            setIsButtonDisabled(false);
                                        }, 2000);
                                        // setPoints2({});
                                        // handleFilterClick();
                                    }
                                }}
                                aria-label="Platform"
                                size="small"
                            >
                                {dataSelector.map(({ label }, i) => (
                                    <ToggleButton
                                        color="guimaras"
                                        disabled={isButtonDisabled}
                                        key={i}
                                        value={label}
                                        sx={{
                                            paddingX: 2,
                                            height: 30,
                                            bgcolor: isButtonDisabled
                                                ? "lightGrey"
                                                : "transparent",
                                        }}
                                    >
                                        <Typography
                                            variant="button"
                                            color="datatext.main"
                                            sx={{ fontSize: 12 }}
                                        >
                                            {label}
                                        </Typography>
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid> */}
                    <Grid item>
                        {isLoaded ? (
                            <PlacesAutocomplete setSelected={handleSelect} />
                        ) : (
                            <></>
                        )}
                    </Grid>
                    <Grid item>
                        <Card sx={{ height: 500 }}>
                            {points.length > 0 ? (
                                <MapWithMarkers
                                    points={points}
                                    selected={selected}
                                />
                            ) : (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width={"100%"}
                                    height={"100%"}
                                />
                            )}
                        </Card>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            paddingY: 6,
                        }} /////////////////////////
                    >
                        <Divider />
                    </Grid>
                    <Grid item xs={8} display="flex" alignItems="center">
                        <Typography
                            variant="h4"
                            color="datatext.main"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            Establishment Locations
                        </Typography>
                    </Grid>

                    <Grid item xs columnSpacing={2}>
                        {municipalityDefault ? (
                            <Autocomplete
                                sx={{ width: 200 }}
                                disableClearable
                                size="small"
                                value={municipalityDefault} //////////////////////////////
                                onChange={(event, newValue) => {
                                    setMunicipalityDefault(newValue); // Set the selected value in municipalityDefault
                                    if (newValue && newValue.id) {
                                        setMunicipality(newValue.id);
                                    } else {
                                        setMunicipality(null); // Handle the case where newValue is null or does not have an 'id'
                                    }
                                    setPoints2({});
                                }}
                                disablePortal
                                id="Filter"
                                options={municipalityArray}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={"Filter by Municipality"}
                                    />
                                )}
                            />
                        ) : null}
                    </Grid>
                    <Grid item>
                        {isLoaded ? (
                            <PlacesAutocomplete setSelected={handleSelect2} />
                        ) : (
                            <></>
                        )}
                    </Grid>
                    <Grid item>
                        <Card sx={{ height: 500 }}>
                            {points2.length > 0 ? (
                                <MapWithMarkers
                                    points={points2}
                                    selected={selected2}
                                />
                            ) : (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width={"100%"}
                                    height={"100%"}
                                />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default GuimarasMap;
