import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "../assets/components/image"; // Assuming you've imported your CustomImageBox component

import image0 from "../assets/images/Tropical Image 1.jpg";
import image1 from "../assets/images/Tropical Image 2.jpg";
import image2 from "../assets/images/Tropical Image 3.jpg";
import image3 from "../assets/images/Tropical Image 4.jpg";
import image4 from "../assets/images/Tropical Image 5.jpg";

const images = [
    {
        index: 0,
        image: image0,
    },
    {
        index: 1,
        image: image1,
    },
    {
        index: 2,
        image: image2,
    },
    {
        index: 3,
        image: image3,
    },
    {
        index: 4,
        image: image4,
    },
];

const ImageSlider = () => {
    useEffect(() => {
        // Clone the .image-slider element and append it to .logos
        const copy = document.querySelector(".image-slider").cloneNode(true);
        document.querySelector(".images").appendChild(copy);
    }, []);

    const imagesStyle = {
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        bgcolor: "red",
        ":before": {
            position: "absolute",
            top: 0,
            width: "250px",
            height: "100%",
            content: '""',
            zIndex: 2,
        },
        ":after": {
            position: "absolute",
            top: 0,
            width: "250px",
            height: "100%",
            content: '""',
            zIndex: 2,
        },
        // ":hover": {
        //   "& .image-slider": {
        //     animationPlayState: "paused",
        //   },
        // },
    };

    return (
        <Box sx={imagesStyle} className="images">
            <Box
                className="image-slider"
                sx={{
                    display: "inline-block",
                    animation: "35s slide infinite linear",
                    bgcolor: "blue",
                }}
            >
                {images.map(({ image, index }) => (
                    <Image
                        key={index}
                        src={image}
                        alt={image}
                        width="300px"
                        height="500px"
                        objectFit="cover"
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ImageSlider;
