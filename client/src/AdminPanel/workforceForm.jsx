import React from "react";
import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Tooltip,
    IconButton,
    Divider,
    Fade,
    TextField,
    Button,
    Snackbar,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CloseIcon from "@mui/icons-material/Close";
import FormCard from "../assets/components/formCard";
import AppBarCustom from "../assets/components/appBar";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { JobTitles, JobSkills } from "../assets/components/arraySource";
import { useOutletContext } from "react-router-dom";

function WorkforceForm() {
    const passedData = useOutletContext();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    function snackOpen() {
        setOpen(true);
    }

    function snackClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    const navigate = useNavigate();

    function snackOpen() {
        setOpen(true);
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

    const [date, setDate] = useState(dayjs(new Date())); // state for date

    const [employeeData, setEmployeeData] = useState([]);
    const [employementDataStatus, setEmployementDataStatus] = useState();

    const [dataWantedJobTitle, setDataWantedJobTitle] = useState([]);
    const [totalWantedJobTitle, setTotalWantedJobTitle] = useState(0);

    const [dataJobTitle, setDataJobTitle] = useState([]);
    const [totalJobTitle, setTotalJobTitle] = useState(0);
    const [jobTitleStatus, setJobTitleStatus] = useState();

    const [selectedChips, setSelectedChips] = useState([]);

    const [isReset, setIsReset] = useState(false);

    const [establishment, setEstablishment] = useState(0); // state for establishment type
    const [dashboardName, setDashboardName] = useState(""); // Dashboard name
    // ALso add roleIdentity, because I can access tabs meant only for munic and province accounts

    const [jobTitles, setJobTitles] = useState();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            navigate("/manage", { replace: true });
                            break;
                        case 2:
                            navigate("/manage", { replace: true });
                            break;
                        case 3:
                            console.log(userID.establishmentID);
                            setEstablishment(userID.establishmentID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
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
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/get_job_titles`)
            .then((response) => {
                console.log("JOB ROLES: ", response.data);
                setJobTitles(response.data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, []);

    function fetchDashboardName(accountID, account_roleID) {
        const requestData = {
            accountID: accountID,
            account_roleID: account_roleID,
        };
        axios
            .post(
                `${import.meta.env.VITE_WEBSITE_URL}/get_dashboard_name`,
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

    const getJobData = (total, dataArray) => {
        const filteredData = dataArray.filter((item) => item.value !== 0);
        setDataJobTitle(filteredData);
        setTotalJobTitle(total);
    };

    const getWantedJobData = (total, dataArray) => {
        const filteredData = dataArray.filter((item) => item.value !== 0);
        setDataWantedJobTitle(filteredData);
        setTotalWantedJobTitle(total);
    };

    useEffect(() => {
        const initializeValues = () => {
            const defaultValues = inputArray.map((roles) => ({
                id: roles.id,
                name: roles.name,
                value: 0,
            }));
            setEmployeeData(defaultValues);
        };

        initializeValues();
    }, []);

    const handleInputChange = (event, roles) => {
        let { value } = event.target;

        if (value !== "") {
            value = value.replace(/^0+/, "");
        }

        let parsedValue = parseInt(value) || 0;

        if (parsedValue < 0) {
            parsedValue = 0;
        } else if (parsedValue > 10000) {
            parsedValue = 10000;
        }

        const finalValue = parsedValue.toString();

        const updatedValues = employeeData.map((r) =>
            r.name === roles.name ? { ...r, value: finalValue } : r
        );

        setEmployeeData(updatedValues);
        console.log(employeeData);
    };

    useEffect(() => {
        // Calculate total for key 0 to 3
        const employment = employeeData
            .filter((item) => item.id >= 0 && item.id <= 3)
            .reduce((acc, curr) => acc + parseInt(curr.value), 0);

        // Calculate total for key 4 to 5
        const sex = employeeData
            .filter((item) => item.id >= 4 && item.id <= 5)
            .reduce((acc, curr) => acc + parseInt(curr.value), 0);

        if (employment !== sex) {
            setEmployementDataStatus(false);
        } else setEmployementDataStatus(true);

        if (employment !== totalJobTitle || sex !== totalJobTitle) {
            setJobTitleStatus(false);
        } else {
            setJobTitleStatus(true);
        }
    }, [employeeData, dataJobTitle]);

    const handleSubmit = async (event) => {
        const dateStr = date.format("YYYY-MM-DD"); //Converts day.js date format to MySQL date format
        event.preventDefault();

        // Validate field contents
        if (date !== "" && employeeData !== "") {
            if (employementDataStatus == true && jobTitleStatus == true) {
                try {
                    const response = await axios.post(
                        `${
                            import.meta.env.VITE_WEBSITE_URL
                        }/create_workforce_entry`,
                        {
                            date: dateStr,
                            establishmentID: establishment,

                            permanentEmployment: employeeData[0].value,
                            jobhireEmployment: employeeData[1].value,
                            projectbasedEmployment: employeeData[2].value,
                            parttimeEmployment: employeeData[3].value,
                            maleEmployees: employeeData[4].value,
                            femaleEmployees: employeeData[5].value,

                            jobs: dataJobTitle,
                            wantedJobs: dataWantedJobTitle,
                        }
                    );

                    if (response.status === 200) {
                        console.log("Success!");
                    }
                    setMessage("Entry Added Successfully");
                    snackOpen();
                    handleReset();
                    setIsReset(true);
                    setTimeout(() => {
                        setIsReset(false);
                    }, 1000);
                    // If the login is successful, you can console.log the response.
                    console.log(response.data.message);
                    // console.log(response2.data.message);
                } catch (error) {
                    setMessage(error.data.message);
                    snackOpen();
                    console.error(
                        "Login error:",
                        error.response ? error.response.data : error.message
                    );
                }
            } else {
                setMessage("Some totals are mismatched with prior values");
                snackOpen();
            }
        } else {
            setMessage("Some fields are empty");
            snackOpen();
        }
    };

    const handleReset = () => {
        const resetValues = inputArray.map((roles) => ({
            id: roles.id,
            name: roles.name,
            value: "0", // Reset value to '0' as a string
        }));
        setEmployeeData(resetValues);
    };

    const tableArray = [
        {
            key: 0,
            tableTitle: "Current Job Positions",
            tableData: getJobData,
            col1: "Title",
            col2: "Number of Employees",
            tableLayout: jobTitles,
            params: jobTitleStatus,
            dynamic: true,
            reset: isReset,
            labelText: "Search for job titles",
        },
        {
            key: 1,
            tableTitle: "Wanted Job Positions",
            tableData: getWantedJobData,
            col1: "Title",
            col2: "Number of Employees",
            tableLayout: jobTitles,
            params: true,
            dynamic: true,
            reset: isReset,
            labelText: "Search for job titles",
        },
    ];

    const inputArray = [
        {
            id: 0,
            name: "Permanent",
            help: "Number of permanent employees",
        },
        {
            id: 1,
            name: "Job Hire",
            help: "Number of job hire employees",
        },
        {
            id: 2,
            name: "Project Based",
            help: "Number of project based employees",
        },
        {
            id: 3,
            name: "Part Time",
            help: "Number of part time employees",
        },
        {
            id: 4,
            name: "Male",
            help: "Number of male employees",
        },
        {
            id: 5,
            name: "Female",
            help: "Number of female employees",
        },
    ];

    return (
        <Box sx={{ bgcolor: "#EEEEEE" }}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={snackClose}
                message={message}
                action={action}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
            <AppBarCustom
                appBarName={passedData.dashboardName}
                icon={
                    <AccountCircleRoundedIcon
                        sx={{ color: "black", fontSize: 35 }}
                    />
                }
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
                            sx={{ paddingTop: 2 }}
                            //   bgcolor="red"
                        >
                            <Grid container item xs>
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
                                        Workforce Report
                                    </Typography>
                                    <Tooltip
                                        title={
                                            "This is a report that summarizes the arrivals, overnights and rooms occupied by tourists."
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
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid container item>
                        <Grid item xs={2}>
                            <DatePicker
                                slotProps={{
                                    textField: {
                                        helperText: "Select Date",
                                    },
                                }}
                                label={"Month and Year"}
                                views={["month", "year"]}
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                                sx={{ width: 1 }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item>
                        {jobTitles ? (
                            <FormCard
                                cardTitle={"Employment and Workforce"}
                                headerContent={
                                    <Grid
                                        container
                                        direction="column"
                                        rowSpacing={2}
                                    >
                                        <Grid item>
                                            <Typography
                                                variant="h6"
                                                color={
                                                    employementDataStatus
                                                        ? "datatext.main"
                                                        : "errorGuim.main"
                                                }
                                            >
                                                {employementDataStatus
                                                    ? "Employment Status"
                                                    : "Employment Status *"}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            justifyContent={{
                                                xs: "center",
                                                sm: "flex-start",
                                            }}
                                            alignItems={{
                                                xs: "center",
                                                sm: "flex-start",
                                            }}
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            columnSpacing={{
                                                xs: 0,
                                                sm: 2,
                                                md: 3,
                                                lg: 2,
                                                xl: 2,
                                            }}
                                            sx={{ paddingX: 2 }}
                                        >
                                            {inputArray
                                                .filter(
                                                    (roles) =>
                                                        roles.id >= 0 &&
                                                        roles.id < 4
                                                )
                                                .map((roles) => (
                                                    <Grid
                                                        item
                                                        xs
                                                        key={roles.id}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            type="number"
                                                            name={roles.name}
                                                            helperText={
                                                                roles.help
                                                            }
                                                            onChange={(event) =>
                                                                handleInputChange(
                                                                    event,
                                                                    roles
                                                                )
                                                            }
                                                            InputProps={{
                                                                inputProps: {
                                                                    style: {
                                                                        textAlign:
                                                                            "left",
                                                                    },
                                                                    max: 10000,
                                                                    min: 0,
                                                                },
                                                            }}
                                                            value={
                                                                employeeData.find(
                                                                    (r) =>
                                                                        r.name ===
                                                                        roles.name
                                                                )?.value === 0
                                                                    ? 0
                                                                    : employeeData.find(
                                                                          (r) =>
                                                                              r.name ===
                                                                              roles.name
                                                                      )
                                                                          ?.value ||
                                                                      ""
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                        </Grid>
                                        <Grid item>
                                            <Divider />
                                        </Grid>
                                        <Grid item>
                                            <Typography
                                                variant="h6"
                                                color={
                                                    employementDataStatus
                                                        ? "datatext.main"
                                                        : "errorGuim.main"
                                                }
                                            >
                                                {employementDataStatus
                                                    ? "Employee Sex"
                                                    : "Employee Sex *"}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            justifyContent={{
                                                xs: "center",
                                                sm: "flex-start",
                                            }}
                                            alignItems={{
                                                xs: "center",
                                                sm: "flex-start",
                                            }}
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            columnSpacing={{
                                                xs: 0,
                                                sm: 2,
                                                md: 3,
                                                lg: 2,
                                                xl: 2,
                                            }}
                                            sx={{ paddingX: 2 }}
                                        >
                                            {inputArray
                                                .filter(
                                                    (roles) =>
                                                        roles.id >= 4 &&
                                                        roles.id < 6
                                                )
                                                .map((roles) => (
                                                    <Grid
                                                        item
                                                        xs={3}
                                                        key={roles.id}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            type="number"
                                                            name={roles.name}
                                                            helperText={
                                                                roles.help
                                                            }
                                                            onChange={(event) =>
                                                                handleInputChange(
                                                                    event,
                                                                    roles
                                                                )
                                                            }
                                                            InputProps={{
                                                                inputProps: {
                                                                    style: {
                                                                        textAlign:
                                                                            "left",
                                                                    },
                                                                    max: 10000,
                                                                    min: 0,
                                                                },
                                                            }}
                                                            value={
                                                                employeeData.find(
                                                                    (r) =>
                                                                        r.name ===
                                                                        roles.name
                                                                )?.value === 0
                                                                    ? 0
                                                                    : employeeData.find(
                                                                          (r) =>
                                                                              r.name ===
                                                                              roles.name
                                                                      )
                                                                          ?.value ||
                                                                      ""
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    </Grid>
                                }
                                tableLayoutArray={tableArray}
                                // footerContent={
                                //     <DynamicChip
                                //         selectedChips={selectedChips}
                                //         setSelectedChips={setSelectedChips}
                                //     />
                                // }
                            />
                        ) : null}
                    </Grid>
                    <Grid container item justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                            >
                                Add Entry
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    console.log(employeeData);
                                    console.log(dataJobTitle);
                                    console.log(selectedChips);
                                    console.log(dataWantedJobTitle);
                                    console.log(totalWantedJobTitle);
                                    console.log(JobTitles);
                                    console.log("jhsjhjhhjh", jobTitles);
                                }}
                            >
                                Console Log
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setIsReset(true);
                                    setMessage("Empty fields generated");
                                    snackOpen();
                                    console.log(isReset);
                                    setTimeout(() => {
                                        setIsReset(false);
                                        console.log(isReset);
                                    }, 1000); // Adjust the timeout duration as needed (in milliseconds)
                                    setSelectedChips([]);
                                    handleReset();
                                }}
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
export default WorkforceForm;

import { Autocomplete, Chip } from "@mui/material";

function DynamicChip({ selectedChips, setSelectedChips }) {
    //   const [selectedChips, setSelectedChips] = useState([]);
    const [label, setLabel] = useState(false);

    const maxChips = 10; // Set your desired maximum number of chips

    const handleAutocompleteChange = (event, value) => {
        if (!value) {
            setSelectedChips([]);
        } else if (Array.isArray(value)) {
            const transformedValue = value.map((selectedOption) => ({
                id: selectedOption.id,
                name: selectedOption.name,
            }));
            setSelectedChips(transformedValue);
        } else {
            const selectedOption = value;
            const alreadyExists = selectedChips.some(
                (item) => item.id === selectedOption.id
            );

            if (!alreadyExists && selectedChips.length < maxChips) {
                const transformedValue = [
                    {
                        id: selectedOption.id,
                        name: selectedOption.name,
                    },
                ];
                setSelectedChips([...selectedChips, ...transformedValue]);
            }
        }
    };

    const handleDelete = (chipKey) => {
        const updatedChips = selectedChips.filter(
            (chip) => chip.id !== chipKey
        );
        setSelectedChips(updatedChips);
    };

    return (
        <Grid container direction="column" rowSpacing={2}>
            <Grid item>
                <Typography variant="h6" color="datatext.main">
                    Future Skills Needed
                </Typography>
            </Grid>
            <Grid item>
                <Autocomplete
                    // disableClearable
                    value={null}
                    clearOnEscape
                    size="small"
                    onChange={handleAutocompleteChange}
                    disablePortal
                    id="Filter"
                    options={JobSkills}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            onClick={() => setLabel(true)}
                            onBlur={() => setLabel(false)}
                            {...params}
                            label={
                                label === false
                                    ? "Search for future job skills needed (10 max)"
                                    : ""
                            }
                            InputLabelProps={{
                                shrink: false,
                                sx: {
                                    width: 1,
                                    textAlign: "center",
                                    fontStyle: "italic",
                                }, // Align label to the center
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item>
                <Box
                    sx={{
                        width: 1,
                        height: 130,
                        borderRadius: 1,
                        border: "1px solid lightGrey",
                        padding: 2,
                    }}
                >
                    <Grid container spacing={1}>
                        {selectedChips.map((chip) => (
                            <Grid item key={chip.id}>
                                <Chip
                                    label={chip.name}
                                    onDelete={() => handleDelete(chip.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export { DynamicChip };
