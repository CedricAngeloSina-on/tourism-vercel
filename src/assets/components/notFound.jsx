import React from "react";
import { Link as RouterLink } from "react-router-dom";
import NotFoundbig from "../images/notFoundbig.png";
import NotFoundsmall from "../images/notFoundsmall.png";
import { Box, Typography, Grid, Button } from "@mui/material";

function NotFound() {
	return (
		<Box
			sx={{
				width: 1,
				height: 1,
				color: "white",
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "flex-end",
				backgroundImage: {
					xs: `url(${NotFoundsmall})`,
					sm: `url(${NotFoundbig})`,
				},
				backgroundSize: { xs: "cover", sm: "cover" },
				backgroundPosition: { xs: "center" },
				backgroundRepeat: "repeat",
			}}
		>
			<Grid
				container
				direction="column"
				alignItems="center"
				spacing={{ xs: 3, sm: 5 }}
				pb={{ xs: 10, sm: 3 }}
			>
				<Grid item>
					<Typography
						sx={{
							typography: { xs: "h5", sm: "h4", md: "h2" },
							fontWeight: "bold",
						}}
					>
						There's nothing here
					</Typography>
				</Grid>
				<Grid item>
					<Typography
						margin={{ xs: (0, 2), sm: 0 }}
						variant="h5"
						sx={{
							typography: { xs: "body2", sm: "subtitle1", md: "h5" },
							fontStyle: "oblique",
							textAlign: "center",
						}}
					>
						You might have accidentally stumbled into a page that does not
						exist.
					</Typography>
				</Grid>
				<Grid item>
					<Button to="/home" component={RouterLink} variant="outlined">
						Back to Home
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}

export default NotFound;
