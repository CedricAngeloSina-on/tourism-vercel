import { React, useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
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
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function LineChart(props) {
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const [shouldShrink, setShouldShrink] = useState(true);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: "index",
        },
        plugins: {
            filler: {
                propagate: true,
            },
            tooltip: {
                // enabled: false,
            },
            legend: {
                display: false,
                position: "top",
            },
            // datalabels: {
            //     display: function (context) {
            //         return context.dataset.data[context.dataIndex] > 0;
            //     },
            //     borderWidth: 3,
            //     borderRadius: 40,
            //     color: function (context) {
            //         return context.active
            //             ? "white"
            //             : context.dataset.backgroundColor;
            //     },
            //     font: {
            //         weight: "bold",
            //     },
            //     // formatter: Math.round,
            //     padding: 6,
            //     align: "center",
            //     anchor: "center",
            //     backgroundColor: function (context) {
            //         return context.active
            //             ? context.dataset.backgroundColor
            //             : "white";
            //     },
            //     borderColor: function (context) {
            //         return context.dataset.backgroundColor;
            //     },
            //     transtion: 2.0,
            //     formatter: function (value) {
            //         return value.toFixed(2);
            //     },
            // },
        },
    };

    const labels = props.lineLabelXAxis;

    useEffect(() => {
        // setSelectedDatasets("");
        setShouldShrink(false);
        setTimeout(() => {
            setShouldShrink(true);
        }, 1);
    }, [props.lineLabelXAxis]);

    useEffect(() => {
        // setSelectedDatasets("");
        if (props.lineData && props.lineData.length > 0) {
            setSelectedDatasets(props.lineData.map(() => false));
        }
    }, [props.lineData]);

    if (!props.lineData || props.lineData.length === 0) {
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
    };

    const customColors = [
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
        datasets: props.lineData.map(({ label, data }, index) => ({
            label,
            data,
            fill: props.lineFill,
            cubicInterpolationMode: props.lineTension,
            pointRadius: 5,
            pointHoverRadius: 10,
            backgroundColor: customColors[index % customColors.length],
            borderColor: customBorders[index % customBorders.length],
            hidden: !selectedDatasets[index],
            segment: {
                borderDash: props.isForcasting
                    ? (ctx) => {
                          const index = ctx.p0.parsed.x;
                          return index !== 0 ? [6, 6] : [];
                      }
                    : [],
            },

            //   tension: 0.5,
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
            {selectedDatasets.length == props.lineData.length ? (
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
                            {props.lineData.map(({ label }, index) => (
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
                            <Line
                                style={{}}
                                // plugins={[ChartDataLabels]}
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

export default LineChart;
