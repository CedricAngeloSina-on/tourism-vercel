import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    FormControl,
    FormHelperText,
    Select,
    InputLabel,
    MenuItem,
    Typography,
    TextField,
    Card,
    Chip,
    Divider,
    Toolbar,
    Autocomplete,
} from "@mui/material";
import BarChart from "../assets/components/barChart";
import { DatePicker } from "@mui/x-date-pickers";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AppBarCustom from "../assets/components/appBar";

function Dashboard() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    const [arrivals, setArrivals] = useState(0);
    const [domesticArrivals, setDomesticArrivals] = useState(0);
    const [foreignArrivals, setForeignArrivals] = useState(0);
    const [stays, setStays] = useState(0);
    const [domesticStays, setDomesticStays] = useState(0);
    const [foreignStays, setForeignStays] = useState(0);
    const [mostArriveAE, setMostArriveAE] = useState("Example AE");
    const [mostArriveAEValue, setMostArriveAEValue] = useState(0);
    const [mostArriveType, setMostArriveType] = useState("Example Type");
    const [mostArriveTypeValue, setMostArriveTypeValue] = useState(0);
    const [mostStayAE, setMostStayAE] = useState("Example AE");
    const [mostStayAEValue, setMostStayAEValue] = useState(0);
    const [mostStayType, setMostStayType] = useState("Example Type");
    const [mostStayTypeValue, setMostStayTypeValue] = useState(0);
    const [dashboardName, setDashboardName] = useState("Dashboard Name");
    const [roleIdentify, setRoleIdentify] = useState(0);
    const [year, setYear] = useState(currentYear);

    const [arrivalsBarChart, setArrivalsBarChart] = useState([]);
    const [staysBarChart, setStaysBarChart] = useState([]);

    const [labelBarchart, setLabelBarchart] = useState([]);

    const navigate = useNavigate();

    const layoutArray = [
        {
            key: 1,
            label: "Total Guest Arrivals",
            value: arrivals,
        },
        {
            key: 2,
            label: "Total Guest Overnights",
            value: stays,
        },
        {
            key: 3,
            label: "Domestic Guest Arrivals",
            value: domesticArrivals,
        },
        {
            key: 4,
            label: "Foreign Guest Arrivals",
            value: foreignArrivals,
        },
        {
            key: 5,
            label: "Domestic Guest Overnights",
            value: domesticStays,
        },
        {
            key: 6,
            label: "Foreign Guest Overnights",
            value: foreignStays,
        },
        {
            key: 7,
            label: "Most Arrivals",
            boxlable1: mostArriveAE,
            value1: mostArriveAEValue,
            boxlable2: mostArriveType,
            value2: mostArriveTypeValue,
        },
        {
            key: 8,
            label: "Most Overnights",
            boxlable1: mostStayAE,
            value1: mostStayAEValue,
            boxlable2: mostStayType,
            value2: mostStayTypeValue,
        },
        // {
        //     key: 9,
        //     label: "Arrival Chart",
        //     chartlabel: "Arrivals",
        //     value: arrivalsBarChart,
        // },
        // {
        //     key: 10,
        //     label: "Overnight Chart",
        //     chartlabel: "Overnights",
        //     value: staysBarChart,
        // },
    ];

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
                            console.log(userID.provinceID);
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
                            fetchBarChart(
                                "provinces.id",
                                userID.provinceID,
                                year
                            );
                            break;
                        case 2:
                            console.log(userID.municipalityID);
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
                            fetchBarChart(
                                "municipalities.id",
                                userID.municipalityID,
                                year
                            );
                            break;
                        case 3:
                            console.log(userID.establishmentID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            fetchDataForDashboard(
                                "establishments.id",
                                userID.establishmentID,
                                year
                            );
                            fetchBarChart(
                                "establishments.id",
                                userID.establishmentID,
                                year
                            );
                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, [year]);

    function fetchDashboardName(accountID, account_roleID) {
        const requestData = {
            accountID: accountID,
            account_roleID: account_roleID,
        };
        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_dashboard_name`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                setDashboardName(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    function fetchDataForDashboard(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        console.log(requestData);

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_arrivals`,
                requestData
            )
            .then((response) => {
                console.log("Response:", response.data);
                setArrivals(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_domestic_arrivals`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response:", response.data);
                setDomesticArrivals(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_foreign_arrivals`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response:", response.data);
                setForeignArrivals(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_overnights`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response:", response.data);
                setStays(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_domestic_overnights`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response:", response.data);
                setDomesticStays(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_foreign_overnights`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response:", response.data);
                setForeignStays(response.data.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_arrivals_by_establishment`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response :", response.data.FilteredName);
                console.log("Response :", response.data.TOTAL);
                setMostArriveAE(response.data.FilteredName);
                setMostArriveAEValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
                setMostArriveAE("Unknown");
                setMostArriveAEValue(0);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_overnights_by_establishment`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response :", response.data.FilteredName);
                setMostStayAE(response.data.FilteredName);
                setMostStayAEValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
                setMostStayAE("Unknown");
                setMostStayAEValue(0);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_arrivals_by_AE`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response :", response.data.aeName);
                setMostArriveType(response.data.aeName);
                setMostArriveTypeValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
                setMostArriveType("Unknown");
                setMostArriveTypeValue(0);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_overnights_by_AE`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                console.log("Response :", response.data.aeName);
                setMostStayType(response.data.aeName);
                setMostStayTypeValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
                setMostStayType("Unknown");
                setMostStayTypeValue(0);
            });
    }

    //BARCHART
    function fetchBarChart(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_arrivals_barchart`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                const totals = response.data.map((item) => item.TOTAL);
                const labels = response.data.map((item) => item.GroupBy);
                setArrivalsBarChart(totals);
                setLabelBarchart(labels);
                console.log(totals);
                // setMostStayTypeValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });

        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_overnights_barchart`,
                requestData
            )
            .then((response) => {
                // Handle the response data here
                const totals = response.data.map((item) => item.TOTAL);
                setStaysBarChart(totals);
                console.log(totals);
                // setMostStayTypeValue(response.data.TOTAL.toLocaleString());
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    const handleChangeFilter = (event, newValue) => {
        setYear(newValue);
        console.log(newValue);
    };

    return (
        <Box
            sx={{
                bgcolor: "#EEEEEE",
            }}
        >
            {/* <Toolbar
				sx={{
					display: { xs: "block", lg: "none" },
					height: 10,
				}}
			/> */}
            <AppBarCustom
                appBarName={
                    (roleIdentify == "1" ///////////////////////////////////////////////////////////
                        ? "Province of "
                        : roleIdentify == "2" //////////////////////////////////////////////////
                        ? "Municipality of "
                        : "") + dashboardName
                }
                /////////////////////////////////////////////////////////////////
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
                /////////////////////////////////////////////////////////////////////
            />
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
                            display="flex"
                            justifyContent="flex-end"
                            sx={{ paddingTop: 2 }}
                        >
                            <Grid item xs={3}>
                                <Autocomplete
                                    disableClearable
                                    value={year}
                                    size="small"
                                    onChange={handleChangeFilter}
                                    disablePortal
                                    id="Filter"
                                    options={years}
                                    sx={{ height: 50 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Filter by Year"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs>
                        <Grid container item xs columnSpacing={2}>
                            {layoutArray
                                .slice(8, 10)
                                .map(({ label, chartlabel, value }, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Card
                                            sx={{
                                                width: 1,
                                                height: 500,
                                                bgcolor: "white",
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: 2,
                                            }}
                                        >
                                            <Box width={1} height={"10%"}>
                                                <Typography
                                                    variant="overline"
                                                    sx={
                                                        {
                                                            // fontSize: { xs: 48, sm: 80, md: 88, lg: 70, xl: 104 },
                                                            // color: "white",
                                                            // fontWeight: 900,
                                                            // fontStyle: "italic",
                                                        }
                                                    }
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                            <Box
                                                width={1}
                                                height={"90%"}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                }}
                                            ></Box>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid container item xs>
                        <Grid container item xs columnSpacing={2}>
                            {layoutArray
                                .slice(0, 2)
                                .map(({ label, value }, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Card
                                            sx={{
                                                width: 1,
                                                height: 150,
                                                bgcolor: "white",
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: 2,
                                            }}
                                        >
                                            <Box width={1} height={"20%"}>
                                                <Typography
                                                    variant="overline"
                                                    sx={
                                                        {
                                                            // fontSize: { xs: 48, sm: 80, md: 88, lg: 70, xl: 104 },
                                                            // color: "white",
                                                            // fontWeight: 900,
                                                            // fontStyle: "italic",
                                                        }
                                                    }
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                            <Box
                                                width={1}
                                                height={"80%"}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Typography
                                                    variant="h1"
                                                    sx={{
                                                        fontSize: {
                                                            xs: 48,
                                                            sm: 80,
                                                            md: 70,
                                                            lg: 70,
                                                            xl: 80,
                                                        },
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {value}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid container item xs>
                        <Grid container item xs columnSpacing={2}>
                            {layoutArray
                                .slice(2, 6)
                                .map(({ label, value }, i) => (
                                    <Grid item xs={3} key={i}>
                                        <Card
                                            sx={{
                                                width: 1,
                                                height: 150,
                                                bgcolor: "white",
                                                display: "flex",
                                                flexDirection: "column",
                                                padding: 1,
                                            }}
                                        >
                                            <Box
                                                width={1}
                                                height={"20%"}
                                                paddingLeft={1}
                                            >
                                                <Typography
                                                    variant="overline"
                                                    sx={{
                                                        fontSize: {
                                                            xs: 48,
                                                            sm: 9,
                                                            md: 9,
                                                            lg: 9,
                                                            xl: 12,
                                                        },
                                                        // color: "white",
                                                        // fontWeight: 900,
                                                        // fontStyle: "italic",
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                            <Box
                                                width={1}
                                                height={"80%"}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h3"
                                                    sx={{
                                                        fontSize: {
                                                            xs: 48,
                                                            sm: 80,
                                                            md: 45,
                                                            lg: 45,
                                                            xl: 50,
                                                        },
                                                        // color: "white",
                                                        fontWeight: 600,
                                                        // fontStyle: "italic",
                                                    }}
                                                >
                                                    {value}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        style={{
                            display: roleIdentify === 3 ? "none" : "flex",
                        }}
                    >
                        <Grid container item xs columnSpacing={2}>
                            {layoutArray
                                .slice(6, 8)
                                .map(
                                    (
                                        {
                                            label,
                                            boxlable1,
                                            value1,
                                            boxlable2,
                                            value2,
                                        },
                                        i
                                    ) => (
                                        <Grid item xs={6} key={i}>
                                            <Card
                                                sx={{
                                                    width: 1,
                                                    height: 250,
                                                    bgcolor: "white",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: 1,
                                                }}
                                            >
                                                <Box
                                                    width={1}
                                                    height={"10%"}
                                                    paddingLeft={1}
                                                >
                                                    <Typography
                                                        variant="overline"
                                                        sx={
                                                            {
                                                                // fontSize: { xs: 48, sm: 80, md: 88, lg: 70, xl: 104 },
                                                                // color: "white",
                                                                // fontWeight: 900,
                                                                // fontStyle: "italic",
                                                            }
                                                        }
                                                    >
                                                        {label}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    width={1}
                                                    height={"80%"}
                                                    sx={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <Box
                                                        width={1 / 2}
                                                        height={1}
                                                        bgcolor="white"
                                                        padding={2}
                                                        sx={{ borderRadius: 3 }}
                                                    >
                                                        <Box
                                                            width={1}
                                                            height={1 / 2}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: 48,
                                                                        sm: 80,
                                                                        md: 14,
                                                                        lg: 14,
                                                                        xl: 18,
                                                                    },
                                                                    // color: "white",
                                                                    // fontWeight: 600,
                                                                    // fontStyle: "italic",
                                                                }}
                                                            >
                                                                {boxlable1}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            width={1}
                                                            height={1 / 2}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "flex-start",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h3"
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: 48,
                                                                        sm: 80,
                                                                        md: 45,
                                                                        lg: 45,
                                                                        xl: 50,
                                                                    },
                                                                    // color: "white",
                                                                    fontWeight: 600,
                                                                    // fontStyle: "italic",
                                                                }}
                                                            >
                                                                {value1}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Divider
                                                        orientation="vertical"
                                                        variant="middle"
                                                        flexItem
                                                    />
                                                    <Box
                                                        width={1 / 2}
                                                        height={1}
                                                        bgcolor="white"
                                                        padding={2}
                                                        sx={{ borderRadius: 3 }}
                                                    >
                                                        <Box
                                                            width={1}
                                                            height={1 / 2}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: 48,
                                                                        sm: 80,
                                                                        md: 14,
                                                                        lg: 14,
                                                                        xl: 18,
                                                                    },
                                                                    // color: "white",
                                                                    // fontWeight: 900,
                                                                    // fontStyle: "italic",
                                                                }}
                                                            >
                                                                {boxlable2}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            width={1}
                                                            height={1 / 2}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "flex-start",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h3"
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: 48,
                                                                        sm: 80,
                                                                        md: 45,
                                                                        lg: 45,
                                                                        xl: 50,
                                                                    },
                                                                    // color: "white",
                                                                    fontWeight: 600,
                                                                    // fontStyle: "italic",
                                                                }}
                                                            >
                                                                {value2}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    )
                                )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Dashboard;
