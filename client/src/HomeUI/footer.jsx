import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import guimaraslogo from "../assets/images/guimaras-logo.png";

// Define the Footer component
const Footer = () => {
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    return (
        <Box
            sx={{
                height: { xs: "auto", md: windowSize[1], xl: 500 },
                bgcolor: "#008181",
                position: "relative",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    height: "80%",
                    width: "90%",
                    color: "black",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        width: "90%",
                        color: "black",
                    }}
                >
                    <Typography variant="t1">Footer</Typography>
                </Box>

                <Box
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        width: "90%",
                        color: "black",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            width: "34%",
                        }}
                    >
                        <Typography>
                            © 2023 Provincial Government of Guimaras
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "33%",
                        }}
                    >
                        <img
                            src={guimaraslogo}
                            alt={guimaraslogo}
                            width="35%"
                        />
                    </Box>
                    <Box
                        sx={{
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            width: "34%",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Typography>
                            Made with UI-san's Imagination and Intellect
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
