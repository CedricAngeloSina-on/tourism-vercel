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
    AppBar,
    Tooltip,
    IconButton,
    Card,
} from "@mui/material";
import SummaryTable from "./summaryTable";
import DataCard from "./dataCard";
import BarChart from "./barChart";
import LineChart from "./lineChart";
import AppBarCustom from "./appBar";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

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
// props.specificSearch
// props.specificFilterText;
// props.toggleValue
// props.toggleHandler
// props.toggleHandlerDisable
// props.barChart1Title
// props.barChart1Bold
// props.barChart1Hint
// props.barChart1Value
// props.barChart1Label
// props.isStacked
// props.lineOption
// props.lineChart1Value
// props.lineChart1Label
// props.lineChart1Tension
// props.lineChart1Fill
// props.isForcasting
// props.card1LastValue
// props.card1Value
// props.pieChart1Value
// props.pieChart1Label
// props.municipalityDefault
// props.municHandler
// props.municOption
// props.municFilterText
// props.establishmentDefault
// props.establishHandler
// props.establishOptions
// props.establishFilterText
// props.barChart2Title
// props.barChart2Bold
// props.barChart2Hint
// props.barChart2Value
// props.barChart2Label
// props.lineChart2Value
// props.lineChart2Label
// props.lineChart2Tension
// props.lineChart2Fill
// props.card2LastValue
// props.card2Value
// props.pieChart2Value
// props.pieChart2Label

function DashboardTempB(props) {
    const layoutArray = props.layoutArray; //////////////////////////////////////////////////

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
                        // bgcolor="red"
                        display="flex"
                        alignItems="center"
                        // sx={{ paddingTop: 10 }}
                    >
                        {props.specificSearch ? ( /////////////////////////////////////////////
                            <Grid item>
                                <Autocomplete
                                    sx={{ width: 200 }}
                                    disableClearable
                                    size="small"
                                    value={props.toggleValue}
                                    onChange={props.toggleHandler}
                                    disablePortal
                                    id="Filter"
                                    options={props.dataSelector.map(
                                        (option) => option.name
                                    )} // Map dataSelector to match the expected format of options
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={props.specificFilterText} /////////////////////////////////////////////
                                        />
                                    )}
                                />
                            </Grid>
                        ) : dataSelector ? (
                            <>
                                <Grid item>
                                    <Typography
                                        variant="body2"
                                        color="datatext.main"
                                    >
                                        View Charts By:
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
                            </>
                        ) : null}
                    </Grid>

                    <Grid container item xs columnSpacing={2}>
                        <Grid item xs={12} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.barChart1Title} /////////////////////////////////////////////////
                                cardTitleBold={props.barChart1Bold} //////////////////////////////////////////////
                                cardHint={props.barChart1Hint} ////////////////////////////////////////////////////
                                cardBody={
                                    <>
                                        {props.barChart1Value &&
                                            props.barChart1Label && (
                                                <BarChart
                                                    barData={
                                                        props.barChart1Value
                                                    }
                                                    barLabelXAxis={
                                                        props.barChart1Label
                                                    }
                                                    isStacked={props.isStacked}
                                                    lineOption={
                                                        props.lineOption
                                                    }
                                                />
                                            )}

                                        {props.lineChart1Value &&
                                            props.lineChart1Label && (
                                                <LineChart
                                                    lineData={
                                                        props.lineChart1Value
                                                    }
                                                    lineLabelXAxis={
                                                        props.lineChart1Label
                                                    }
                                                    lineTension={
                                                        props.lineChart1Tension
                                                    }
                                                    lineFill={
                                                        props.lineChart1Fill
                                                    }
                                                    isForcasting={
                                                        props.isForcasting
                                                    }
                                                />
                                            )}
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs columnSpacing={2}>
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
                                    justifyContent: "center",
                                    borderRadius: 3,
                                    boxShadow: "none",
                                }}
                            >
                                {props.barChart1Value &&
                                    props.barChart1Label && (
                                        <SummaryTable
                                            labels={props.barChart1Label}
                                            barData={props.barChart1Value}
                                        />
                                    )}
                                {props.lineChart1Value &&
                                    props.lineChart1Label && (
                                        <SummaryTable
                                            labels={props.lineChart1Label}
                                            barData={props.lineChart1Value}
                                        />
                                    )}
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container item xs columnSpacing={2}></Grid>
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
                        <Grid item xs={12} height={{ lg: 400, xl: 500 }}>
                            <DataCard
                                cardTitle={props.barChart2Title} //////////////////////////////////////
                                cardTitleBold={props.barChart2Bold} ///////////////////////////////////
                                cardHint={props.barChart2Hint} ////////////////////////////////////////
                                cardBody={
                                    <>
                                        {props.barChart2Value &&
                                            props.barChart2Label && (
                                                <BarChart
                                                    barData={
                                                        props.barChart2Value
                                                    }
                                                    barLabelXAxis={
                                                        props.barChart2Label
                                                    }
                                                    isStacked={props.isStacked}
                                                    lineOption={
                                                        props.lineOption
                                                    }
                                                />
                                            )}
                                        {props.lineChart2Value &&
                                            props.lineChart2Label && (
                                                <LineChart
                                                    lineData={
                                                        props.lineChart2Value
                                                    }
                                                    lineLabelXAxis={
                                                        props.lineChart2Label
                                                    }
                                                    lineTension={
                                                        props.lineChart2Tension
                                                    }
                                                    lineFill={
                                                        props.lineChart2Fill
                                                    }
                                                    isForcasting={
                                                        props.isForcasting
                                                    }
                                                />
                                            )}
                                    </>
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs
                        sx={{ display: props.role == 3 ? "none" : "flex" }}
                    >
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
                                    justifyContent: "center",
                                    borderRadius: 3,
                                    boxShadow: "none",
                                }}
                            >
                                {props.barChart2Value &&
                                    props.barChart2Label && (
                                        <SummaryTable
                                            labels={props.barChart2Label}
                                            barData={props.barChart2Value}
                                        />
                                    )}
                                {props.lineChart2Value &&
                                    props.lineChart2Label && (
                                        <SummaryTable
                                            labels={props.lineChart2Label}
                                            barData={props.lineChart2Value}
                                        />
                                    )}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default DashboardTempB;
