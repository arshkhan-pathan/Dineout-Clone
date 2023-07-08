import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";

const buttonsData = [
  {
    label: "Bar",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686552553/icons/1553738_ffqead.png",
  },
  {
    label: "Parking",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686551836/icons/parking_ns6bha.jpg",
  },
  {
    label: "Home Delivery",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686551836/icons/delivery_qpm6md.png",
  },
  {
    label: "Live Performance",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686551836/icons/performance_tmlg0j.png",
  },
  {
    label: "Cards Accepted",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686551836/icons/cards_pochqv.png",
  },
  {
    label: "Air Condition",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686551836/icons/air_jaswkf.png",
  },
  {
    label: "Outdoor",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686552030/icons/outdoor_eopfwg.png",
  },
  {
    label: "Valet Parking",
    imageSrc:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1686552028/icons/valet_rline2.png",
  },
];

function FillerButtons() {
  const router = useRouter();

  return (
    <div style={{ marginTop: "50px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {buttonsData.map((button, index) => (
            <Grid item xs={3} key={index}>
              <Button
                onClick={() =>
                  router.push(
                    `restaurants/search?q=${encodeURIComponent(button.label)}`
                  )
                }
                variant="contained"
                sx={{
                  width: 250,
                  height: 60,
                  backgroundColor: "whitesmoke",
                }}
                color="primary"
                startIcon={<Avatar variant="square" src={button.imageSrc} />}
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default FillerButtons;
