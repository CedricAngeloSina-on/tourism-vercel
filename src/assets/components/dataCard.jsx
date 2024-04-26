import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

function DataCard(props) {
  function parseNumberWithCommas(value) {
    const stringValue = String(value);
    return parseFloat(stringValue.replace(/,/g, "")) || 0;
  }

  const valuelast = parseNumberWithCommas(props.valueLast);
  const valuecurrent = parseNumberWithCommas(props.valueNow);

  if (isNaN(valuelast) || isNaN(valuecurrent)) {
    // Handle the case where one or both values are missing
    return (
      <Typography variant="overline" color="error">
        Error: Missing or invalid values
      </Typography>
    );
  }

  // Calculate percentage difference
  const difference = valuecurrent - valuelast;
  const percentageDifference = (difference / Math.abs(valuelast)) * 100;

  // Determine if it's higher or lower
  const comparisonText = difference > 0 ? "higher" : "lower";

  // Format the percentage difference with commas and handle negative values
  const formattedPercentageDifference = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(percentageDifference) / 100);

  // Add conditional styling based on the difference
  const colorStyle = isNaN(percentageDifference)
    ? "error"
    : difference > 0
    ? "green"
    : "red";

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
      }}
    >
      <Box
        width={1}
        paddingX={2}
        sx={{
          bgcolor: "gold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ paddingY: 1 }}>
          <Typography variant="overline" color="datatext.main">
            {props.cardTitle}
          </Typography>
          <Typography
            variant="overline"
            color="datatext.main"
            sx={{ fontWeight: "bold" }}
          >
            {props.cardTitleBold}
          </Typography>
        </Box>
        <Box
          sx={{
            paddingY: 1,
          }}
        >
          <Tooltip title={props.cardHint} placement="top" arrow>
            <IconButton>
              <InfoRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        height={1}
        sx={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          flexDirection: "column",
        }}
      >
        {props.cardBody}
        {props.cardBodyText}
        {props.cardBodyText ? (
          <>
            <Box
              height={"20%"}
              width={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // bgcolor: "red",
              }}
            >
              {difference > 0 ? (
                <>
                  <ArrowDropUpRoundedIcon
                    fontSize="small"
                    sx={{ color: "green" }}
                  />
                </>
              ) : (
                <>
                  <ArrowDropDownRoundedIcon
                    fontSize="small"
                    sx={{ color: "red" }}
                  />
                </>
              )}
              <Typography variant="subtitle2" sx={{ color: colorStyle }}>
                {isNaN(percentageDifference)
                  ? "Error: Invalid calculation"
                  : `${formattedPercentageDifference} ${comparisonText} than last year`}
              </Typography>
            </Box>
          </>
        ) : null}
      </Box>
    </Card>
  );
}

export default DataCard;
