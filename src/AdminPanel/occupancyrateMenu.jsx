import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import DashboardTempA from "../assets/components/dashboardTempA";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Bar } from "react-chartjs-2";

function OccupancyRateMenu() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }
    //Total OR
    const [OR, setOR] = useState(0);
    const [lastYearOR, setLastYearOR] = useState(0);
    //Total OR for 2nd chart
    const [specificOR, setSpecificOR] = useState(0);
    const [specificLastYearOR, setSpecificLastYearOR] = useState(0);
    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);

    //State for selector chip
    const [selector, setSelector] = useState("Overall");

    //year
    const [year, setYear] = useState(currentYear);

    //Initial OR Barchart values
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
                `${import.meta.env.VITE_WEBSITE_URL}:${
                    import.meta.env.VITE_PORT
                }/get_establishments`,
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
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_dashboard_name`,
            requestData,
            (data) => {
                setDashboardName(data.toLocaleString());
            }
        );
    }

    //Get Total OR
    function fetchDataForDashboard(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        console.log(requestData);

        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_occupancy_rate`,
            requestData,
            (data) => {
                setOR(Number(data).toFixed(2));
            }
        );

        //this is for last year
        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_last_year_occupancy_rate`,
            requestData,
            (data) => {
                setLastYearOR(Number(data).toFixed(2));
            }
        );
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

        if (selector === "Overall") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_occupancy_rate_by_overall_barchart`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Establishment Type") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_occupancy_rate_by_aetypes_barchart`,
                    requestData
                )
                .then(processBarChartData)
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

        //this api fetches the last year total data
        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_last_year_occupancy_rate_by_area`,
            requestData,
            (data) => {
                setSpecificLastYearOR(Number(data).toFixed(2));
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

                const totalValuesCount = Object.values(
                    dynamicArrivalsBarChart
                ).reduce((acc, dataset) => acc + dataset.length, 0);

                const specificOR = Number(
                    (totalSum / totalValuesCount).toFixed(2)
                ); // Change to actual query ////////////////////////////////////////////////////////////////////////////////
                // Assuming you have a state variable named totalSumState and a setter function setTotalSumState
                setSpecificOR(specificOR);
                setSpecificBarChart(dynamicArrivalsBarChart);
                setSpecificBarChartLabel(dynamicArrivalsBarChartLabel);
                setSpecificLabelBarchart(labels);
            } else {
                setSpecificOR(0);
                setSpecificBarChart({});
                setSpecificBarChartLabel([]);
                setSpecificLabelBarchart([]);
            }
        };

        if (selector === "Overall") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_occupancy_rate_by_overall_by_area_barchart`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Establishment Type") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_occupancy_rate_by_aetypes_by_area_barchart`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        }
    }

    //Handle changing date filter (Month, Year)
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
            <DashboardTempA
                layoutArray={[
                    {
                        key: 1,
                        label: "Average Occupancy Rate",
                        hint: "General average occupancy rate in",
                    },
                ]}
                dataSelector={[
                    {
                        key: 0,
                        label: "Overall",
                    },
                    {
                        key: 1,
                        label: "Establishment Type",
                    },
                ]}
                role={roleIdentify}
                accname={dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
                dashName1={"Average Occupancy Rate"}
                dashHint={
                    "The average occupancy rate (AOcc) of guests. The formula for AOcc is Occupied Rooms / Number of Rooms for the Month"
                }
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
                barChart1Title={`Average Occupancy Rate Chart`}
                barChart1Bold={` - ${selector}`}
                barChart1Hint={`Line chart showing the average occupancy rate each month for ${dashboardName}`}
                {...(selector === "Establishment Type"
                    ? {
                          lineChart1Value: barchartValue,
                          lineChart1Label: labelBarchart,
                      }
                    : {
                          lineChart1Value: barchartValue,
                          lineChart1Label: labelBarchart,
                      })}
                card1LastValue={lastYearOR}
                card1Value={`${OR}%`}
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
                barChart2Title={"Average Occupancy Rate Chart"}
                barChart2Bold={
                    municipalityDefault || establishmentDefault
                        ? ` - ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                barChart2Hint={
                    municipalityDefault || establishmentDefault
                        ? `Line chart showing the average occupancy rate each month for ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                {...(selector === "Establishment Type"
                    ? {
                          lineChart2Value: specificBarchartValue,
                          lineChart2Label: specificLabelBarchart,
                      }
                    : {
                          lineChart2Value: specificBarchartValue,
                          lineChart2Label: specificLabelBarchart,
                      })}
                card2LastValue={specificLastYearOR}
                card2Value={`${specificOR}%`}
                pieChart2Value={specificPiechartValue}
                pieChart2Label={labelSpecificPiechart}
            />
        </Box>
    );
}

export default OccupancyRateMenu;
