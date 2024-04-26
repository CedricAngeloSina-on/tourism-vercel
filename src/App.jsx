import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import axios from "axios";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";

function App() {
    axios.defaults.withCredentials = true;
    const theme = createTheme({
        typography: {
            t1: {
                fontFamily: "Inter",
                fontSize: "64px",
                fontWeight: 900,
                lineHeight: "normal",
            },
        },
        palette: {
            buttonGuim: {
                main: "#FFD800",
            },
            errorGuim: {
                main: "#FF0000",
            },
            contrast: {
                main: "#008181",
            },
            text: {
                main: "#FFFFFF",
            },
            datatext: {
                main: "#525B62",
            },
            datatext2: {
                main: "#43494E",
            },
            subtext: {
                main: "#000000",
            },
            highlight: {
                main: "#50C878",
            },
            admin: {
                main: "#19242E",
            },
            guimaras: {
                main: "#FFD800",
            },
            sibunag: {
                main: "#FFA726",
            },
            buenavista: {
                main: "#0044AA",
            },
            jordan: {
                main: "#FF5733",
            },
            valencia: {
                main: "#44A047",
            },
            lorenzo: {
                main: "#9C27B0",
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RouterProvider router={router} />
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
