import React from "react";
import { useRouteError } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";

function ErrorHandle() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={{ xs: 5, sm: 10 }}
      >
        <Grid item>
          <Typography
            sx={{
              typography: { xs: "h4", sm: "h2" },
              fontWeight: "bold",
            }}
          >
            Weird...
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="h5"
            sx={{
              typography: { xs: "subtitle1", sm: "h5" },
              fontStyle: "oblique",
            }}
          >
            An unexpected error has occured.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{error.statusText || error.message}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ErrorHandle;
