import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, IconButton } from "@mui/material";
import { toast } from "react-hot-toast";
import AlertDialog from "@/components/Dialog";
import useToggle from "@/hooks/useToggle";

export const removeFeatured = (params, deleteFeaturedRestaurant) => {
  const { isOpen, onOpen, onClose } = useToggle();

  const onRemoveFeatured = () => {
    deleteFeaturedRestaurant(params.row.id);
    toast.success("Removed Restaurant Successfully");
  };

  return (
    <>
      <Tooltip title="Delete">
        <IconButton onClick={onOpen}>
          <CloseIcon sx={{ color: "red " }} />
        </IconButton>
      </Tooltip>
      <AlertDialog
        open={isOpen}
        handleClose={onClose}
        dialogTitle={"Remove Restaurant from Featured?"}
        dialogText={
          "Are you sure you want to remove this Restaurant from Featured Lists?"
        }
        prompt={false}
        handleAgree={onRemoveFeatured}
      ></AlertDialog>
    </>
  );
};
