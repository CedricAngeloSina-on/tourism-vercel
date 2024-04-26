import React from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Autocomplete,
    Tooltip,
    IconButton,
    Card,
} from "@mui/material";
import DoughnutChart from "./doughnutChart";
import DataCard from "./dataCard";
import AppBarCustom from "./appBar";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import SummaryTable from "./summaryTable";

//Props List/////////////////////////////////////////////////
// props.layoutArray
// props.dataSelector
// props.role
// props.accname
// props.icon
// props.dashName1
// props.dashHint
// props.dateValue
// props.dateHandler
// id="Filter"
// props.dateOption
// props.dateText
// props.toggleValue
// props.toggleHandler
// props.toggleHandlerDisable
// props.chartTitle1
// props.chartTitle1Bold
// props.chartTitle1Hint
// props.chartTitle2
// props.chartTitle2Bold
// props.chartTitle2Hint
// props.municipalityDefault
// props.municHandler
// props.municOption
// props.municFilterText
// props.establishmentDefault
// props.establishHandler
// props.establishOptions
// props.establishFilterText
// props.chartTitle3
// props.chartTitle3Bold
// props.chartTitle3Hint
// props.chartTitle4
// props.chartTitle4Bold
// props.chartTitle4Hint

function DashboardTempC(props) {
    const options = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    //Array for chip filter
    const dataSelector = props.dataSelector; ////////////////////////////////////////////////

    return (
        <Box
            sx={{
                bgcolor: "#EEEEEE",
            }}
        >
            <AppBarCustom
                appBarName={
                    (props.role == "1" ///////////////////////////////////////////////////////////
                        ? "Province of "
                        : props.role == "2" //////////////////////////////////////////////////
                        ? "Municipality of "
                        : "") + props.accname
                }
                /////////////////////////////////////////////////////////////////
                icon={props.icon}
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
                            sx={{ paddingTop: 2 }}
                            //   bgcolor="red"
                        >
                            <Grid
                                //  container
                                item
                                xs={9}
                                sx={{ display: "flex", alignItems: "center" }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: "90%",
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        color="datatext.main"
                                        sx={{
                                            fontWeight: "bold",
                                            overflowWrap: "break-word",
                                            // specific useCases only
                                        }}
                                    >
                                        {props.dashName1}
                                        {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
                                    </Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Tooltip
                                        title={props.dashHint}
                                        placement="right"
                                        arrow
                                    >
                                        <IconButton size="small">
                                            <InfoRoundedIcon
                                                sx={{ color: "datatext.main" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                {/* <Grid
                                    item
                                    xs="auto"
                                    display="flex"
                                    alignItems="center"
                                > */}

                                {/* </Grid> */}
                            </Grid>
                            <Grid
                                container
                                item
                                xs={3}
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                                columnSpacing={2}
                            >
                                <Grid item xs={8}>
                                    <Autocomplete
                                        disableClearable
                                        size="small"
                                        value={props.dateValue} ///////////////////////////////////////////
                                        onChange={props.dateHandler} /////////////////////////////////////
                                        disablePortal
                                        id="Filter"
                                        options={props.dateOption} ///////////////////////////////////////////
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={props.dateText}
                                            /> ////////////////////////////
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid
                        container
                        item
                        columnSpacing={2}
                        display="flex"
                        alignItems="center"
                    >
                        <Grid
                            container
                            item
                            columnSpacing={2}
                            display="flex"
                            alignItems="center"
                            xs="auto"
                        >
                            <Grid item>
                                <Typography
                                    variant="body2"
                                    color="datatext.main"
                                >
                                    View Charts by:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <ToggleButtonGroup
                                    color="guimaras"
                                    value={props.toggleValue} /////////////////////////////////////////////
                                    exclusive
                                    onChange={props.toggleHandler} ////////////////////////////////////////
                                    aria-label="Platform"
                                    size="small"
                                >
                                    {dataSelector.map(
                                        (
                                            { label },
                                            i /////////////////////////////
                                        ) => (
                                            <ToggleButton
                                                disabled={
                                                    props.toggleHandlerDisable
                                                } ////////////////////////////////////////
                                                key={i}
                                                value={label}
                                                sx={{
                                                    paddingX: 2,
                                                    height: 30,
                                                    bgcolor:
                                                        props.toggleHandlerDisable
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
                                        )
                                    )}
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            item
                            columnSpacing={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            xs
                        >
                            <Grid item>
                                <Typography
                                    variant="body2"
                                    color="datatext.main"
                                >
                                    View by Month of:
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Autocomplete
                                    sx={{ width: 150 }}
                                    disableClearable
                                    size="small"
                                    value={props.monthDefault}
                                    onChange={props.monthHandler}
                                    disablePortal
                                    id="Filter"
                                    options={options}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs columnSpacing={2}>
                        <Grid item xs={6} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.chartTitle1} /////////////////////////////////////////////////
                                cardTitleBold={props.chartTitle1Bold} //////////////////////////////////////////////
                                cardHint={props.chartTitle1Hint} ////////////////////////////////////////////////////
                                cardBody={
                                    <DoughnutChart
                                        display={true}
                                        pieLabel={props.pieChart1Label} /////////////////////////////////////////////////
                                        data={props.pieChart1Value} /////////////////////////////////////////////////
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={6} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.chartTitle2} /////////////////////////////////////////////////
                                cardTitleBold={props.chartTitle2Bold} //////////////////////////////////////////////
                                cardHint={props.chartTitle2Hint} ////////////////////////////////////////////////////
                                cardBody={
                                    <DoughnutChart
                                        display={true}
                                        pieLabel={props.pieChart2Label} /////////////////////////////////////////////////
                                        data={props.pieChart2Value} /////////////////////////////////////////////////
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                    {/* <Grid container item xs>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    // width: 1,
                                    // height: 1,
                                    minHeight: 200,
                                    maxHeight: 500,
                                    bgcolor: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 3,
                                    boxShadow: "none",
                                }}
                            >
                                <SummaryTable
                                    labels={props.pieChart2Label}
                                    barData={props.pieChart2Value}
                                />
                            </Card>
                        </Grid>
                    </Grid> */}
                    <Grid
                        item
                        sx={{
                            paddingY: 6,
                            display: props.role == 3 ? "none" : "block",
                        }} /////////////////////////
                    >
                        <Divider />
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        display="flex"
                        alignItems="center"
                        sx={{ display: props.role == 3 ? "none" : "flex" }} ////////////////////////////////////////
                    >
                        <Typography
                            variant="h4"
                            color="datatext.main"
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            {props.role == 1 //////////////////////////////////////////////////
                                ? `${props.dashName1} per Municipality` //////////////////////////
                                : `${props.dashName1} per Establishment`}
                            {/* //////////////////////////////// */}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        columnSpacing={2}
                        sx={{ display: props.role == 3 ? "none" : "flex" }}
                    >
                        <Grid item>
                            {props.municipalityDefault && ( ////////////////////////////////
                                <Autocomplete
                                    sx={{ width: 200 }}
                                    disableClearable
                                    size="small"
                                    value={props.municipalityDefault} //////////////////////////////
                                    onChange={props.municHandler} //////////////////////////////////
                                    disablePortal
                                    id="Filter"
                                    options={props.municOption} ///////////////////////////////////
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={props.municFilterText}
                                        /> /////////////////////////
                                    )}
                                />
                            )}
                            {props.establishmentDefault && ( ////////////////////////////////////////
                                <Autocomplete
                                    sx={{ width: 300 }}
                                    disableClearable
                                    size="small"
                                    value={props.establishmentDefault} ////////////////////////////////////////
                                    onChange={props.establishHandler} /////////////////////////////////////////
                                    disablePortal
                                    id="Filter"
                                    options={props.establishOptions} ///////////////////////////////////////////
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={props.establishFilterText}
                                        /> ////////////////////////////
                                    )}
                                />
                            )}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        columnSpacing={2}
                        sx={{ display: props.role == 3 ? "none" : "flex" }}
                    >
                        <Grid item xs={6} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.chartTitle3} /////////////////////////////////////////////////
                                cardTitleBold={props.chartTitle3Bold} //////////////////////////////////////////////
                                cardHint={props.chartTitle3Hint} ////////////////////////////////////////////////////
                                cardBody={
                                    <DoughnutChart
                                        display={true}
                                        pieLabel={props.pieChart3Label} /////////////////////////////////////////////////
                                        data={props.pieChart3Value} /////////////////////////////////////////////////
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={6} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.chartTitle4} /////////////////////////////////////////////////
                                cardTitleBold={props.chartTitle4Bold} //////////////////////////////////////////////
                                cardHint={props.chartTitle4Hint} ////////////////////////////////////////////////////
                                cardBody={
                                    <DoughnutChart
                                        display={true}
                                        pieLabel={props.pieChart4Label} /////////////////////////////////////////////////
                                        data={props.pieChart4Value} /////////////////////////////////////////////////
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default DashboardTempC;
