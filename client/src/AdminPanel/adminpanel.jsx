import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Grid,
    styled,
    Collapse,
    Hidden,
} from "@mui/material";
import MuiList from "@mui/material/List";
import MuiDivider from "@mui/material/Divider";
import CssBaseline from "@mui/material/CssBaseline";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ideamsLogo from "../assets/images/ideamsLogo.png";

const drawerWidth = 300;

const Divider = styled(MuiDivider)({
    backgroundColor: "#c3c2bd",
});

const List = styled(MuiList)({
    "& .MuiListItemButton-root": {
        margin: "5px 0",
        borderRadius: "10px",
    },

    "&& .MuiListItemIcon-root, && .MuiListItemText-root": {
        color: "white",
        fontWeight: "bold",
    },

    // selected and (selected + hover) states
    "&& .Mui-selected, && .Mui-selected:hover": {
        backgroundColor: "rgba(195, 194, 189, 0.2)",
        "&, & .MuiListItemIcon-root": {
            // color: "pink",
        },
    },
    // hover states
    "& .MuiListItemButton-root:hover": {
        backgroundColor: "rgba(195, 194, 189, 0.2)",
        "&, & .MuiListItemIcon-root": {
            // color: "yellow",
        },
    },
});

function AdminUI() {
    const containerRef = useRef(null);
    const [hasScrollbar, setHasScrollbar] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        const handleScrollCheck = () => {
            const hasVerticalScrollbar =
                container.scrollHeight > container.clientHeight;
            setHasScrollbar(hasVerticalScrollbar);
        };

        container.addEventListener("scroll", handleScrollCheck, {
            passive: true,
        });

        // Initial check
        handleScrollCheck();

        return () => {
            container.removeEventListener("scroll", handleScrollCheck);
        };
    }, []);

    //   const { window } = props;

    const navigate = useNavigate();

    //Checking if credentials are valid or not expired
    //must have all the time

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    const handleClick2 = () => {
        setOpen2(!open2);
    };
    const handleClick3 = () => {
        setOpen3(!open3);
    };

    //Hide certain fields depending on user role
    const [dashboardName, setDashboardName] = useState("");
    const [roleIdentify, setRoleIdentify] = useState();

    const fetchData = (url, requestData, successCallback) => {
        axios
            .post(url, requestData)
            .then((response) => {
                console.log("Response:", response.data);
                successCallback(response.data);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    };

    //Fetching data for graphs on first render of page
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            console.log(userID.provinceID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            break;
                        case 2:
                            console.log(userID.municipalityID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            break;
                        case 3:
                            console.log(userID.establishmentID);
                            setRoleIdentify(userID.account_roleID);
                            fetchDashboardName(
                                userID.id,
                                userID.account_roleID
                            );
                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                }
                console.log(roleIdentify);
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, []);

    //Set Dashboard Name
    function fetchDashboardName(accountID, account_roleID) {
        const requestData = {
            accountID: accountID,
            account_roleID: account_roleID,
        };

        fetchData(
            `${import.meta.env.VITE_WEBSITE_URL}/get_dashboard_name`,
            requestData,
            (data) => {
                setDashboardName(data.toLocaleString());
            }
        );
    }

    //Insert Query code to determine Account Role

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_WEBSITE_URL}/check-login`)
            .then((response) => {
                const { userID } = response.data;

                if (userID) {
                    switch (userID.account_roleID) {
                        case 1:
                            setRoleIdentify(userID.account_roleID);
                            break;
                        case 2:
                            setRoleIdentify(userID.account_roleID);
                            break;
                        case 3:
                            setRoleIdentify(userID.account_roleID);
                            break;
                        default:
                            console.log("hehehe");
                            break;
                    }
                } else {
                    console.log("User ID not found in the response.");
                    navigate("/home/login");
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error:", error);
            });
    }, []);

    const panelicons = [
        {
            index: 0,
            iconname: "Summary",
            icon: <LeaderboardRoundedIcon />,
            component: "/manage/dashboard/summary",
        },
        {
            index: 1,
            iconname: "Checked-ins",
            icon: <EmojiPeopleRoundedIcon />,
            component: "/manage/dashboard/checkedin",
        },
        {
            index: 2,
            iconname: "Guest Nights",
            icon: <NightsStayRoundedIcon />,
            component: "/manage/dashboard/guestnights",
        },
        {
            index: 3,
            iconname: "Average Length of Stay",
            icon: <AccessTimeFilledRoundedIcon />,
            component: "/manage/dashboard/average_length_of_stay",
        },
        {
            index: 4,
            iconname: "Occupancy Rate",
            icon: <HotelRoundedIcon />,
            component: "/manage/dashboard/occupancy_rate",
        },
        {
            index: 5,
            iconname: "Market Segments",
            icon: <HotelRoundedIcon />,
            component: "/manage/dashboard/market_segments",
        },
        {
            index: 6,
            iconname: "Employment and Workforce",
            icon: <HotelRoundedIcon />,
            component: "/manage/dashboard/employment_workforce",
        },
        {
            index: 7,
            iconname: "Revenue & Expenditure",
            icon: <AttachMoneyRoundedIcon />,
            component: "/manage/dashboard/revenue_expenditure",
        },
        {
            index: 8,
            iconname: "Average Length of Stay Forecast",
            icon: <ShowChartIcon />,
            component: "/manage/forecasting/average_length_of_stay",
        },
        {
            index: 9,
            iconname: "Employment and Workforce Forecast",
            icon: <ShowChartIcon />,
            component: "/manage/forecasting/workforce",
        },
        {
            index: 10,
            iconname: "Market Segments Forecast",
            icon: <ShowChartIcon />,
            component: "/manage/forecasting/market_segments",
        },
        ...(roleIdentify === 1 || roleIdentify === 2
            ? [
                  {
                      index: 11,
                      iconname: "Location",
                      icon: <MapRoundedIcon />,
                      component: "/manage/maps/locations",
                  },
                  {
                      index: 12,
                      iconname: "Accomodation",
                      icon: <MapRoundedIcon />,
                      component: "/manage/maps/accomodation",
                  },
                  {
                      index: 13,
                      iconname: "Guest Origin",
                      icon: <MapRoundedIcon />,
                      component: "/manage/maps/origin",
                  },
              ]
            : []),

        ...(roleIdentify === 1 || roleIdentify === 2
            ? [
                  {
                      index: 14,
                      iconname: "Create Account",
                      icon: <PersonAddRoundedIcon />,
                      component: "/manage/create-account",
                  },
              ]
            : []),
        ...(roleIdentify === 1
            ? [
                  {
                      index: 15,
                      iconname: "Create Municipality",
                      icon: <AddLocationAltRoundedIcon />,
                      component: "/manage/create-municipality",
                  },
              ]
            : []),
        ...(roleIdentify === 2
            ? [
                  {
                      index: 16, // Updated index to 4
                      iconname: "Create Establishment",
                      icon: <AddHomeWorkRoundedIcon />,
                      component: "/manage/create-establishments",
                  },
              ]
            : []),
        {
            index: 17, // Updated index to 5
            iconname: "Users",
            icon: <PersonRoundedIcon />,
            component: "/manage/users",
        },
        ...(roleIdentify === 3
            ? [
                  {
                      index: 18, // Updated index to 6
                      iconname: "Create Guest Report",
                      icon: <NoteAddRoundedIcon />,
                      component: "/manage/guest-report",
                  },
                  {
                      index: 19, // Updated index to 6
                      iconname: "Create Workforce Report",
                      icon: <NoteAddRoundedIcon />,
                      component: "/manage/workforce-report",
                  },
              ]
            : []),
        ...(roleIdentify === 1
            ? [
                  {
                      index: 20, // Updated index to 7
                      iconname: "Municipality Reports",
                      icon: <SummarizeRoundedIcon />,
                      component: "/manage/entries",
                  },
              ]
            : []),
        ...(roleIdentify === 2
            ? [
                  {
                      index: 21, // Updated index to 8
                      iconname: "Establishment Reports",
                      icon: <SummarizeRoundedIcon />,
                      component: "/manage/entries",
                  },
              ]
            : []),
        ...(roleIdentify === 3
            ? [
                  {
                      index: 22, // Updated index to 9
                      iconname: "Entry List",
                      icon: <SummarizeRoundedIcon />,
                      component: "/manage/entries",
                  },
              ]
            : []),
        {
            index: 23, // Updated index to 10
            iconname: "Generate Report",
            icon: <ListAltRoundedIcon />,
            component: "/manage/---------------",
        },
        {
            index: 24, // Updated index to 11
            iconname: "Logout",
            icon: <LogoutRoundedIcon />,
            component: "/manage/logout",
        },
    ];

    let computedDashboardName;
    if (roleIdentify == "1") {
        computedDashboardName = "Province of " + dashboardName;
    } else if (roleIdentify == "2") {
        computedDashboardName = "Municipality of " + dashboardName;
    } else {
        computedDashboardName = dashboardName;
    }

    const drawerpanel = (
        <Box
            ref={containerRef}
            p={2}
            sx={{
                height: 1,
                backgroundColor: "#19242e",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "space-between",
            }}
        >
            <Box>
                <Box
                    height={150}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            //   height: 1,
                            width: 1,
                            //   maxHeight: { xs: 233, md: 167 },
                            //   maxWidth: { xs: 350, md: 250 },
                        }}
                        src={ideamsLogo}
                    />
                </Box>
                <Divider />
                <List>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <DashboardRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                        {open ? (
                            <ExpandLess sx={{ color: "#c3c2bd" }} />
                        ) : (
                            <ExpandMore sx={{ color: "#c3c2bd" }} />
                        )}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {panelicons
                                .filter(({ index }) => index >= 0 && index <= 7) // Updated index range
                                .map(({ iconname, icon, index, component }) => (
                                    <ListItem key={index} disablePadding={true}>
                                        <ListItemButton
                                            to={component}
                                            component={RouterLink}
                                            sx={{ paddingLeft: 4 }}
                                        >
                                            <ListItemIcon>{icon}</ListItemIcon>
                                            <ListItemText
                                                primary={iconname}
                                                // disableTypography
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    </Collapse>
                </List>
                <Divider />
                <List>
                    <ListItemButton onClick={handleClick2}>
                        <ListItemIcon>
                            <AnalyticsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Forecasting" />
                        {open2 ? (
                            <ExpandLess sx={{ color: "#c3c2bd" }} />
                        ) : (
                            <ExpandMore sx={{ color: "#c3c2bd" }} />
                        )}
                    </ListItemButton>
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {panelicons
                                .filter(
                                    ({ index }) => index >= 8 && index <= 10
                                ) // Updated index range
                                .map(({ iconname, icon, index, component }) => (
                                    <ListItem key={index} disablePadding={true}>
                                        <ListItemButton
                                            to={component}
                                            component={RouterLink}
                                            sx={{ paddingLeft: 4 }}
                                        >
                                            <ListItemIcon>{icon}</ListItemIcon>
                                            <ListItemText
                                                primary={iconname}
                                                // disableTypography
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    </Collapse>
                </List>

                {roleIdentify != 3 ? (
                    <>
                        <Divider />
                        <List>
                            <ListItemButton onClick={handleClick3}>
                                <ListItemIcon>
                                    <MapRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Maps" />
                                {open3 ? (
                                    <ExpandLess sx={{ color: "#c3c2bd" }} />
                                ) : (
                                    <ExpandMore sx={{ color: "#c3c2bd" }} />
                                )}
                            </ListItemButton>
                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    {panelicons
                                        .filter(
                                            ({ index }) =>
                                                index >= 11 && index <= 13
                                        ) // Updated index range
                                        .map(
                                            ({
                                                iconname,
                                                icon,
                                                index,
                                                component,
                                            }) => (
                                                <ListItem
                                                    key={index}
                                                    disablePadding={true}
                                                >
                                                    <ListItemButton
                                                        to={component}
                                                        component={RouterLink}
                                                        sx={{ paddingLeft: 4 }}
                                                    >
                                                        <ListItemIcon>
                                                            {icon}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={iconname}
                                                            // disableTypography
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        )}
                                </List>
                            </Collapse>
                        </List>
                    </>
                ) : null}
                {roleIdentify != 3 ? (
                    <>
                        <Divider />
                        <List>
                            {panelicons
                                .filter(
                                    ({ index }) => index >= 14 && index <= 16
                                ) // Updated index range
                                .map(({ iconname, icon, index, component }) => (
                                    <ListItem key={index} disablePadding={true}>
                                        <ListItemButton
                                            to={component}
                                            component={RouterLink}
                                        >
                                            <ListItemIcon>{icon}</ListItemIcon>
                                            <ListItemText
                                                primary={iconname}
                                                // disableTypography
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    </>
                ) : null}

                <Divider />
                <List>
                    {panelicons
                        .filter(({ index }) => index >= 17 && index <= 21) // Updated index range
                        .map(({ iconname, icon, index, component }) => (
                            <ListItem key={index} disablePadding={true}>
                                <ListItemButton
                                    to={component}
                                    component={RouterLink}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText
                                        primary={iconname}
                                        // disableTypography
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
                <Divider />
                <List>
                    {panelicons
                        .filter(({ index }) => index >= 22 && index <= 23) // Updated index range
                        .map(({ iconname, icon, index, component }) => (
                            <ListItem key={index} disablePadding={true}>
                                <ListItemButton
                                    to={component}
                                    component={RouterLink}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText
                                        primary={iconname}
                                        // disableTypography
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
                {hasScrollbar && (
                    <Box height={1000} width={1} sx={{}}>
                        {/* Content for the top box */}
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    //   bgcolor: "red",
                    //   paddingBottom: 2,
                    width: 1,
                    display: "flex",
                    alignSelf: "flex-end",
                    justifySelf: "flex-end",
                }}
            >
                <Button
                    to="/manage/logout"
                    component={RouterLink}
                    //   variant="outlined"
                    startIcon={<LogoutRoundedIcon />}
                    sx={{ width: 1, height: 50, color: "white" }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    //   const container =
    //     window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex", height: 1 }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: "white",
                    display: { xs: "flex", lg: "none" },
                    //   ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <Grid container direction="row">
                        <Grid
                            container
                            item
                            alignItems="center"
                            justifyContent="flex-start"
                            // backgroundColor="violet"
                            xs={2}
                        >
                            <Grid item>
                                <IconButton
                                    color="#c3c2bd"
                                    aria-label="open drawer"
                                    //   edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ display: { lg: "none" } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            item
                            direction="row"
                            //   justifyContent="flex-end"
                            alignItems="center"
                            justifyContent="flex-end"
                            // backgroundColor="blue"
                            xs
                            spacing={{ xs: 3, md: 5 }}
                        >
                            <Grid item>
                                <IconButton
                                    // edge="end"
                                    color="#c3c2bd"
                                >
                                    {/* <AccountCircle /> */}
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    //   container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", lg: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 250,
                            border: "none",
                        },
                    }}
                >
                    {drawerpanel}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", lg: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            border: "none",
                        },
                    }}
                    PaperProps={{
                        sx: {
                            backgroundColor: "#19242e",
                        },
                    }}
                    open
                >
                    {drawerpanel}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    height: 1,
                    padding: 0,
                }}
            >
                {/* Keep!!!!!!!!!!!! */}
                <Toolbar
                    sx={{
                        display: { xs: "block", lg: "none" },
                        height: 10,
                    }}
                />
                <Outlet
                    context={{
                        dashboardName: computedDashboardName,
                        roleIdentify,
                    }}
                />
            </Box>
        </Box>
    );
}

export default AdminUI;
