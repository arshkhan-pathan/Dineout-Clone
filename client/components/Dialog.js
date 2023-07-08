import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import { useState } from "react";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialog({
  open,
  handleClose,
  dialogTitle,
  dialogText,
  handleAgree,
  prompt,
}) {
  const [rejectionReason, setRejectionReason] = React.useState("");
  const onAgree = () => {
    handleAgree(rejectionReason); // Pass the rejection reason to the handleAgree function
    handleClose();
    // setRejectionReason("");
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {dialogText}
        </DialogContentText>
        {prompt && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={onAgree}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
