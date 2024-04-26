import React from "react";
import { Grid, Typography, Divider, Card } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableDynamic from "./tableDynamic";

function FormCard(props) {
    const tableArray = props.tableLayoutArray;

    console.log(tableArray);

    return (
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
                        {props.cardTitle}
                    </Typography>
                </Grid>
                {props.headerContent ? (
                    <>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>{props.headerContent}</Grid>
                    </>
                ) : null}
                {tableArray ? (
                    <>
                        {tableArray.map(
                            (
                                {
                                    key,
                                    tableTitle,
                                    tableData,
                                    col1,
                                    col2,
                                    tableLayout,
                                    params,
                                    dynamic,
                                    reset,
                                    labelText,
                                },
                                i
                            ) => (
                                <Grid
                                    container
                                    item
                                    direction="column"
                                    rowSpacing={2}
                                    key={key}
                                >
                                    <Grid item>
                                        <Divider />
                                    </Grid>
                                    <Grid item>
                                        <Accordion sx={{ boxShadow: 0 }}>
                                            <AccordionSummary
                                                sx={{ padding: 0 }}
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    color={
                                                        params
                                                            ? "datatext.main"
                                                            : "errorGuim.main"
                                                    }
                                                >
                                                    {params
                                                        ? tableTitle
                                                        : `${tableTitle} *`}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails
                                                sx={{ padding: 0 }}
                                            >
                                                <TableDynamic
                                                    childToParent={tableData}
                                                    col1Title={col1}
                                                    col2Title={col2}
                                                    layoutArray={tableLayout}
                                                    extraParams={params}
                                                    dynamic={dynamic}
                                                    reset={reset}
                                                    labelText={labelText}
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                            )
                        )}
                    </>
                ) : null}
                {props.footerContent ? (
                    <>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>{props.footerContent}</Grid>
                    </>
                ) : null}
            </Grid>
        </Card>
    );
}

export default FormCard;
