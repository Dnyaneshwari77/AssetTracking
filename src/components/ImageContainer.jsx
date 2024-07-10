import React from "react";
import { Box, Container } from "@mui/material";
import img1 from "../assets/image1.jpg";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/image3.jpg";

const ImageContainer = () => {
  const images = [
    { src: img1, size: 100 },
    { src: img2, size: 120 },
    { src: img1, size: 40 },
    { src: img3, size: 150 },
  ];

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 2,
        mt: 4,
     
      }}
    >
      {images.map((image, index) => (
        <Box
          key={index}
          component="img"
          src={image.src}
          sx={{
            width: image.size,
            height: image.size,
            borderRadius: "50%",
            boxShadow: 3,
          }}
        />
      ))}
    </Container>
  );
};

export default ImageContainer;
