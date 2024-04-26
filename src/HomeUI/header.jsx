import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
    //handle svg map behavior on mouse actions
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedPathTitle, setSelectedPathTitle] = useState(
        "The Island of Guimaras"
    );
    const [isTitleVisible, setIsTitleVisible] = useState(false);

    const handlePathClick = (id) => {
        setSelectedPath(id);
        // Retrieve the title of the selected path
        const titleElement = document.querySelector(`#${id} title`);
        if (titleElement) {
            setSelectedPathTitle(titleElement.textContent);
        } else {
            setSelectedPathTitle(""); // Clear the title if not found
        }
    };

    return (
        <>
            <Box
                sx={{
                    width: 1 / 2,
                    height: 1,
                    // bgcolor: "grey",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: 1,
                        height: 1 / 2,
                        // bgcolor: "grey",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid container direction="column" rowSpacing={5}>
                        <Grid item>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // bgcolor: "gold",
                                }}
                            >
                                <Typography
                                    variant="t1"
                                    sx={{
                                        // typography: { xs: "body2", sm: "h3" },
                                        fontSize: {
                                            xs: 48,
                                            sm: 80,
                                            md: 88,
                                            lg: 96,
                                            xl: 100,
                                        },
                                        color: "white",
                                    }}
                                >
                                    GUIMARAS
                                </Typography>
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: "body2",
                                            sm: "t1",
                                        },
                                        fontSize: {
                                            xs: 48,
                                            sm: 80,
                                            md: 88,
                                            lg: 30,
                                            xl: 25,
                                        },
                                        color: "white",
                                    }}
                                    style={{ fontWeight: 600 }}
                                >
                                    The island that fits your taste!
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // bgcolor: "orange",
                                }}
                            >
                                <Button
                                    color="buttonGuim"
                                    variant="contained"
                                    sx={{
                                        width: 1 / 3,
                                        height: 50,
                                        transition:
                                            "background 0.5s,color 0.5s ease-in-out",
                                        "&:hover": {
                                            backgroundColor: "highlight.main",
                                            color: "text.main",
                                        },
                                    }}
                                >
                                    LET'S EXPLORE
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Guimaras */}
            <Box
                sx={{
                    width: 1 / 2,
                    height: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "80%",
                        height: "80%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 644.48 892.39"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>The Island of Guimaras</title>
                        <g id="Buenavista">
                            <title>Buenavista</title>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M568.5,262.5s-8,0-3,11l-1,13a31.39,31.39,0,0,0-1,9s1,9,10,9c0,0-3,15,11,12,0,0,10,5,14,10,0,0,4-5,13-7,0,0,9,0,13,18,0,0,19,28,42,26,0,0,11,18,15,20,0,0,36-42,41-53,0,0,1,4,8,9a126.47,126.47,0,0,0,16-1s26-22,29-29c0,0,9.16,5.28,18,6,6.94.56,14.62-2.48,17-2,8.64,1.73,15.81,5.58,19,7,0,0,7-11,24-11,14.32,0,1-31,1-31l5-5s-10,1,1-8c0,0,6-7-2-10,0,0,8-7,2-19,0,0,13-10,1-18,0,0-2-13-3-27,0,0-8-9-12-25,0,0-25-23-40-19,0,0,0-5-10-7,0,0-12-13-20-12,0,0-13-25-17-27,0,0,1-6-6-5,0,0-10-13-26-15,0,0-7-6-6-9,0,0-10,1-14-6,0,0-29,8-31,25l7,7V102s-14,6.5-11,17.5c0,0-13-2-30,14,0,0-19,0-36,16,0,0-17,10-11,16,0,0-5,10-7,11V184s-11,14.5,4,31.5c0,0-6,17,6,23,0,0-15,6-15,10V262S573.5,275.5,568.5,262.5Z"
                                className="municipality"
                                id="Buenavista"
                                onClick={() => handlePathClick("Buenavista")}
                                style={{
                                    fill:
                                        selectedPath === "Buenavista"
                                            ? "#0044aa"
                                            : "",
                                }}
                            ></path>
                        </g>

                        <g id="Jordan">
                            <title>Jordan</title>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M598,325s-7-9-17-9c-7,0-7-12-7-12s-13,0-9-16-1-27-1-27-9,11-24,11-13,22-9,26-8-2-11-6-12,12-10,18-30,0-30-23c0,0-30,2-24,16s23,33-7,61c0,0-15-2-15,25,0,0-5,1-8,0s-30,10-30,22c0,0-9-4-13,8,0,0-18,1-6,17v16s-5-1-7,9l-18-5s-3,4-2,16c0,0-10,6-10,11,0,0,6,1,6,5,0,0-11,0-11,3,0,0,2,8,1,9s-9,6-9,9c0,0,8,9,5,36,0,0,5,11,12,6,0,0-6,13,3,18,0,0,2,1,9-8,0,0,2,5-4,13s9,3,9,3-20,7-2,12c0,0-13,9,3,24l30-25s9-8,10-12c0,0,32,1,34,3,0,0,8-34,57-72,0,0,16,17,17,25a10.7,10.7,0,0,0,8-12s5-7,13,0c0,0,22-5,29-15a642,642,0,0,0,76,9l9-23-10-19,7-29s-12-30-19-31l-59-44S592,335,598,325Z"
                                className="municipality"
                                id="Jordan"
                                onClick={() => handlePathClick("Jordan")}
                                style={{
                                    fill:
                                        selectedPath === "Jordan"
                                            ? "#ff5733"
                                            : "",
                                }}
                            ></path>
                        </g>

                        <g id="Sibunag">
                            <title>Sibunag</title>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M391.5,588.5s11-8,9-13l35,2s14-44,57-70c0,0,18,12,19,24,0,0,10-5,5-12,0,0,8-5,14,0,0,0,22-4,29-15,0,0,56,11,76,9l9,17-12,10s8-3,11,5c0,0,8-3,14-2l-27,47,62,32s2,14,17,14c0,0,6,9,22,3,0,0,6,6,14-2,0,0,3,10,14,10l10-10s-3,10,1,14-3,22-3,22-8,7-2,14c0,0,5,21-2,27,0,0-23,6-24,19,0,0-14,8-15,12l3,2s-13,15-2,33c0,0-24,14-29-4,0,0-32,2-26,33,0,0-11,31,6,24,0,0-2,12-13,4,0,0-6,4-5,17,0,0-11-9-13-7,0,0-6,6-11,2a21.24,21.24,0,0,0-4,15s-11,4-2,14c0,0-1,6-8,1-2.55-1.82-8,13-13-7-.68-2.73-5.45.44-8-3,0,0-8.3,1.29-18,3-17,3-21-12-21-12l15,1v-18l12-12v-6l10-5s-23-3-17-17c0,0-11-4-3-10,0,0,11-1,26,9,0,0,3-3,1-15,0,0-6-14-9-16,0,0,0-7,1-7s-9-19-9-19-8-2-9-9c0,0-11,0-11-9,0,0-3-14-14-2,0,0-9,5-19-12l-4,15s-12,1-16,10c0,0-21,21-33,34l-10-2-7-16s-10-3-11-12c0,0-4-6-12-3,0,0,0-11-8-19,0,0-4-16-15-21,0,0,8-17-5-21,0,0-2-10-2-11,0,0-10-1-5-11,0,0,7-39,11-44,0,0,2-10-5-5C412.5,607.5,391.5,591.5,391.5,588.5Z"
                                className="municipality sibunag"
                                style={{
                                    fill:
                                        selectedPath === "Sibunag" || isHovered
                                            ? "#FFA726"
                                            : "",
                                }}
                                onMouseEnter={handleHover}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handlePathClick("Sibunag")}
                            ></path>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M791.5,816.5s-34-2,0-32c0,0,6-10,26-12,0,0,19,13,21,19s8,3,8,3,7,20,19,15c0,0,1,31,17,17,0,0,6,11-19,18,0,0-13-9-28-5,0,0-17,0-30,10,0,0-6-7-14,14,0,0-3-8-21-5,0,0-13-3,7-16,0,0-5-10,8-20C785.5,822.5,794.5,833.5,791.5,816.5Z"
                                className="municipality sibunag"
                                style={{
                                    fill:
                                        selectedPath === "Sibunag" || isHovered
                                            ? "#FFA726"
                                            : "",
                                }}
                                onMouseEnter={handleHover}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handlePathClick("Sibunag")}
                            ></path>
                        </g>
                        <g id="Nueva_Valencia">
                            <title>Nueva Valencia</title>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M569.61,871.29l-8.11,8.21s-11-2-11,12c0,0-13-11-40,4,0,0-9,2,6-15,0,0-11-3-5-11,0,0-19-20,14-14,0,0,19,17,3-23l-14-2s-18,16-36,13c0,0-11,11-4,14,0,0-1,12-9,17l-1,11s-12,11-12,16c0,0-14,16-14,22,0,0-1,5-8,0,0,0,1,9-9,18,0,0-11-5-9,9,0,0-14-4-17-6,0,0-13-8-20,2,0,0-9-6-13,8-4,11-15-9-15-9l-7,5-2-14-5-5s7-8,10-9,.39-13-13-5c-5,3,1-11,1-11s-11.47-22.29,5-12c8,5-9-11-9-11s-24-10-15-25c0,0,2-2-4-6s1-16,15-10c0,0-6-15-15-5s-3-10,7-11-9-5-9-5-6-9,4-11l-10-3-6-7s-15-4-26,6-4-19,14-17c0,0,2-10-6-9s-14-5-14-7c0,0-24,12-21-15s-16-31,25-64c0,0,6,8,17-3,0,0,0,7,28-5,0,0,15,3,18,7,0,0,8-7,22-7,0,0,13-19,12-22s-14,4-22-24c0,0-30-4,0-15,0,0,8-5,23,4s23,7,23,7l-10-11s-6-6,40-15l-11,46s-4,9,5,11l2,11s12,2,5,21c0,0,16,10,15,21,0,0,9,9,8,19,0,0,9-4,12,3,0,0,3,10,11,12l7,16,10,2,33-34s4-9,16-10l4-15s6,13,19,12c0,0,12.3-12.59,14.15,3.7,0,0,3.85,8.3,10.85,7.3,0,0,4,8,9,9l8.93,18.27-.93,7.73,9.15,17s3.85,11-1.15,14c0,0-17-11-26-9,0,0-7,6,3,10,0,0-6,13,17,17l-10,5v6l-12,12v18l-15-1S560.71,866.07,569.61,871.29Z"
                                className="municipality"
                                id="Nueva_Valencia"
                                onClick={() =>
                                    handlePathClick("Nueva_Valencia")
                                }
                                style={{
                                    fill:
                                        selectedPath === "Nueva_Valencia"
                                            ? "#44a047"
                                            : "",
                                }}
                            ></path>
                        </g>
                        <g id="San_Lorenzo">
                            <title>San Lorenzo</title>
                            <path
                                transform="translate(-239.16 -65.91)"
                                d="M564,368s30-36,34-43c0,0,14-12,20-2s16,39,49,41l14,20,41-54a16.52,16.52,0,0,0,15,9s3-3,9,0c0,0,27-26,29-29,0,0,19,9,35,3l19,7s8-11,24-10c0,0,3,18,7,19s16,13,13,25c0,0,9,10-8,24a30.29,30.29,0,0,0,10,23s-7,10,5,15c0,0,3,5-17,21v9s-17,17-20,31v7s-7,4-6,7c0,0,5,2,1,14,0,0-21,0-7,31,0,0-6,9-10,13,0,0-9-1-12,12,0,0-4,2-4,8,0,0-6,6,1,26,0,0-13,3-11,20,0,0-4,5-16,10,0,0-9,9-9,13,0,0-7,9-10,10,0,0-11-1-14-10,0,0-9,7-15,2,0,0-15,5-22-4,0,0-13,2-17-14l-61-31,25-45-1-2h-8s-5,4-6-3h-9l12-11-8-16,8-24-10-16,7-32-17-29Z"
                                className="municipality"
                                id="San_Lorenzo"
                                onClick={() => handlePathClick("San_Lorenzo")}
                                style={{
                                    fill:
                                        selectedPath === "San_Lorenzo"
                                            ? "#9c27b0"
                                            : "",
                                }}
                            ></path>
                        </g>
                    </svg>
                </Box>
                <Box
                    sx={{
                        width: "20%",
                        height: "80%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        key={selectedPathTitle}
                        color="text.main"
                        sx={{
                            textOrientation: "upright",
                            writingMode: "vertical-lr",
                            opacity: selectedPathTitle ? 1 : 0,
                            transition: "opacity 0.5s", // Adjust the transition duration as needed
                        }}
                    >
                        {selectedPathTitle}
                    </Typography>
                </Box>
            </Box>
            <Box className="custom-shape-divider-bottom-1698137052">
                <svg
                    id="svg"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                        className="shape-fill"
                    ></path>
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                        className="shape-fill"
                    ></path>
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="shape-fill"
                    ></path>
                </svg>
            </Box>
        </>
    );
};

export default Header;
