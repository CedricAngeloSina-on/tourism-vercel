import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
    Box,
    Button,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Typography,
} from "@mui/material";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

function BarChart(props) {
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [shouldShrink, setShouldShrink] = useState(true);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: "index",
        },
        scales: {
            x: {
                stacked: props.isStacked,
                min: 0,
            },
            y: {
                stacked: props.isStacked,
                min: 0,
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                display: function (context) {
                    // Calculate highest value in the dataset
                    var maxValue = Math.max(...context.dataset.data);
                    // Calculate 5% of the highest value
                    var threshold = 0.1 * maxValue;
                    // Get the current value
                    var value = context.dataset.data[context.dataIndex];

                    // Disable labels if any of the following conditions are met:
                    // 1. Part is active
                    // 2. Value is less than 5% of the highest value
                    // 3. Value is 0
                    // 4. Value is NaN
                    if (
                        context.active ||
                        value < threshold ||
                        value === 0 ||
                        isNaN(value) ||
                        context.dataset.type === "line"
                    ) {
                        return false;
                    } else {
                        // Enable labels for all other cases
                        return true;
                    }
                },

                color: props.isStacked ? "white" : "black",
                backgroundColor: props.isStacked ? null : "white",
                borderColor: function (context) {
                    if (props.isStacked) {
                        // Return a default border color when stacked
                        return null; // You can replace 'black' with your preferred color
                    } else {
                        // Return the dataset's background color when not stacked
                        return context.dataset.backgroundColor;
                    }
                },
                borderRadius: 50,
                borderWidth: 2,
                font: {
                    weight: "bold",
                },
                formatter: (number) => {
                    return number
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                },
                align: "center",
                anchor: "center",
            },
        },
    };

    const labels = props.barLabelXAxis;

    useEffect(() => {
        // setSelectedDatasets("");
        setShouldShrink(false);
        setTimeout(() => {
            setShouldShrink(true);
        }, 1);
    }, [props.barLabelXAxis]);

    useEffect(() => {
        // setSelectedDatasets("");
        if (props.barData && props.barData.length > 0) {
            setSelectedDatasets(props.barData.map(() => false));
        }
    }, [props.barData]);

    if (!props.barData || props.barData.length === 0) {
        return (
            <Box
                sx={{
                    height: 1,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                No data available.
            </Box>
        );
    }

    const handleCheckboxChange = (index) => {
        const newSelection = [...selectedDatasets];
        newSelection[index] = !newSelection[index];
        setSelectedDatasets(newSelection);
    };

    const handleCheckAll = () => {
        const allTrue = selectedDatasets.every((selected) => selected);
        const newSelection = selectedDatasets.map(() => !allTrue);
        setSelectedDatasets(newSelection);
        console.log(selectedDatasets);
    };

    const customColors = [
        "rgba(54, 162, 235, 0.75)",
        "rgba(255, 99, 132, 0.75)",
        "rgba(255, 186, 86, 0.75)",
        "rgba(75, 222, 192, 0.75)",
        "rgba(153, 102, 255, 0.75)",
        "rgba(255, 147, 80, 0.75)",
        "rgba(255, 172, 203, 0.75)",
        "rgba(135, 206, 255, 0.75)",
        "rgba(255, 235, 0, 0.75)",
        "rgba(32, 198, 90, 0.75)",
    ];

    const customBorders = [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 186, 86, 1)",
        "rgba(75, 222, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 147, 80, 1)",
        "rgba(255, 172, 203, 1)",
        "rgba(135, 206, 255, 1)",
        "rgba(255, 235, 0, 1)",
        "rgba(32, 198, 90, 1)",
    ];

    const data = {
        labels,
        datasets: props.barData.map(({ label, data }, index) => ({
            label,
            data,
            type: label === props.lineOption ? "line" : "bar",
            backgroundColor: customColors[index % customColors.length],
            borderColor: customBorders[index % customBorders.length],
            hidden: !selectedDatasets[index],
            order: label === props.lineOption ? 0 : 1,
        })),
    };

    return (
        <Box
            sx={{
                height: 1,
                width: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {selectedDatasets.length == props.barData.length ? (
                <>
                    {shouldShrink ? (
                        <FormGroup row sx={{ height: "auto", width: 1 }}>
                            {selectedDatasets ? (
                                <Button
                                    onClick={() => handleCheckAll()}
                                    sx={{
                                        "& .MuiSvgIcon-root": { fontSize: 15 },
                                        marginRight: 1,
                                    }}
                                >
                                    Toggle All
                                </Button>
                            ) : null}
                            {props.barData.map(({ label }, index) => (
                                <FormControlLabel
                                    key={label}
                                    control={
                                        <Checkbox
                                            checked={selectedDatasets[index]}
                                            onChange={() =>
                                                handleCheckboxChange(index)
                                            }
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 15,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            sx={{
                                                fontSize: 15,
                                                color: customBorders[
                                                    index % customBorders.length
                                                ],
                                                paddingX: "3px", // Optional: Add padding for better visual appearance
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    }
                                />
                            ))}
                        </FormGroup>
                    ) : null}
                    {shouldShrink ? (
                        <Box
                            sx={{
                                height: "auto",
                                width: 1,
                                flexGrow: 1,
                                flexShrink: 1, // Adding flex-shrink property
                            }}
                        >
                            <Bar
                                style={{}}
                                plugins={[ChartDataLabels]}
                                options={options}
                                data={data}
                            />
                        </Box>
                    ) : null}
                </>
            ) : null}
        </Box>
    );
}

export default BarChart;
