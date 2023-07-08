import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";

export const DeleteButton = (params, deleteAPI, type) => {
  const onDeleteTypes = () => {
    deleteAPI(params.row.id);
    toast.success(`${type} Deleted Succesully`);
  };

  return (
    <Tooltip title="Delete">
      <IconButton onClick={onDeleteTypes}>
        <DeleteIcon sx={{ color: "red" }} />
      </IconButton>
    </Tooltip>
  );
};
