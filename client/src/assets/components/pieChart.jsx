import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart(props) {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: props.display,
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                display: function (context) {
                    // Calculate sum of all data points
                    var sum = context.dataset.data.reduce(
                        (acc, curr) => acc + curr,
                        0
                    );
                    // Get the current value
                    var value = context.dataset.data[context.dataIndex];
                    // Calculate 3% of the total
                    var threshold = 0.1 * sum;

                    if (
                        context.active ||
                        value === 0 ||
                        isNaN(value) ||
                        (context.dataset.data.length > 3 &&
                            (value < threshold || value === 0 || isNaN(value)))
                    ) {
                        return false;
                    } else {
                        // Enable labels for all other cases
                        return true;
                    }
                },
                backgroundColor: function (context) {
                    return context.dataset.backgroundColor;
                },
                borderColor: "white",
                borderRadius: 50,
                borderWidth: 2,
                color: "white",
                padding: 6,
                formatter: (value, ctx) => {
                    const total = ctx.chart.getDatasetMeta(0).total;
                    let percentage = Math.floor((value * 100) / total) + "%";
                    return percentage;
                },
                anchor: function (context) {
                    var sum = context.dataset.data.reduce(
                        (acc, curr) => acc + curr,
                        0
                    );
                    var dataIndex = context.dataIndex;
                    var value = context.dataset.data[context.dataIndex];

                    return value === sum ? "start" : "center";
                },
            },
        },
    };

    const labels = props.pieLabel;

    if (!props.data || props.data.length === 0) {
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
        datasets: [
            {
                type: "pie",
                label: props.labels,
                data: props.data,
                backgroundColor: customColors,
                hoverBorderWidth: 0,
                borderWidth: function (context) {
                    var sum = context.dataset.data.reduce(
                        (acc, curr) => acc + curr,
                        0
                    );
                    var dataIndex = context.dataIndex;
                    var value = context.dataset.data[context.dataIndex];

                    return value === sum ? 0 : 4;
                },
                borderRadius: function (context) {
                    var sum = context.dataset.data.reduce(
                        (acc, curr) => acc + curr,
                        0
                    );
                    var dataIndex = context.dataIndex;
                    var value = context.dataset.data[context.dataIndex];

                    return value === sum ? 0 : 4;
                },
            },
        ],
    };

    return (
        <Pie
            style={{ width: 1, height: 1 }}
            plugins={[ChartDataLabels]}
            options={options}
            data={data}
        />
    );
}

export default PieChart;
