import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function AppBarCustom(props) {
    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                width: 1,
                height: 60,
                bgcolor: "white",
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    width: 1,
                }}
            >
                <Box
                    sx={{
                        width: 1,
                        height: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="button"
                        color="datatext.main"
                        sx={{ fontSize: 18 }}
                    >
                        {props.appBarName}
                    </Typography>
                    <Box
                        sx={{
                            height: 1,
                            paddingLeft: 2,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {props.icon}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default AppBarCustom;
