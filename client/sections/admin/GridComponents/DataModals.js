import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Box, Typography, Button } from "@mui/material";
import Modal from "@/components/Modal";
import Image from "next/image";

function DataModals({
  isModalOpen,
  setIsModalOpen,
  selectedRestaurantId,
  data,
}) {
  const selectedRestaurant = data?.find(
    (item) => item.id === selectedRestaurantId
  );

  const details = [
    {
      label: "Manager",
      value: selectedRestaurant?.manager_name || "Not Provided",
    },

    { label: "Unit Charge", value: selectedRestaurant?.unit_charge + " Rs" },
    { label: "Description", value: selectedRestaurant?.description },
    { label: "Average Cost", value: selectedRestaurant?.avg_cost },
    { label: "Opening Time", value: selectedRestaurant?.opening_time },
    { label: "Closing Time", value: selectedRestaurant?.closing_time },
    {
      label: "Per Person Charge",
      value: selectedRestaurant?.unit_charge + " Rs",
    },
    {
      label: "Tags",
      value: selectedRestaurant?.tags.map((tag) => tag.name).join(", "),
    },
    {
      label: "Cuisines",
      value: selectedRestaurant?.cuisines
        .map((cuisine) => cuisine.name)
        .join(", "),
    },
    {
      label: "Types",
      value: selectedRestaurant?.types.map((type) => type.name).join(", "),
    },
  ];

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {selectedRestaurant && (
        <Box mb={2}>
          <Typography variant="h5" component="h5" mb={2}>
            <i>{selectedRestaurant.name}</i>
          </Typography>

          {details.map(({ label, value }) => (
            <Typography variant="body1" component="h3" key={label}>
              <b>{label}:</b> {value}
            </Typography>
          ))}
          <Typography variant="body1" component="h3">
            <b>Images</b>
          </Typography>
          <Box display="flex" justifyContent="flex-start" flexWrap="wrap">
            <PhotoProvider>
              {selectedRestaurant.images.map((image) => (
                <PhotoView src={image.image}>
                  <Image
                    height={0}
                    width={0}
                    sizes="100vw"
                    key={image.id}
                    src={image.image}
                    alt={`Restaurant ${selectedRestaurantId} Image`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      marginRight: 8,
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                  />
                </PhotoView>
              ))}
            </PhotoProvider>
          </Box>
          <Typography variant="body1" component="h3">
            <b>Menu Images</b>
          </Typography>
          <Box display="flex" justifyContent="flex-start" flexWrap="wrap">
            <PhotoProvider>
              {selectedRestaurant.menuImages.map((image) => (
                <PhotoView src={image.image}>
                  <Image
                    height={0}
                    width={0}
                    sizes="100vw"
                    key={image.id}
                    src={image.image}
                    alt={`Restaurant ${selectedRestaurantId} Image`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      marginRight: 8,
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                  />
                </PhotoView>
              ))}
            </PhotoProvider>
          </Box>
        </Box>
      )}
      <Button onClick={() => setIsModalOpen(false)}>Close</Button>
    </Modal>
  );
}

export default DataModals;
