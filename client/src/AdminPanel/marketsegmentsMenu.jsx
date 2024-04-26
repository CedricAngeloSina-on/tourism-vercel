import { React, useState, useEffect } from "react";
import { Box } from "@mui/material";

import axios from "axios";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DashboardTempC from "../assets/components/dashboardTempC";
import { LocalCoords, ForeignCoords } from "../assets/components/arraySource";
const localCoordinates = LocalCoords;
const foreignCoordinates = ForeignCoords;

function SexMenu() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);
    const [selector, setSelector] = useState("Age Group");
    const [month, setMonth] = useState("January");
    const [year, setYear] = useState(currentYear);
    const [userData, setUserData] = useState(null);

    const [points, setPoints] = useState({});
    const [points2, setPoints2] = useState({});

    // Piechart Labels
    const [piechartLabels, setPiechartLabels] = useState([]);

    // Formatted Piechart
    const [piechartValueYear, setPiechartValueYear] = useState([]);
    const [piechartValueMonth, setPiechartValueMonth] = useState([]);
    const [specificPiechartValueYear, setSpecificPiechartValueYear] = useState(
        []
    );
    const [specificPiechartValueMonth, setSpecificPiechartValueMonth] =
        useState([]);

    //Array of Establishment choices
    const [establishmentArray, setEstablishmentArray] = useState([]);
    //Array of Municipality choices
    const [municipalityArray, setMunicipalityArray] = useState([]);
    //Array of Municipality choices formatted for selector
    const [municipality, setMunicipality] = useState("");
    //Array of Establishment choices formatted for selector
    const [establishment, setEstablishment] = useState("");

    //Display for value autocomplete selector
    const [municipalityDefault, setMunicipalityDefault] = useState();
    const [establishmentDefault, setEstablishmentDefault] = useState();

    const navigate = useNavigate();

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
                            fetchBarChart(
                                "provinces.id",
                                userID.provinceID,
                                month,
                                year
                            );
                            fetchBarChart2(
                                "provinces.id",
                                userID.provinceID,
                                month,
                                year,
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
                            fetchBarChart(
                                "municipalities.id",
                                userID.municipalityID,
                                month,
                                year
                            );
                            fetchBarChart2(
                                "municipalities.id",
                                userID.municipalityID,
                                month,
                                year,
                                establishment
                            );
                            break;
                        case 3:
                            console.log(userID.provinceID);
                            fetchMunicipalities(userID.provinceID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            fetchBarChart(
                                "establishments.id",
                                userID.establishmentID,
                                month,
                                year
                            );
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
                    fetchBarChart(
                        "provinces.id",
                        userID.provinceID,
                        month,
                        year
                    );
                    fetchBarChart2(
                        "provinces.id",
                        userID.provinceID,
                        month,
                        year,
                        municipality
                    );
                    break;
                case 2:
                    fetchBarChart(
                        "municipalities.id",
                        userID.municipalityID,
                        month,
                        year
                    );
                    fetchBarChart2(
                        "municipalities.id",
                        userID.municipalityID,
                        month,
                        year,
                        establishment
                    );
                    break;
                case 3:
                    fetchBarChart(
                        "establishments.id",
                        userID.establishmentID,
                        month,
                        year
                    );
                    break;
                default:
                    console.log("hehehe");
                    break;
            }
        }
    };

    useEffect(() => {
        handleFilterClick();
    }, [selector]);

    useEffect(() => {
        handleFilterClick();
    }, [municipality]);

    useEffect(() => {
        handleFilterClick();
    }, [month]);

    //Handle changing date filter (Month, Year)
    const handleChangeFilter = (event, newValue) => {
        setYear(newValue);
        setPoints({});
        setPoints2({});
        console.log(newValue);
    };

    function fetchBarChart(filterType, filterValue, month, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            month: month,
            year: year,
        };

        if (selector === "Age Group") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_ages_overall`,
                    requestData
                )
                .then((response) => {
                    setPiechartLabels(Object.keys(response.data[0]));
                    setPiechartValueYear(Object.values(response.data[0]));
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_ages_overall_by_month`,
                    requestData
                )
                .then((response) => {
                    setPiechartLabels(Object.keys(response.data[0]));
                    setPiechartValueMonth(Object.values(response.data[0]));
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Sex") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_sex_overall`,
                    requestData
                )
                .then((response) => {
                    setPiechartLabels(Object.keys(response.data[0]));
                    setPiechartValueYear(Object.values(response.data[0]));
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_sex_overall_by_month`,
                    requestData
                )
                .then((response) => {
                    setPiechartLabels(Object.keys(response.data[0]));
                    setPiechartValueMonth(Object.values(response.data[0]));
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Domestic Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_local`,
                    requestData
                )
                .then((response) => {
                    const mappedValues = [];
                    for (const region in response.data[0]) {
                        const localCoord = LocalCoords.find(
                            (coord) => coord.region === region
                        );
                        if (localCoord) {
                            mappedValues.push({
                                region: region,
                                island: localCoord.island,
                                coorLat: localCoord.coorLat,
                                coorLng: localCoord.coorLng,
                                value: response.data[0][region],
                            });
                        }
                    }

                    const islandTotals = mappedValues.reduce((acc, curr) => {
                        acc[curr.island] = (acc[curr.island] || 0) + curr.value;
                        return acc;
                    }, {});
                    const islandTotalsArray = Object.entries(islandTotals).map(
                        ([island, total]) => ({ island, total })
                    );
                    setPiechartLabels(
                        islandTotalsArray.map((item) => item.island)
                    );
                    setPiechartValueYear(
                        islandTotalsArray.map((item) => item.total)
                    );
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_local_by_month`,
                    requestData
                )
                .then((response) => {
                    const mappedValues = [];
                    for (const region in response.data[0]) {
                        const localCoord = LocalCoords.find(
                            (coord) => coord.region === region
                        );
                        if (localCoord) {
                            mappedValues.push({
                                region: region,
                                island: localCoord.island,
                                coorLat: localCoord.coorLat,
                                coorLng: localCoord.coorLng,
                                value: response.data[0][region],
                            });
                        }
                    }

                    const islandTotals = mappedValues.reduce((acc, curr) => {
                        acc[curr.island] = (acc[curr.island] || 0) + curr.value;
                        return acc;
                    }, {});
                    const islandTotalsArray = Object.entries(islandTotals).map(
                        ([island, total]) => ({ island, total })
                    );

                    setPiechartLabels(
                        islandTotalsArray.map((item) => item.island)
                    );
                    setPiechartValueMonth(
                        islandTotalsArray.map((item) => item.total)
                    );
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_foreign`,
                    requestData
                )
                .then((response) => {
                    const regionTotals = {};
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
                                    const region = country["region"];
                                    const value = parseInt(country["value"]);
                                    // Add value to region total (initialize to 0 if region not seen before)
                                    regionTotals[region] =
                                        (regionTotals[region] || 0) + value;
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
                            continent: coord.continent,
                            region: coord.region,
                            TOTAL: regionTotals[coord.region] || 0,
                        };
                        resultArray.push(newObj);
                    });

                    let continentTotal = {};
                    resultArray.forEach((item) => {
                        if (!continentTotal[item.continent])
                            continentTotal[item.continent] = 0;
                        continentTotal[item.continent] += item.TOTAL;
                    });

                    console.log("FOREIGN: ", continentTotal);
                    setPiechartLabels(Object.keys(continentTotal));
                    setPiechartValueYear(Object.values(continentTotal));
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_foreign_by_month`,
                    requestData
                )
                .then((response) => {
                    const regionTotals = {};
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
                                    const region = country["region"];
                                    const value = parseInt(country["value"]);
                                    // Add value to region total (initialize to 0 if region not seen before)
                                    regionTotals[region] =
                                        (regionTotals[region] || 0) + value;
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
                            continent: coord.continent,
                            region: coord.region,
                            TOTAL: regionTotals[coord.region] || 0,
                        };
                        resultArray.push(newObj);
                    });

                    let continentTotal = {};
                    resultArray.forEach((item) => {
                        if (!continentTotal[item.continent])
                            continentTotal[item.continent] = 0;
                        continentTotal[item.continent] += item.TOTAL;
                    });

                    console.log("FOREIGN: ", continentTotal);
                    setPiechartLabels(Object.keys(continentTotal));
                    setPiechartValueMonth(Object.values(continentTotal));
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    function fetchBarChart2(filterType, filterValue, month, year, areaID) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            month: month,
            year: year,
            areaID: areaID,
        };

        if (selector === "Age Group") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_ages_overall_by_area`,
                    requestData
                )
                .then((response) => {
                    console.log(month, " ", year, ": ", response.data[0]);
                    setPiechartLabels(Object.keys(response.data[0]));
                    setSpecificPiechartValueYear(
                        Object.values(response.data[0])
                    );
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_ages_overall_by_area_by_month`,
                    requestData
                )
                .then((response) => {
                    console.log(month, " ", year, ": ", response.data[0]);
                    setPiechartLabels(Object.keys(response.data[0]));
                    setSpecificPiechartValueMonth(
                        Object.values(response.data[0])
                    );
                    console.log(response.data[0]);
                });
        } else if (selector === "Sex") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_sex_overall_by_area`,
                    requestData
                )
                .then((response) => {
                    console.log(month, " ", year, ": ", response.data[0]);
                    setPiechartLabels(Object.keys(response.data[0]));
                    setSpecificPiechartValueYear(
                        Object.values(response.data[0])
                    );
                    console.log(response.data[0]);
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_sex_overall_by_area_by_month`,
                    requestData
                )
                .then((response) => {
                    console.log(month, " ", year, ": ", response.data[0]);
                    setPiechartLabels(Object.keys(response.data[0]));
                    setSpecificPiechartValueMonth(
                        Object.values(response.data[0])
                    );
                    console.log(response.data[0]);
                });
        } else if (selector === "Domestic Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_local_by_area`,
                    requestData
                )
                .then((response) => {
                    const mappedValues = [];
                    for (const region in response.data[0]) {
                        const localCoord = LocalCoords.find(
                            (coord) => coord.region === region
                        );
                        if (localCoord) {
                            mappedValues.push({
                                region: region,
                                island: localCoord.island,
                                coorLat: localCoord.coorLat,
                                coorLng: localCoord.coorLng,
                                value: response.data[0][region],
                            });
                        }
                    }

                    const islandTotals = mappedValues.reduce((acc, curr) => {
                        acc[curr.island] = (acc[curr.island] || 0) + curr.value;
                        return acc;
                    }, {});
                    const islandTotalsArray = Object.entries(islandTotals).map(
                        ([island, total]) => ({ island, total })
                    );
                    setPiechartLabels(
                        islandTotalsArray.map((item) => item.island)
                    );
                    setSpecificPiechartValueYear(
                        islandTotalsArray.map((item) => item.total)
                    );
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_local_by_area_by_month`,
                    requestData
                )
                .then((response) => {
                    const mappedValues = [];
                    for (const region in response.data[0]) {
                        const localCoord = LocalCoords.find(
                            (coord) => coord.region === region
                        );
                        if (localCoord) {
                            mappedValues.push({
                                region: region,
                                island: localCoord.island,
                                coorLat: localCoord.coorLat,
                                coorLng: localCoord.coorLng,
                                value: response.data[0][region],
                            });
                        }
                    }

                    const islandTotals = mappedValues.reduce((acc, curr) => {
                        acc[curr.island] = (acc[curr.island] || 0) + curr.value;
                        return acc;
                    }, {});
                    const islandTotalsArray = Object.entries(islandTotals).map(
                        ([island, total]) => ({ island, total })
                    );
                    setPiechartLabels(
                        islandTotalsArray.map((item) => item.island)
                    );
                    setSpecificPiechartValueMonth(
                        islandTotalsArray.map((item) => item.total)
                    );
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_foreign_by_area`,
                    requestData
                )
                .then((response) => {
                    const regionTotals = {};
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
                                    const region = country["region"];
                                    const value = parseInt(country["value"]);
                                    // Add value to region total (initialize to 0 if region not seen before)
                                    regionTotals[region] =
                                        (regionTotals[region] || 0) + value;
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
                            continent: coord.continent,
                            region: coord.region,
                            TOTAL: regionTotals[coord.region] || 0,
                        };
                        resultArray.push(newObj);
                    });

                    let continentTotal = {};
                    resultArray.forEach((item) => {
                        if (!continentTotal[item.continent])
                            continentTotal[item.continent] = 0;
                        continentTotal[item.continent] += item.TOTAL;
                    });

                    console.log("FOREIGN: ", continentTotal);
                    setPiechartLabels(Object.keys(continentTotal));
                    setSpecificPiechartValueYear(Object.values(continentTotal));
                })
                .catch((error) => console.error("Error:", error));
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_foreign_by_area_by_month`,
                    requestData
                )
                .then((response) => {
                    const regionTotals = {};
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
                                    const region = country["region"];
                                    const value = parseInt(country["value"]);
                                    // Add value to region total (initialize to 0 if region not seen before)
                                    regionTotals[region] =
                                        (regionTotals[region] || 0) + value;
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
                            continent: coord.continent,
                            region: coord.region,
                            TOTAL: regionTotals[coord.region] || 0,
                        };
                        resultArray.push(newObj);
                    });

                    let continentTotal = {};
                    resultArray.forEach((item) => {
                        if (!continentTotal[item.continent])
                            continentTotal[item.continent] = 0;
                        continentTotal[item.continent] += item.TOTAL;
                    });

                    console.log("FOREIGN: ", continentTotal);
                    setPiechartLabels(Object.keys(continentTotal));
                    setSpecificPiechartValueMonth(
                        Object.values(continentTotal)
                    );
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    return (
        <Box
            sx={{
                bgcolor: "#EEEEEE",
            }}
        >
            <DashboardTempC
                dataSelector={[
                    {
                        key: 1,
                        label: "Age Group",
                    },
                    {
                        key: 2,
                        label: "Sex",
                    },
                    {
                        key: 3,
                        label: "Domestic Tourists",
                    },
                    {
                        key: 4,
                        label: "Foreign Tourists",
                    },
                ]}
                role={roleIdentify}
                accname={dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
                dashName1={"Market Segments"}
                dashHint={"Ratio of guests between Male and Female"}
                dateValue={year}
                dateHandler={handleChangeFilter}
                dateOption={years}
                dateText={"Filter by Year"}
                toggleValue={selector}
                toggleHandler={(event, newSelector) => {
                    if (newSelector !== null) {
                        setIsButtonDisabled(true);
                        setSelector(newSelector);
                        handleFilterClick();
                        setTimeout(() => {
                            setIsButtonDisabled(false);
                        }, 2000);
                    }
                }}
                toggleHandlerDisable={isButtonDisabled}
                monthDefault={month}
                monthHandler={(event, newValue) => {
                    setMonth(newValue);
                }}
                chartTitle1={selector}
                chartTitle1Bold={` - ${month}`}
                chartTitle1Hint={`${selector} for the month of ${month}`}
                pieChart1Label={piechartLabels}
                pieChart1Value={piechartValueMonth}
                chartTitle2={selector}
                chartTitle2Bold={` - ${year}`}
                chartTitle2Hint={`${selector} for the year of ${year}`}
                pieChart2Label={piechartLabels}
                pieChart2Value={piechartValueYear}
                municipalityDefault={municipalityDefault}
                municHandler={(event, newValue) => {
                    setMunicipalityDefault(newValue); // Set the selected value in municipalityDefault

                    // Check if newValue is not null and has an 'id' property
                    if (newValue && newValue.id) {
                        setMunicipality(newValue.id);
                    } else {
                        setMunicipality(null); // Handle the case where newValue is null or does not have an 'id'
                    }
                }}
                municOption={municipalityArray}
                municFilterText={"Filter by Municipality"}
                establishmentDefault={establishmentDefault}
                establishHandler={(event, newValue) => {
                    setEstablishmentDefault(newValue); // Set the selected value in municipalityDefault

                    // Check if newValue is not null and has an 'id' property
                    if (newValue && newValue.id) {
                        setEstablishment(newValue.id);
                    } else {
                        setEstablishment(null); // Handle the case where newValue is null or does not have an 'id'
                    }
                }}
                establishOptions={establishmentArray}
                establishFilterText={"Filter by Establishment"}
                chartTitle3={selector}
                chartTitle3Bold={
                    municipalityDefault || establishmentDefault
                        ? ` - ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          } - ${month}`
                        : ""
                }
                chartTitle3Hint={`${selector} for the month of ${month}`}
                pieChart3Label={piechartLabels}
                pieChart3Value={specificPiechartValueMonth}
                chartTitle4={selector}
                chartTitle4Bold={
                    municipalityDefault || establishmentDefault
                        ? ` - ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          } - ${year}`
                        : ""
                }
                chartTitle4Hint={`${selector} for the year of ${year}`}
                pieChart4Label={piechartLabels}
                pieChart4Value={specificPiechartValueYear}
            />
        </Box>
    );
}

export default SexMenu;
