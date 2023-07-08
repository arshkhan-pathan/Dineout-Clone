import useToggle from "@/hooks/useToggle";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, IconButton } from "@mui/material";
import { toast } from "react-hot-toast";
import AlertDialog from "@/components/Dialog";
export const removeFeatured = (params, deleteFeaturedRestaurant) => {
  const { isOpen, onOpen, onClose } = useToggle();
  const onRemoveFeatured = (rejectionReason) => {
    deleteFeaturedRestaurant({ id: params.row.id, message: rejectionReason });
    console.log(rejectionReason);
    toast.success("Removed Restaurant Successfully");
    onClose();
  };

  return (
    <>
      {" "}
      <Tooltip title="Delete">
        <IconButton onClick={onOpen}>
          <CloseIcon sx={{ color: "red " }} />
        </IconButton>
      </Tooltip>
      <AlertDialog
        open={isOpen}
        handleClose={onClose}
        dialogTitle={"Reject Restaurant"}
        dialogText={"Are you sure you want to reject this Restaurant?"}
        prompt={true}
        handleAgree={onRemoveFeatured}
      ></AlertDialog>
    </>
  );
};
