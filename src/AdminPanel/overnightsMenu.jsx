import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import DashboardTempA from "../assets/components/dashboardTempA";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function OvernightsMenu() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    //Total overnights
    const [overnights, setOvernights] = useState(0);
    const [lastYearOvernights, setLastYearOvernights] = useState(0);
    //Total overnights for 2nd chart
    const [specificOvernights, setSpecificOvernights] = useState(0);
    const [specificLastYearOvernights, setSpecificLastYearOvernights] =
        useState(0);
    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);

    //State for selector chip
    const [selector, setSelector] = useState("Sex");

    //year
    const [year, setYear] = useState(currentYear);

    //Initial overnights Barchart values
    const [overnightsBarChart, setOvernightsBarChart] = useState({});
    const [overnightsBarChartLabel, setOvernightsBarChartLabel] = useState({});
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
            overnightsBarChart,
            overnightsBarChartLabel,
            setBarchartValue,
            setPiechartValue,
            setLabelPiechart
        );
    }, [overnightsBarChart]);

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

    //Get Total overnights
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
            }/get_overnights`,
            requestData,
            (data) => {
                setOvernights(data);
            }
        );

        //this is for last year
        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}:${
                import.meta.env.VITE_PORT
            }/get_last_year_overnights`,
            requestData,
            (data) => {
                setLastYearOvernights(data);
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
                        (item) => item[key]
                    );
                    dynamicArrivalsBarChartLabel[labelKey] = key;
                });

                setOvernightsBarChart(dynamicArrivalsBarChart);
                setOvernightsBarChartLabel(dynamicArrivalsBarChartLabel);
                setLabelBarchart(labels);
            } else {
                setOvernightsBarChart({});
                setOvernightsBarChartLabel([]);
                setLabelBarchart([]);
            }
        };

        if (selector === "Sex") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_sex_barchart`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Origin") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_origin_barchart`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Establishment Type") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_aetypes_barchart`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        }
    }

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
            }/get_last_year_overnights_by_area`,
            requestData,
            (data) => {
                setSpecificLastYearOvernights(data);
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
                        (item) => item[key]
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

                // Assuming you have a state variable named totalSumState and a setter function setTotalSumState
                setSpecificOvernights(totalSum);
                setSpecificBarChart(dynamicArrivalsBarChart);
                setSpecificBarChartLabel(dynamicArrivalsBarChartLabel);
                setSpecificLabelBarchart(labels);
            } else {
                setSpecificOvernights(0);
                setSpecificBarChart({});
                setSpecificBarChartLabel([]);
                setSpecificLabelBarchart([]);
            }
        };

        if (selector === "Sex") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_sex_by_area_barchart`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Origin") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_origin_by_area_barchart`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Establishment Type") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}:${
                        import.meta.env.VITE_PORT
                    }/get_overnights_by_aetypes_by_area_barchart`,
                    requestData
                )
                .then(processBarChartData2)
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
                        label: "Total Guest Nights",
                        hint: "Sum of all guest nights in",
                    },
                    {
                        key: 2,
                        label: "Demographic Ratio",
                        hint: "Pie chart showing the total guest nights for each demographic in",
                    },
                ]}
                dataSelector={[
                    {
                        key: 0,
                        label: "Sex",
                    },
                    {
                        key: 1,
                        label: "Origin",
                    },
                    {
                        key: 2,
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
                dashName1={"Overnights"}
                dashHint={
                    "Guests staying through the night in accomodation establishments"
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
                barChart1Title={`Total guest nights Chart`}
                barChart1Bold={` - ${selector}`}
                barChart1Hint={`Bar chart showing the total guest nights each month for ${dashboardName}`}
                barChart1Value={barchartValue}
                barChart1Label={labelBarchart}
                isStacked={true}
                card1LastValue={lastYearOvernights}
                card1Value={overnights}
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
                barChart2Title={"Total Guest Nights Chart"}
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
                        ? `Bar chart showing the total guest nights each month for ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                barChart2Value={specificBarchartValue}
                barChart2Label={specificLabelBarchart}
                card2LastValue={specificLastYearOvernights}
                card2Value={specificOvernights}
                pieChart2Value={specificPiechartValue}
                pieChart2Label={labelSpecificPiechart}
            />
        </Box>
    );
}

export default OvernightsMenu;
