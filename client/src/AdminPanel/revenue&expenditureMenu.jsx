import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardTempB from "../assets/components/dashboardTempB";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function RevenueMenu() {
    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }
    //Total overnights
    const [overnights, setOvernights] = useState(0);
    const [dashboardName, setDashboardName] = useState("Dashboard Name");
    const [roleIdentify, setRoleIdentify] = useState(0);

    //State for selector chip
    const [selector, setSelector] = useState("Overall");

    //year
    const [year, setYear] = useState(currentYear);
    const nextYear = parseInt(year) + 1;

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

    const navigate = useNavigate();

    const layoutArray = [
        {
            key: 1,
            label: "Total Guest overnights",
            value: overnights,
        },
        {
            key: 2,
            label: "Demographic Ratio",
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
                                userID.provinceID
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
                                userID.municipalityID
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
                                userID.establishmentID
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

    function fetchMunicipalities(provinceID) {
        const requestData = {
            provinceID: provinceID,
        };

        axios
            .post("localhost:5000/get_municipalities", requestData)
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
            .post("localhost:5000/get_establishments", requestData)
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
                console.log(establishmentArray);
                console.log(establishment);
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

        fetchData("localhost:5000/get_dashboard_name", requestData, (data) => {
            setDashboardName(data.toLocaleString());
        });
    }

    //Get Total overnights
    function fetchDataForDashboard(filterType, filterValue) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
        };

        console.log(requestData);

        // fetchData(
        //     "localhost:5000/get_overnights",
        //     requestData,
        //     (data) => {
        //         setOvernights(data.toLocaleString());
        //     }
        // );
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

        axios
            .post(
                "localhost:5000/get_revenue_and_expenditure_barchart",
                requestData
            )
            .then(processBarChartData)
            .catch((error) => console.error("Error:", error));
    }

    function fetchBarChart2(filterType, filterValue, year, areaID) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
            areaID: areaID,
        };

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
                setSpecificBarChart(dynamicArrivalsBarChart);
                setSpecificBarChartLabel(dynamicArrivalsBarChartLabel);
                setSpecificLabelBarchart(labels);
            } else {
                console.error("Invalid response format");
                setSpecificBarChart({});
                setSpecificBarChartLabel([]);
                setSpecificLabelBarchart([]);
            }
        };

        axios
            .post(
                "localhost:5000/get_revenue_and_expenditure_by_area_barchart",
                requestData
            )
            .then(processBarChartData2)
            .catch((error) => console.error("Error:", error));
    }

    const handleChangeMunic = (event) => {
        setMunicipality(event.target.value);
    };

    //Handling input for selector Municipality
    const handleChangeEstablish = (event) => {
        setEstablishment(event.target.value);
    };

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
            <DashboardTempB
                role={roleIdentify}
                accname={dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
                dashName1={"Revenue and Expenditure"}
                dashHint={
                    "Revenue and expenditure is the flow of money into and out of an entity, representing income generated and spending incurred."
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
                barChart1Title={"Revenue and Expenditure"}
                barChart1Hint={`Combo bar chart showing the revenue and expenditure each month for ${dashboardName}`}
                barChart1Value={barchartValue}
                barChart1Label={labelBarchart}
                isStacked={false}
                lineOption={"Income"}
                lineChart1Tension={"monotone"}
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
                barChart2Title={"Revenue and Expenditure"}
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
                        ? `Combo bar chart showing the revenue and expenditure each month for ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                barChart2Value={specificBarchartValue}
                barChart2Label={specificLabelBarchart}
                lineChart2Tension={"monotone"}
            />
        </Box>
    );
}

export default RevenueMenu;
