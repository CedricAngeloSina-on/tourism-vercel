import React from "react";
import Box from "@mui/material/Box";

const Image = ({ src, alt, width, height, objectFit }) => {
    const boxStyle = {
        width: width,
        height: height,
        objectFit: objectFit,
        borderRadius: "15px",
        marginRight: "50px",
    };
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            sx={boxStyle}
            className="image"
        />
    );
};

export default Image;
