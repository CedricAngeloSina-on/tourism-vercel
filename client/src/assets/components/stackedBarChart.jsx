import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function BarChart(props) {
	const options = {
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			colors: {
				forceOverride: true,
			},
		},
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	// Check if there is data
	if (!props.barData || props.barData.length === 0) {
		return <>No data available.</>;
	}

	const labels = props.barLabelXAxis;

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
		"rgba(255, 99, 132, 1)",
		"rgba(54, 162, 235, 1)",
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
			backgroundColor: customColors[index % customColors.length],
			borderColor: customBorders[index % customBorders.length],
			borderWidth: 1,
		})),
	};

	return <Bar style={{}} options={options} data={data} />;
}

export default BarChart;
