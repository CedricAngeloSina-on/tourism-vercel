import React from "react";
import { useState } from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  Divider,
  IconButton,
  Link,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Grid,
  styled,
} from "@mui/material";
import MuiList from "@mui/material/List";
import guimtitle from "../assets/images/guimtitle.png";
import guimnoTree from "../assets/images/guimnoTree.png";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const List = styled(MuiList)({
  "& .MuiListItemButton-root": {
    borderRadius: "10px",
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
  },
});

const paddingLeftRight = {
  paddingLeft: { xs: 2.5, sm: 5, md: 7.5, lg: 15 },
  paddingRight: { xs: 2.5, sm: 5, md: 7.5, lg: 15 },
};

function NavbarParent() {
  const appbartypo = [
    { key: 1, name: "Home", link: "/home" },
    { key: 2, name: "Tourism", link: "/tourism" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 1,
        backgroundColor: "black",
      }}
    >
      <List>
        <ListItem sx={{ height: 70 }} />
        {appbartypo.map(({ name, link, index }, i) => (
          <React.Fragment key={i}>
            <ListItem>
              <ListItemButton
                to={link}
                component={RouterLink}
                sx={{
                  height: 50,
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="button"
                      color="white"
                      fontWeight="bold"
                    >
                      {name}
                    </Typography>
                  }
                  disableTypography
                />
              </ListItemButton>
            </ListItem>
            {i !== appbartypo.length - 1 && (
              <Divider variant="middle" sx={{ backgroundColor: "white" }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
      }}
    >
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: 1,
          height: 70,
          //   backgroundColor: "violet",
          bgcolor: "transparent",
          background: {
            xs: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))",
            md: "transparent",
          },
          zIndex: 1251,
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            ...paddingLeftRight,
            height: 1,
            // bgcolor: "blue",
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Box>
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 40,
                    }}
                    src={guimtitle}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid
              container
              item
              xs="auto"
              spacing={3}
              alignItems="center"
              justifyContent="center"
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Grid item>
                <Box height={1}>
                  <Box>
                    <Box
                      component="img"
                      sx={{
                        height: { md: 22, lg: 24, xl: 26 },
                      }}
                      src={guimnoTree}
                    />
                  </Box>
                </Box>
              </Grid>
              {appbartypo.map(({ name, link, index }, i) => (
                <Grid item key={i}>
                  <Link
                    to={link}
                    component={RouterLink}
                    variant="overline"
                    underline="none"
                    sx={{
                      color: "white",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "lightgreen",
                      },
                      fontSize: { xs: 8, sm: 10, md: 14, lg: 16 },
                    }}
                  >
                    {name}
                  </Link>
                </Grid>
              ))}
            </Grid>
            <Grid
              container
              item
              //   backgroundColor="green"
              xs
              justifyContent="flex-end"
            >
              <Grid item>
                <IconButton to="/home/login" component={RouterLink}>
                  <Person2OutlinedIcon
                    fontSize={"large"}
                    sx={{
                      color: "white",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "#2759d8",
                      },
                      fontSize: { md: 25, lg: 30, xl: 40 },
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                sx={{
                  display: { sm: "block", md: "none" },
                }}
              >
                <IconButton onClick={handleDrawerToggle}>
                  <MenuOutlinedIcon fontSize="large" sx={{ color: "white" }} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        anchor="top"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            border: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default NavbarParent;
