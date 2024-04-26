import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Snackbar,
    Button,
    Fade,
    IconButton,
    Divider,
    Tooltip,
    Card,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import FormCard from "../assets/components/formCard";
import AppBarCustom from "../assets/components/appBar";
import { useOutletContext } from "react-router-dom";

import {
    AgeGroup,
    LocalRegions,
    ForeignCountries,
} from "../assets/components/arraySource";

function EAform() {
    const passedData = useOutletContext();
    //Handle Snackbar opened state, and message state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function snackOpen() {
        setOpen(true);
    }

    function snackClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
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

    //Handling textfield inputs
    const [date, setDate] = useState(dayjs(new Date())); // state for date
    const [roomnum, setRoomnum] = useState(0); // state for number of rooms
    // const [roomsurvey, setRoomsurvey] = useState(0); // state for number of surveyed rooms
    const [roomoccu, setRoomoccu] = useState(0); // state for number of occupied rooms
    const [maleDomesticArrivals, setMaleDomesticArrivals] = useState(0); // state for male domestic arrivals
    const [femaleDomesticArrivals, setFemaleDomesticArrivals] = useState(0); // state for female domestic arrivals
    const [maleForeignArrivals, setMaleForeignArrival] = useState(0); // state for male foregin arrivals
    const [femaleForeignArrivals, setFemaleForeignArrival] = useState(0); // state for female foregin arrivals
    const [maleDomesticOvernights, setMaleDomesticOvernights] = useState(0); // state for male domestic overnights
    const [femaleDomesticOvernights, setFemaleDomesticOvernights] = useState(0); // state for female domestic overnights
    const [maleForeignOvernights, setMaleForeignOvernights] = useState(0); // state for male foregin overnights
    const [femaleForeignOvernights, setFemaleForeigOvernights] = useState(0); // state for female foregin overnights
    const [establishment, setEstablishment] = useState(0); // state for establishment type
    const [expend, setExpend] = useState(0); // state for female foregin overnights
    const [revenue, setRevenue] = useState(0); // state for establishment type

    const [dashboardName, setDashboardName] = useState(""); // Dashboard name
    // ALso add roleIdentity, because I can access tabs meant only for munic and province accounts
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
    ////////////////////Fetch dashboard name here

    // array of input fields for map
    const inputArray = [
        {
            key: 0,
            label: "Number of Rooms",
            help: "Number of rooms in a month",
            read: roomnum,
            set: setRoomnum,
        },
        // {
        //     key: 1,
        //     label: "Surveyed Rooms",
        //     help: "Number of surveyed rooms in a month",
        //     read: roomsurvey,
        //     set: setRoomsurvey,
        // },
        {
            key: 1,
            label: "Occupied Rooms",
            help: "Number of occupied rooms in a month",
            read: roomoccu,
            set: setRoomoccu,
        },
        {
            key: 2,
            label: "Male Domestic Check-ins",
            help: "Number of male domestic guest check-ins",
            read: maleDomesticArrivals,
            set: setMaleDomesticArrivals,
        },
        {
            key: 3,
            label: "Female Domestic Check-ins",
            help: "Number of female domestic guest check-ins",
            read: femaleDomesticArrivals,
            set: setFemaleDomesticArrivals,
        },
        {
            key: 4,
            label: "Male Foreign Check-ins",
            help: "Number of male foreign guest check-ins",
            read: maleForeignArrivals,
            set: setMaleForeignArrival,
        },
        {
            key: 5,
            label: "Female Foreign Check-ins",
            help: "Number of female foreign guest check-ins",
            read: femaleForeignArrivals,
            set: setFemaleForeignArrival,
        },
        {
            key: 6,
            label: "Male Domestic Guest Nights",
            help: "Number of male domestic guest guest nights",
            read: maleDomesticOvernights,
            set: setMaleDomesticOvernights,
        },
        {
            key: 7,
            label: "Female Domestic Guest Nights",
            help: "Number of female domestic guest guest nights",
            read: femaleDomesticOvernights,
            set: setFemaleDomesticOvernights,
        },
        {
            key: 8,
            label: "Male Foreign Guest Nights",
            help: "Number of male foreign guest guest nights",
            read: maleForeignOvernights,
            set: setMaleForeignOvernights,
        },
        {
            key: 9,
            label: "Female Foreign Guest Nights",
            help: "Number of female foreign guest guest nights",
            read: femaleForeignOvernights,
            set: setFemaleForeigOvernights,
        },
        {
            key: 10,
            label: "Expenditure",
            help: "Total Expenditure for the month",
            read: expend,
            set: setExpend,
        },
        {
            key: 11,
            label: "Revenue",
            help: "Total Revenue for the month",
            read: revenue,
            set: setRevenue,
        },
    ];

    //Handling submit button actions
    const handleSubmit = async (event) => {
        const dateStr = date.format("YYYY-MM-DD"); //Converts day.js date format to MySQL date format
        event.preventDefault();

        // Validate field contents
        if (
            date !== "" &&
            roomnum !== "" &&
            // roomsurvey !== "" &&
            roomoccu !== "" &&
            maleDomesticArrivals !== "" &&
            femaleDomesticArrivals !== "" &&
            maleForeignArrivals !== "" &&
            femaleForeignArrivals !== "" &&
            maleDomesticOvernights !== "" &&
            femaleDomesticOvernights !== "" &&
            maleForeignOvernights !== "" &&
            femaleForeignOvernights !== "" &&
            expend !== "" &&
            revenue !== ""
        ) {
            if (
                ageStatus == true &&
                localStatus == true &&
                foreignStatus == true
            ) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_WEBSITE_URL}:${
                            import.meta.env.VITE_PORT
                        }/create_entry`,
                        {
                            date: dateStr,
                            establishmentID: establishment,
                            numberOfRooms: roomnum,
                            // numberOfSurveyedRooms: roomsurvey,
                            numberOfOccupiedRooms: roomoccu,

                            maleDomesticArrivals: maleDomesticArrivals,
                            femaleDomesticArrivals: femaleDomesticArrivals,
                            maleForeignArrivals: maleForeignArrivals,
                            femaleForeignArrivals: femaleForeignArrivals,

                            maleDomesticOvernights: maleDomesticOvernights,
                            femaleDomesticOvernights: femaleDomesticOvernights,
                            maleForeignOvernights: maleForeignOvernights,
                            femaleForeignOvernights: femaleForeignOvernights,

                            revenue: revenue,
                            expenditure: expend,
                        }
                    );

                    const response2 = await axios.post(
                        `${import.meta.env.VITE_WEBSITE_URL}:${
                            import.meta.env.VITE_PORT
                        }/create_market_segments_entry`,
                        {
                            date: dateStr,
                            establishmentID: establishment,

                            children: dataAge[0].value,
                            teenagers: dataAge[1].value,
                            youngAdults: dataAge[2].value,
                            adults: dataAge[3].value,
                            seniors: dataAge[4].value,

                            ncr: dataLocal[0].value,
                            car: dataLocal[1].value,
                            r1: dataLocal[2].value,
                            r2: dataLocal[3].value,
                            r3: dataLocal[4].value,
                            r4A: dataLocal[5].value,
                            r4B: dataLocal[6].value,
                            r5: dataLocal[7].value,
                            r6: dataLocal[8].value,
                            r7: dataLocal[9].value,
                            r8: dataLocal[10].value,
                            r9: dataLocal[11].value,
                            r10: dataLocal[12].value,
                            r11: dataLocal[13].value,
                            r12: dataLocal[14].value,
                            r13: dataLocal[15].value,
                            barmm: dataLocal[16].value,

                            foreign_countries: dataForeign,
                        }
                    );

                    if (response.status === 200 && response2.status === 200) {
                        console.log("Success!");
                    }
                    setMessage("Entry Added Successfully");
                    snackOpen();
                    emptyForm();
                    setIsReset(true);
                    setTimeout(() => {
                        setIsReset(false);
                    }, 1000);
                    // If the login is successful, you can console.log the response.
                    console.log(response.data.message);
                    // console.log(response2.data.message);
                } catch (error) {
                    // Handle login failure or any errors here.
                    //setMessage("error");
                    setMessage(error.response.data.message);
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

    //Puts all 0 on click
    function emptyForm() {
        setRoomnum(0);
        // setRoomsurvey(0);
        setRoomoccu(0);
        setMaleDomesticArrivals(0);
        setFemaleDomesticArrivals(0);
        setMaleForeignArrival(0);
        setFemaleForeignArrival(0);
        setMaleDomesticOvernights(0);
        setFemaleDomesticOvernights(0);
        setMaleForeignOvernights(0);
        setFemaleForeigOvernights(0);
        setExpend(0);
        setRevenue(0);
    }

    // Get data from formCard, gets data from tableDynamic
    const [dataAge, setDataAge] = useState([]);
    const [totalAge, setTotalAge] = useState(0);
    const [ageStatus, setAgeStatus] = useState();

    const [dataLocal, setDataLocal] = useState({});
    const [totalLocal, setTotalLocal] = useState(0);
    const [localStatus, setLocalStatus] = useState();

    const [dataForeign, setDataForeign] = useState({});
    const [totalForeign, setTotalForeign] = useState(0);
    const [foreignStatus, setForeignStatus] = useState();

    const [isReset, setIsReset] = useState(false);

    const getLocalData = (total, dataArray) => {
        setDataLocal(dataArray);
        setTotalLocal(total);
    };

    const getForeignData = (total, dataArray) => {
        const filteredData = dataArray.filter((item) => item.value !== 0);
        setDataForeign(filteredData);
        setTotalForeign(total);
    };

    const getAgeData = (total, dataArray) => {
        setDataAge(dataArray);
        setTotalAge(total);
    };

    useEffect(() => {
        const age =
            parseInt(maleDomesticArrivals) +
            parseInt(femaleDomesticArrivals) +
            parseInt(maleForeignArrivals) +
            parseInt(femaleForeignArrivals);

        const local =
            parseInt(maleDomesticArrivals) + parseInt(femaleDomesticArrivals);
        const foreign =
            parseInt(maleForeignArrivals) + parseInt(femaleForeignArrivals);

        if (totalAge == age) {
            setAgeStatus(true);
        } else {
            setAgeStatus(false);
        }
        if (totalLocal == local) {
            setLocalStatus(true);
        } else {
            setLocalStatus(false);
        }
        if (totalForeign == foreign) {
            setForeignStatus(true);
        } else {
            setForeignStatus(false);
        }
    }, [
        maleDomesticArrivals,
        femaleDomesticArrivals,
        maleForeignArrivals,
        femaleForeignArrivals,
        totalAge,
        totalForeign,
        totalLocal,
    ]);

    // Generate columns for table forms
    const tableArray = [
        {
            key: 0,
            tableTitle: "Age Group",
            tableData: getAgeData,
            col1: "Range",
            col2: "Number of Guests",
            tableLayout: AgeGroup,
            params: ageStatus,
            dynamic: false,
            reset: isReset,
            labelText: null,
        },
        {
            key: 1,
            tableTitle: "Local Tourist Origin",
            tableData: getLocalData,
            col1: "Region",
            col2: "Number of Guests",
            tableLayout: LocalRegions,
            params: localStatus,
            dynamic: true,
            reset: isReset,
            labelText: null,
        },
        {
            key: 2,
            tableTitle: "Foreign Tourist Origin",
            tableData: getForeignData,
            col1: "Countries",
            col2: "Number of Guests",
            tableLayout: ForeignCountries,
            params: foreignStatus,
            dynamic: true,
            reset: isReset,
            labelText: "Search for country of origin",
        },
    ];

    return (
        <Box sx={{ bgcolor: "#EEEEEE" }}>
            {/* Displays a Snackbar component for showing success/error messages */}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={snackClose}
                message={message}
                action={action}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
            {/* A container that contains a form for filling up tourism data */}
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
                                        Guest Report
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
                        <Card
                            sx={{
                                width: 1,
                                height: 1,
                                bgcolor: "white",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                boxShadow: "none",
                                padding: 2,
                            }}
                        >
                            <Grid container direction="column" rowSpacing={2}>
                                <Grid item>
                                    <Typography
                                        variant="h5"
                                        color="datatext.main"
                                        sx={{
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Guest Accomodation
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="h6"
                                        color="datatext.main"
                                    >
                                        Rooms
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
                                    direction={{ xs: "column", sm: "row" }}
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
                                        .filter((item, i) => i >= 0 && i < 2)
                                        .map(
                                            ({ label, help, read, set }, i) => (
                                                <Grid item xs={3} key={i}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        label={label}
                                                        helperText={help}
                                                        onChange={(e) => {
                                                            let value =
                                                                e.target.value;

                                                            // Parsing and updating state variable
                                                            if (value !== "") {
                                                                value =
                                                                    value.replace(
                                                                        /^0+/,
                                                                        ""
                                                                    );
                                                            }

                                                            let parsedValue =
                                                                parseInt(
                                                                    value
                                                                ) || 0;

                                                            if (
                                                                parsedValue < 0
                                                            ) {
                                                                parsedValue = 0;
                                                            } else if (
                                                                parsedValue >
                                                                10000
                                                            ) {
                                                                parsedValue = 10000;
                                                            }

                                                            set(parsedValue);
                                                        }}
                                                        value={read}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="h6"
                                        color="datatext.main"
                                    >
                                        Arrivals
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
                                    direction={{ xs: "column", sm: "row" }}
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
                                        .filter((item, i) => i >= 2 && i < 6)
                                        .map(
                                            ({ label, help, read, set }, i) => (
                                                <Grid item xs key={i}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        label={label}
                                                        helperText={help}
                                                        onChange={(e) => {
                                                            let value =
                                                                e.target.value;

                                                            // Parsing and updating state variable
                                                            if (value !== "") {
                                                                value =
                                                                    value.replace(
                                                                        /^0+/,
                                                                        ""
                                                                    );
                                                            }

                                                            let parsedValue =
                                                                parseInt(
                                                                    value
                                                                ) || 0;

                                                            if (
                                                                parsedValue < 0
                                                            ) {
                                                                parsedValue = 0;
                                                            } else if (
                                                                parsedValue >
                                                                10000
                                                            ) {
                                                                parsedValue = 10000;
                                                            }

                                                            set(parsedValue);
                                                        }}
                                                        value={read}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                                <Grid item>
                                    <Divider />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="h6"
                                        color="datatext.main"
                                    >
                                        Overnights
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
                                    direction={{ xs: "column", sm: "row" }}
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
                                        .filter((item, i) => i >= 6 && i < 10)
                                        .map(
                                            ({ label, help, read, set }, i) => (
                                                <Grid item xs key={i}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        label={label}
                                                        helperText={help}
                                                        onChange={(e) => {
                                                            let value =
                                                                e.target.value;

                                                            // Parsing and updating state variable
                                                            if (value !== "") {
                                                                value =
                                                                    value.replace(
                                                                        /^0+/,
                                                                        ""
                                                                    );
                                                            }

                                                            let parsedValue =
                                                                parseInt(
                                                                    value
                                                                ) || 0;

                                                            if (
                                                                parsedValue < 0
                                                            ) {
                                                                parsedValue = 0;
                                                            } else if (
                                                                parsedValue >
                                                                10000
                                                            ) {
                                                                parsedValue = 10000;
                                                            }

                                                            set(parsedValue);
                                                        }}
                                                        value={read}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    {/* <Grid item>
            <Card
              sx={{
                width: 1,
                height: 1,
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "none",
                padding: 2,
              }}
            >
              <Grid container direction="column" rowSpacing={2}>
                <Grid item>
                  <Typography variant="h6" color="datatext.main">
                    Money
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
                  direction={{ xs: "column", sm: "row" }}
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
                    .filter((item, i) => i >= 11 && i < 13)
                    .map(({ label, help, read, set }, i) => (
                      <Grid item xs key={i}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="number"
                          label={label}
                          helperText={help}
                          onChange={(event) => set(event.target.value)}
                          value={read}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Card>
          </Grid> */}
                    <Grid item>
                        <FormCard
                            tableLayoutArray={tableArray}
                            cardTitle={"Tourism Market Segments and Profiles"}
                        />
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
                        {/* <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  console.log(dataAge, totalAge);
                  console.log(dataLocal, totalLocal);
                  console.log(dataForeign, totalForeign);
                }}
              >
                Console Log
              </Button>
            </Grid> */}
                        <Grid item>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    emptyForm();
                                    setMessage("Empty fields generated");
                                    snackOpen();
                                    setIsReset(true);
                                    console.log(isReset);
                                    setTimeout(() => {
                                        setIsReset(false);
                                        console.log(isReset);
                                    }, 1000); // Adjust the timeout duration as needed (in milliseconds)
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

export default EAform;
