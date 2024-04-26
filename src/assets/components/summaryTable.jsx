import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const SummaryTable = (props) => {
    const { labels, barData } = props;

    if (!labels || !barData || labels.length === 0 || barData.length === 0) {
        return (
            <Typography sx={{ padding: "1em" }} align="center">
                No data available
            </Typography>
        );
    }

    const valueFormatter = ({ value }) => {
        try {
            // Check if value is defined, not null, and a number
            if (typeof value === "number" && !isNaN(value)) {
                // Attempt to format the value using toLocaleString
                return value.toLocaleString();
            } else if (value !== undefined && value !== null) {
                // If value is not a number, return the value as is
                return value.toString();
            } else {
                // If value is undefined or null, return an empty string
                return "";
            }
        } catch (error) {
            // If an error occurs, return the original value
            console.error("Error formatting value:", error);
            return value;
        }
    };

    // Prepare columns for DataGrid
    const columns = [
        { field: "label", headerName: "", width: 200 },
        ...labels.map((label, index) => ({
            field: `value${index}`,
            headerName: label,
            width: 150,
            valueFormatter,
        })),
    ];

    // Prepare rows for DataGrid
    const rows = barData.map(({ label, data }, index) => {
        const rowData = { id: index, label };
        data.forEach((value, subIndex) => {
            rowData[`value${subIndex}`] = value;
        });
        return rowData;
    });

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[5, 10, 15]}
        />
    );
};

export default SummaryTable;
