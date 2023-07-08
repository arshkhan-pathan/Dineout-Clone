import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Maps from "@/components/Maps";
import { Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export default function BasicModal({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ display: "flex" }}>
      <Typography variant="body2" onClick={handleOpen}>
        See Location
      </Typography>
      <LocationOnIcon
        onClick={handleOpen}
        sx={{ margin: "-4px 0px 0px 5px", cursor: "pointer" }}
      ></LocationOnIcon>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Maps coordinates={data}></Maps>
        </Box>
      </Modal>
    </div>
  );
}
