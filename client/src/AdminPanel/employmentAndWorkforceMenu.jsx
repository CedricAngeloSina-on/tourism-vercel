import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import DashboardTempA from "../assets/components/dashboardTempA";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useOutletContext } from "react-router-dom";

function EmploymentAndWorkForceMenu() {
    const passedData = useOutletContext();
    console.log(passedData);

    const currentYear = new Date().getFullYear().toString();
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year.toString());
    }

    //Employment and Workforce
    const [employmentAndWorkforce, setEmploymentAndWorkforce] = useState(0);
    const [lastYearRmploymentAndWorkforce, setLastYearEmploymentAndWorkforce] =
        useState(0);
    //Employment and Workforce for 2nd chart
    const [specificEmploymentAndWorkforce, setSpecificEmploymentAndWorkforce] =
        useState(0);
    const [
        specificLastYearEmploymentAndWorkforce,
        setSpecificLastYearEmploymentAndWorkforce,
    ] = useState(0);
    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState(0);

    //State for selector chip
    const [selector, setSelector] = useState("Employment Status");

    //year
    const [year, setYear] = useState(currentYear);

    //Initial Employment And Workforce Barchart values and labels
    const [employmentAndWorkforceBarChart, setEmploymentAndWorkforceBarChart] =
        useState({});
    const [
        employmentAndWorkforceBarChartLabel,
        setEmploymentAndWorkforceBarChartLabel,
    ] = useState({});
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
                console.log(roleIdentify);
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
        console.log(barchartValue);
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
            employmentAndWorkforceBarChart,
            employmentAndWorkforceBarChartLabel,
            setBarchartValue,
            setPiechartValue,
            setLabelPiechart
        );
    }, [employmentAndWorkforceBarChart]);

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

    //Get Employment and Workforce
    function fetchDataForDashboard(filterType, filterValue, year) {
        const requestData = {
            filterType: filterType,
            filterValue: filterValue,
            year: year,
        };

        console.log(requestData);

        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}/get_total_employment_status`,
            requestData,
            (data) => {
                setEmploymentAndWorkforce(data);
            }
        );

        //this is for last year
        fetchData(
            `${
                import.meta.env.VITE_WEBSITE_URL
            }/get_last_year_total_employment_status`,
            requestData,
            (data) => {
                setLastYearEmploymentAndWorkforce(data);
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

                setEmploymentAndWorkforceBarChart(dynamicArrivalsBarChart);
                setEmploymentAndWorkforceBarChartLabel(
                    dynamicArrivalsBarChartLabel
                );
                setLabelBarchart(labels);
            } else {
                setEmploymentAndWorkforceBarChart({});
                setEmploymentAndWorkforceBarChartLabel([]);
                setLabelBarchart([]);
            }
        };

        if (selector === "Employment Status") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_employment_status`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Sex") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_employment_sex`,
                    requestData
                )
                .then(processBarChartData)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Job Positions") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_jobs`,
                    requestData
                )
                .then((response) => {
                    const aggregatedJobsByMonth = {};

                    const uniqueJobNames = new Set();

                    response.data.forEach((item) => {
                        const jobs = JSON.parse(item.jobs);
                        const month = item.GroupBy;
                        const jobValues = {};

                        jobs.forEach((job) => {
                            const { name, value } = job;
                            uniqueJobNames.add(name);
                            jobValues[name] =
                                (jobValues[name] || 0) + parseInt(value);
                        });

                        if (!aggregatedJobsByMonth[month]) {
                            aggregatedJobsByMonth[month] = {
                                ...jobValues,
                                GroupBy: month,
                            };
                        } else {
                            Object.keys(jobValues).forEach((jobName) => {
                                aggregatedJobsByMonth[month][jobName] =
                                    (aggregatedJobsByMonth[month][jobName] ||
                                        0) + jobValues[jobName];
                            });
                        }
                    });
                    const allUniqueJobNames = Array.from(uniqueJobNames);
                    const finalResult = Object.values(
                        aggregatedJobsByMonth
                    ).map((monthData) => {
                        allUniqueJobNames.forEach((jobName) => {
                            if (!(jobName in monthData)) {
                                monthData[jobName] = 0;
                            }
                        });
                        return monthData;
                    });
                    response.data = finalResult;
                    processBarChartData(response);
                })
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
            `${
                import.meta.env.VITE_WEBSITE_URL
            }/get_last_year_arrivals_by_area`,
            requestData,
            (data) => {
                setSpecificLastYearEmploymentAndWorkforce(data);
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
                setSpecificEmploymentAndWorkforce(totalSum);
                setSpecificBarChart(dynamicArrivalsBarChart);
                setSpecificBarChartLabel(dynamicArrivalsBarChartLabel);
                setSpecificLabelBarchart(labels);
            } else {
                setSpecificEmploymentAndWorkforce(0);
                setSpecificBarChart({});
                setSpecificBarChartLabel([]);
                setSpecificLabelBarchart([]);
            }
        };

        if (selector === "Employment Status") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_employment_status_by_area`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Sex") {
            axios
                .post(
                    `${
                        import.meta.env.VITE_WEBSITE_URL
                    }/get_employment_sex_by_area`,
                    requestData
                )
                .then(processBarChartData2)
                .catch((error) => console.error("Error:", error));
        } else if (selector === "Job Positions") {
            axios
                .post(
                    `${import.meta.env.VITE_WEBSITE_URL}/get_jobs_by_area`,
                    requestData
                )
                .then((response) => {
                    const aggregatedJobsByMonth = {};

                    const uniqueJobNames = new Set();

                    response.data.forEach((item) => {
                        const jobs = JSON.parse(item.jobs);
                        const month = item.GroupBy;
                        const jobValues = {};

                        jobs.forEach((job) => {
                            const { name, value } = job;
                            uniqueJobNames.add(name);
                            jobValues[name] =
                                (jobValues[name] || 0) + parseInt(value);
                        });

                        if (!aggregatedJobsByMonth[month]) {
                            aggregatedJobsByMonth[month] = {
                                ...jobValues,
                                GroupBy: month,
                            };
                        } else {
                            Object.keys(jobValues).forEach((jobName) => {
                                aggregatedJobsByMonth[month][jobName] =
                                    (aggregatedJobsByMonth[month][jobName] ||
                                        0) + jobValues[jobName];
                            });
                        }
                    });
                    const allUniqueJobNames = Array.from(uniqueJobNames);
                    const finalResult = Object.values(
                        aggregatedJobsByMonth
                    ).map((monthData) => {
                        allUniqueJobNames.forEach((jobName) => {
                            if (!(jobName in monthData)) {
                                monthData[jobName] = 0;
                            }
                        });
                        return monthData;
                    });
                    response.data = finalResult;
                    processBarChartData2(response);
                })
                .catch((error) => console.error("Error:", error));
        }
    }

    // Basically, setting the values for selectors, for example ~
    // ~ Province account gets municipality names
    //Handling input for selector Province
    // const handleChangeMunic = (event) => {
    //   setMunicipality(event.target.value);
    // };
    // ~ Municipality account gets establishment names
    //Handling input for selector Municipality
    // const handleChangeEstablish = (event) => {
    //   setEstablishment(event.target.value);
    // };

    //Handle filter click (choosing between sex, orgin, ae, etc...)
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
                        label: "Employment and Workforce",
                        hint: "Sum of all guest Employment and Workforce in",
                    },
                    {
                        key: 2,
                        label: "Ratio",
                        hint: "Pie chart showing the Employment and Workforce for each demographic in",
                    },
                ]}
                dataSelector={[
                    {
                        key: 1,
                        label: "Employment Status",
                    },
                    {
                        key: 2,
                        label: "Sex",
                    },
                    {
                        key: 3,
                        label: "Job Positions",
                    },
                ]}
                role={roleIdentify}
                accname={dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
                dashName1={"Employment and Workforce"}
                dashHint={
                    "Guests arriving in accomodation establishments regardless if overnight or not"
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
                barChart1Title={`Employment and Workforce Chart`}
                barChart1Bold={` - ${selector}`}
                barChart1Hint={`Bar chart showing the Employment and Workforce each month for ${dashboardName}`}
                barChart1Value={barchartValue}
                barChart1Label={labelBarchart}
                isStacked={true}
                card1LastValue={lastYearRmploymentAndWorkforce}
                card1Value={employmentAndWorkforce}
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
                barChart2Title={"Employment and Workforce Chart"}
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
                        ? `Bar chart showing the Employment and Workforce each month for ${
                              municipalityDefault?.name ||
                              establishmentDefault?.name
                          }`
                        : ""
                }
                barChart2Value={specificBarchartValue}
                barChart2Label={specificLabelBarchart}
                card2LastValue={specificLastYearEmploymentAndWorkforce}
                card2Value={specificEmploymentAndWorkforce}
                pieChart2Value={specificPiechartValue}
                pieChart2Label={labelSpecificPiechart}
            />
        </Box>
    );
}

export default EmploymentAndWorkForceMenu;
