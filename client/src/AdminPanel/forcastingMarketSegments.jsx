import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import DashboardTempB from "../assets/components/dashboardTempB";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { ForeignCoords } from "../assets/components/arraySource";
const foreignCoordinates = ForeignCoords;

function ForcastMarketSegmentsMenu() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }
    //Total ALOS
    const [ALOS, setALOS] = useState(0);
    const [lastYearALOS, setLastYearALOS] = useState(0);
    //Total ALOS for 2nd chart
    const [specificALOS, setSpecificALOS] = useState(0);
    const [specificLastYearALOS, setSpecificLastYearALOS] = useState(0);
    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);

    //State for selector chip
    const [selector, setSelector] = useState("Age Group");

    //year
    const [year, setYear] = useState(currentYear);
    const nextYear = parseInt(year) + 1;

    //Initial ALOS Barchart values
    const [ALOSBarChart, setALOSBarChart] = useState({});
    const [ALOSBarChartLabel, setALOSBarChartLabel] = useState({});
    const [specificBarChart, setSpecificBarChart] = useState({});
    const [specificBarChartLabel, setSpecificBarChartLabel] = useState({});

    //Formatted Barchart labels
    const [labelBarchart, setLabelBarchart] = useState([]);
    const [specificLabelBarchart, setSpecificLabelBarchart] = useState([]);

    // Formatted Barchart values
    const [barchartValue, setBarchartValue] = useState([]);
    const [specificBarchartValue, setSpecificBarchartValue] = useState([]);

    // Formatted Piechart labels
    const [labelPiechart, setLabelPiechart] = useState([]);
    const [labelSpecificPiechart, setLabelSpecificPiechart] = useState([]);

    // Formatted Piechart
    const [piechartValue, setPiechartValue] = useState([]);
    const [specificPiechartValue, setSpecificPiechartValue] = useState([]);

    const [userData, setUserData] = useState(null);

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

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [jobTitles, setJobTitles] = useState([]);

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
                                year
                            );
                            fetchBarChart2(
                                "provinces.id",
                                userID.provinceID,
                                year,
                                municipality
                            );
                            break;
                        case 2:
                            console.log(userID.municipalityID);
                            fetchEstablishments(userID.municipalityID);
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
                            fetchBarChart2(
                                "municipalities.id",
                                userID.municipalityID,
                                year,
                                establishment
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

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/get_job_titles`)
            .then((response) => {
                console.log("JOB ROLES: ", response.data);
                setJobTitles(response.data);
                // setSelector(response.data[0].name);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, []);

    useEffect(() => {
        if (userData) {
            switch (userData.account_roleID) {
                case 1:
                    fetchBarChart2(
                        "provinces.id",
                        userData.provinceID,
                        year,
                        municipality
                    );
                    break;
                case 2:
                    fetchBarChart2(
                        "municipalities.id",
                        userData.municipalityID,
                        year,
                        establishment
                    );
                    break;
                default:
                    console.log("hehehe");
                    break;
            }
        }
    }, [municipality, establishment]);

    useEffect(() => {
        handleFilterClick();
    }, [selector]);

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
                setMunicipality(municipalityData[0].id);
                setMunicipalityDefault(municipalityData[0]);
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
                setEstablishment(establishmentData[0].id);
                setEstablishmentDefault(establishmentData[0]);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }

    const mapChartData = (chart, labelMap) =>
        Object.keys(chart)
            .map((key, index) => {
                const label = labelMap[`label${index + 1}`];
                const data = chart[key];

                if (
                    !key ||
                    index == null ||
                    !label ||
                    !data ||
                    data.length === 0
                ) {
                    return null;
                }

                return { label, data };
            })
            .filter(Boolean);

    const processChartData = (
        barChart,
        barChartLabel,
        setBarchartValue,
        setPiechartValue,
        setLabelPiechart
    ) => {
        const chartData = mapChartData(barChart, barChartLabel);
        setBarchartValue(chartData);

        const aggregatedChartData = chartData.reduce((acc, { label, data }) => {
            acc[label] =
                (acc[label] || 0) + data.reduce((sum, value) => sum + value, 0);
            return acc;
        }, {});

        const chartLabels = chartData.map(({ label }) => label);
        setPiechartValue(Object.values(aggregatedChartData));
        setLabelPiechart(chartLabels);
    };

    useEffect(() => {
        processChartData(
            ALOSBarChart,
            ALOSBarChartLabel,
            setBarchartValue,
            setPiechartValue,
            setLabelPiechart
        );
    }, [ALOSBarChart]);

    useEffect(() => {
        processChartData(
            specificBarChart,
            specificBarChartLabel,
            setSpecificBarchartValue,
            setSpecificPiechartValue,
            setLabelSpecificPiechart
        );
    }, [specificBarChart]);

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

    //Get Total ALOS
    function fetchDataForDashboard(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        console.log(requestData);

        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}/get_alos`,
            requestData,
            (data) => {
                setALOS(Number(data).toFixed(2));
            }
        );

        //this is for last year
        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}/get_last_year_alos`,
            requestData,
            (data) => {
                setLastYearALOS(Number(data).toFixed(2));
            }
        );
    }

    function projectValues(data, jobTitles, startYear, numYears) {
        const projectedData = [];
        projectedData.push(...data);

        for (let i = 0; i < numYears; i++) {
            const projectedYear = startYear + i + 1;
            const projectedEntry = { GroupBy: projectedYear };

            jobTitles.forEach((title) => {
                if (title.value !== 0) {
                    // Assuming 5% increase each year
                    const initialYear = data[0]["GroupBy"];
                    const lastYear = data[data.length - 1]["GroupBy"];
                    const lastYearValue = data[data.length - 1][title] || 0;
                    const yearsPassed = projectedYear - lastYear;
                    const increasePercentage = 0.05;
                    const projectedValue = Math.round(
                        lastYearValue *
                            Math.pow(1 + increasePercentage, yearsPassed)
                    );
                    projectedEntry[title] = projectedValue;
                } else {
                    // For other titles, assuming no change
                    projectedEntry[title] = 0; // Assuming no change or very low growth
                }
            });

            projectedData.push(projectedEntry);
        }

        return projectedData;
    }

    //Fetching data for BarChart and PieChart
    function fetchBarChart(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        const processBarChartData = (response) => {
            if (Array.isArray(response.data) && response.data.length > 0) {
                const variableNames = Object.keys(response.data[0]);
                const labels = response.data.map((item) => item.GroupBy);

                const filteredVariableNames = variableNames.filter(
                    (key) =>
                        key !== "GroupBy" &&
                        typeof response.data[0][key] !== "string"
                );

                const dynamicArrivalsBarChart = {};
                const dynamicArrivalsBarChartLabel = {};

                filteredVariableNames.forEach((key, index) => {
                    const datasetKey = `dataset${index + 1}`;
                    const labelKey = `label${index + 1}`;

                    dynamicArrivalsBarChart[datasetKey] = response.data.map(
                        (item) => parseFloat(Number(item[key]).toFixed(2))
                    );
                    dynamicArrivalsBarChartLabel[labelKey] = key;
                });

                setALOSBarChart(dynamicArrivalsBarChart);
                setALOSBarChartLabel(dynamicArrivalsBarChartLabel);
                setLabelBarchart(labels);
            } else {
                setALOSBarChart({});
                setALOSBarChartLabel([]);
                setLabelBarchart([]);
            }
        };

        if (selector === "Age Group") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_forecasting_ages`,
                    requestData
                )
                .then((response) => {
                    const ageGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );
                    response.data = projectValues(
                        response.data,
                        ageGroup,
                        parseInt(year),
                        5
                    );
                    processBarChartData(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector == "Sex") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_forecasting_sex`,
                    requestData
                )
                .then((response) => {
                    const sexGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );
                    response.data = projectValues(
                        response.data,
                        sexGroup,
                        parseInt(year),
                        5
                    );
                    processBarChartData(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector == "Domestic Tourists") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_forecasting_local`,
                    requestData
                )
                .then((response) => {
                    const localGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );
                    console.log("asdasdasdasd", response.data);
                    response.data = projectValues(
                        response.data,
                        localGroup,
                        parseInt(year),
                        5
                    );
                    console.log("asdasdasdasd", response.data);
                    processBarChartData(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_forecasting_foreign`,
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
                    continentTotal.GroupBy = response.data[0].GroupBy;
                    // Wrapping continentTotal in an array
                    continentTotal = [continentTotal];

                    const foreignGroup = Array.from(
                        new Set(
                            continentTotal.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );
                    console.log("FOREIGN: ", continentTotal);

                    response.data = projectValues(
                        continentTotal,
                        foreignGroup,
                        parseInt(year),
                        5
                    );
                    console.log("FOREIGN: ", response.data);
                    processBarChartData(response);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    const handleFilterClick = () => {
        // Call the fetchBarChart function with the selected filter

        const userID = userData;

        if (userID) {
            switch (userID.account_roleID) {
                case 1:
                    fetchBarChart("provinces.id", userID.provinceID, year);
                    fetchBarChart2(
                        "provinces.id",
                        userID.provinceID,
                        year,
                        municipality
                    );
                    break;
                case 2:
                    fetchBarChart(
                        "municipalities.id",
                        userID.municipalityID,
                        year
                    );
                    fetchBarChart2(
                        "municipalities.id",
                        userID.municipalityID,
                        year,
                        establishment
                    );
                    break;
                case 3:
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
    };

    function fetchBarChart2(filterType, filterValue, year, areaID) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
            areaID: areaID,
        };

        // DANIEL HERE
        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}/get_alos_by_area`,
            requestData,
            (data) => {
                setSpecificALOS(Number(data).toFixed(2));
            }
        );

        const processBarChartData2 = (response) => {
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log(response.data);
                const variableNames = Object.keys(response.data[0]);
                const labels = response.data.map((item) => item.GroupBy);
                const filteredVariableNames = variableNames.filter(
                    (key) =>
                        key !== "GroupBy" &&
                        typeof response.data[0][key] !== "string"
                );
                const dynamicArrivalsBarChart = {};
                const dynamicArrivalsBarChartLabel = {};
                filteredVariableNames.forEach((key, index) => {
                    const datasetKey = `dataset${index + 1}`;
                    const labelKey = `label${index + 1}`;
                    dynamicArrivalsBarChart[datasetKey] = response.data.map(
                        (item) => parseFloat(Number(item[key]).toFixed(2))
                    );
                    dynamicArrivalsBarChartLabel[labelKey] = key;
                });
                // Calculate the sum of all values inside dynamicArrivalsBarChart
                const totalSum = Object.values(dynamicArrivalsBarChart).reduce(
                    (acc, dataset) =>
                        acc +
                        dataset.reduce(
                            (datasetSum, value) => datasetSum + value,
                            0
                        ),
                    0
                );

                setSpecificBarChart(dynamicArrivalsBarChart);
                setSpecificBarChartLabel(dynamicArrivalsBarChartLabel);
                setSpecificLabelBarchart(labels);
            } else {
                setSpecificALOS(0);
                setSpecificBarChart({});
                setSpecificBarChartLabel([]);
                setSpecificLabelBarchart([]);
            }
        };

        if (selector === "Age Group") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_forecasting_ages_by_area`,
                    requestData
                )
                .then((response) => {
                    const ageGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );

                    response.data = projectValues(
                        response.data,
                        ageGroup,
                        parseInt(year),
                        5
                    );
                    processBarChartData2(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector == "Sex") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_forecasting_sex_by_area`,
                    requestData
                )
                .then((response) => {
                    const sexGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );

                    response.data = projectValues(
                        response.data,
                        sexGroup,
                        parseInt(year),
                        5
                    );
                    processBarChartData2(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector == "Domestic Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_forecasting_local_by_area`,
                    requestData
                )
                .then((response) => {
                    const localGroup = Array.from(
                        new Set(
                            response.data.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );

                    response.data = projectValues(
                        response.data,
                        localGroup,
                        parseInt(year),
                        5
                    );
                    processBarChartData2(response);
                })
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Foreign Tourists") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_forecasting_foreign_by_area`,
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
                    continentTotal.GroupBy = response.data[0].GroupBy;
                    // Wrapping continentTotal in an array
                    continentTotal = [continentTotal];

                    const foreignGroup = Array.from(
                        new Set(
                            continentTotal.flatMap((obj) =>
                                Object.keys(obj).filter(
                                    (key) => key !== "GroupBy"
                                )
                            )
                        )
                    );
                    console.log("FOREIGN: ", continentTotal);

                    response.data = projectValues(
                        continentTotal,
                        foreignGroup,
                        parseInt(year),
                        5
                    );
                    console.log("FOREIGN: ", response.data);
                    processBarChartData2(response);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    //Handle changing date filter (Month, Year)
    const handleChangeFilter = (event, newValue) => {
        setYear(newValue);
        console.log(newValue);
    };

    console.log(barchartValue);
    console.log(labelBarchart);
    return (
        <Box
            sx={{
                bgcolor: "#EEEEEE",
            }}
        >
            <DashboardTempB
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
                dashName1={"Market Segments Forecast"}
                dashHint={
                    "The average lenght of stay (ALOS) of guests. The formula for ALOS is Guest Nights / Guest Arrivals"
                }
                dateValue={year}
                dateHandler={handleChangeFilter}
                dateOption={years}
                dateText={"Filter by Year"}
                specificSearch={false}
                // specificFilterText={"Search Job Titles"}
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
                barChart1Title={
                    `Forecasting market segments Chart for ` + nextYear
                }
                lineChart1Bold={` - ${selector}`}
                lineChart1Hint={`Line chart showing the market segments each month for ${dashboardName}`}
                lineChart1Value={barchartValue}
                lineChart1Label={labelBarchart}
                isForcasting={true}
                card1LastValue={lastYearALOS}
                card1Value={ALOS}
                pieChart1Value={piechartValue}
                pieChart1Label={labelPiechart}
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
                lineChart2Title={
                    `Forecasting market segments Chart for ` + nextYear
                }
                lineChart2Bold={
                    municipalityDefault || establishmentDefault
                        ? ` - ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                lineChart2Hint={
                    municipalityDefault || establishmentDefault
                        ? `Bar chart showing the market segments each month for ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                lineChart2Value={specificBarchartValue}
                lineChart2Label={specificLabelBarchart}
                // lineChart2Tension={"monotone"}
                card2LastValue={specificLastYearALOS}
                card2Value={specificALOS}
                pieChart2Value={specificPiechartValue}
                pieChart2Label={labelSpecificPiechart}
            />
        </Box>
    );
}

export default ForcastMarketSegmentsMenu;
