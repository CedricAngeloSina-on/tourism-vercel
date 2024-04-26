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
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import {
    ScatterPlotForeign,
    ScatterPlotLocal,
    MapWithMarkers,
} from "../assets/components/maps";
import { LocalCoords, ForeignCoords } from "../assets/components/arraySource";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function GuimarasMap() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);
    const [selector, setSelector] = useState("Local Tourists");
    const [year, setYear] = useState(currentYear);
    const [userData, setUserData] = useState(null);

    const [establishment, setEstablishment] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [municipalityArray, setMunicipalityArray] = useState([]);
    const [municipalityDefault, setMunicipalityDefault] = useState();

    const [points, setPoints] = useState([]);

    const navigate = useNavigate();

    const localCoordinates = LocalCoords;

    const foreignCoordinates = ForeignCoords;

    const dataSelector = [
        {
            key: 1,
            label: "Local Tourists",
        },
        {
            key: 2,
            label: "Foreign Tourists",
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
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
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
                            fetchHeatmap(
                                "provinces.id",
                                userID.provinceID,
                                year
                            );
                            fetchLocations(
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
                            fetchHeatmap(
                                "municipalities.id",
                                userID.municipalityID,
                                year
                            );
                            fetchLocations(
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
            `${import.meta.env.VITE_WEBSITE_URL}/get_dashboard_name`,
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
                `${import.meta.env.VITE_WEBSITE_URL}/get_municipalities`,
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
                    fetchHeatmap("provinces.id", userID.provinceID, year);
                    fetchLocations(
                        "provinces.id",
                        userID.provinceID,
                        municipality
                    );
                    break;
                case 2:
                    fetchHeatmap(
                        "municipalities.id",
                        userID.municipalityID,
                        year
                    );
                    fetchLocations(
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

    function fetchHeatmap(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        if (selector === "Local Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_local_scatterplot`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here
                    console.log("LOCAL:", response.data);

                    const uniqueKeys = Object.keys(response.data[0]);

                    const resultArray = [];

                    // Loop through localCoordinates array
                    localCoordinates.map((coord, index) => {
                        const newObj = {
                            coorLat: coord.coorLat,
                            coorLng: coord.coorLng,
                            region: coord.region,
                            TOTAL: response.data[0][uniqueKeys[index]],
                        };
                        resultArray.push(newObj);
                    });
                    setPoints(resultArray);
                    console.log("LOCAL: ", resultArray);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_foreign_scatterplot`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here

                    const continentTotals = {};
                    for (const item of response.data) {
                        // Check if foreign_countries key exists and has a value
                        if (
                            "foreign_countries" in item &&
                            item["foreign_countries"]
                        ) {
                            try {
                                // Parse the JSON string
                                const countries = JSON.parse(
                                    item["foreign_countries"]
                                );
                                for (const country of countries) {
                                    const continent = country["region"];
                                    const value = parseInt(country["value"]);
                                    // Add value to continent total (initialize to 0 if continent not seen before)
                                    continentTotals[continent] =
                                        (continentTotals[continent] || 0) +
                                        value;
                                }
                            } catch (error) {
                                // Handle potential JSON parsing errors (e.g., invalid JSON format)
                                console.error(
                                    "Error parsing foreign_countries:",
                                    error
                                );
                            }
                        }
                    }
                    const resultArray = [];

                    // Loop through localCoordinates array
                    foreignCoordinates.map((coord) => {
                        const newObj = {
                            coorLat: coord.coorLat,
                            coorLng: coord.coorLng,
                            region: coord.region,
                            TOTAL: continentTotals[coord.region] || 0,
                        };
                        resultArray.push(newObj);
                    });
                    setPoints(resultArray);
                    console.log("FOREIGN: ", resultArray);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    function fetchLocations(filterType, filterValue, areaID) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
            areaID: areaID,
        };

        if (selector === "Local Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_local_scatterplot_by_area`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here
                    console.log("ALOS2:", response.data);
                    setPoints2(response.data);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_foreign_scatterplot_by_area`,
                    requestData
                )
                .then((response) => {
                    // Handle the successful response here
                    console.log("OCCU2:", response.data);
                    setPoints2(response.data);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    //Handle changing date filter (Month, Year)
    const handleChangeFilter = (event, newValue) => {
        setYear(newValue);
        setPoints([]);
        setPoints2({});
        console.log(newValue);
    };

    console.log("dsdsdsd", points);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
                                        Guest Origin
                                    </Typography>
                                    <Tooltip
                                        title={
                                            "Scatter plot showing the origins of the guests whether foriegn or local"
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
                        sx={{ display: roleIdentify == 3 ? "none" : "flex" }}
                    >
                        <Typography
                            variant="h4"
                            color="datatext.main"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            ScatterPlot
                        </Typography>
                    </Grid> */}
                    <Grid
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
                                View ScatterPlot By:
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
                                        setPoints([]);
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
                    </Grid>
                    <Grid item>
                        <Card sx={{ height: 600 }}>
                            {points.length > 0 &&
                            selector === "Local Tourists" ? (
                                <ScatterPlotLocal points={points} />
                            ) : points.length > 0 &&
                              selector === "Foreign Tourists" ? (
                                <ScatterPlotForeign points={points} />
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
                    <Grid item sx={{ width: 1 }}>
                        <Card
                            sx={{
                                // width: 1,
                                // height: 1,
                                bgcolor: "white",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                boxShadow: "none",
                            }}
                        >
                            {points ? (
                                <DataGrid
                                    columns={
                                        points.length > 0
                                            ? (() => {
                                                  const columns = Object.keys(
                                                      points[0]
                                                  ).map((column) => ({
                                                      field: column,
                                                      headerName:
                                                          column === "region"
                                                              ? "Region"
                                                              : column ===
                                                                "coorLat"
                                                              ? "Latitude"
                                                              : column ===
                                                                "coorLng"
                                                              ? "Longitude"
                                                              : column ===
                                                                "TOTAL"
                                                              ? "Total"
                                                              : column,
                                                      //   width: 250,
                                                      flex: 1,
                                                      valueFormatter: (
                                                          params
                                                      ) =>
                                                          column === "TOTAL" &&
                                                          params.value !==
                                                              null &&
                                                          params.value !==
                                                              undefined
                                                              ? `${params.value} guests`
                                                              : null,
                                                  }));

                                                  // Find the index of the "region" column
                                                  const regionIndex =
                                                      columns.findIndex(
                                                          (column) =>
                                                              column.field ===
                                                              "region"
                                                      );

                                                  // Move the "region" column to the first position
                                                  if (regionIndex !== -1) {
                                                      const regionColumn =
                                                          columns.splice(
                                                              regionIndex,
                                                              1
                                                          )[0];
                                                      columns.unshift(
                                                          regionColumn
                                                      );
                                                  }

                                                  return columns;
                                              })()
                                            : []
                                    }
                                    rows={points.map((point, rowIndex) => ({
                                        id: rowIndex, // Use the index as the row id
                                        ...point, // Spread the properties of the point object
                                    }))}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 10,
                                            },
                                        },
                                        columns: {
                                            columnVisibilityModel: {
                                                // Hide columns status and traderName, the other columns will remain visible
                                                id: false,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10, 15]}
                                    sx={{ minHeight: 200 }}
                                />
                            ) : null}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default GuimarasMap;
