import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Tooltip, IconButton } from "@mui/material";
import { toast } from "react-hot-toast";

export const approveTable = (params, approvedFunction) => {
  const rowData = params.row;

  const onApproveTable = () => {
    toast.success("Added Restaurant Successfully");
    approvedFunction(rowData.id);
  };

  if (rowData.is_featured) {
    return (
      <Tooltip title="Already Added" disableHoverListener>
        <IconButton
          onClick={() =>
            toast("Restaurant Is Already Added in Feautured List!")
          }
        >
          <CheckBoxIcon sx={{ color: "grey" }} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Approve">
      <IconButton onClick={onApproveTable}>
        <CheckBoxIcon sx={{ color: "green" }} />
      </IconButton>
    </Tooltip>
  );
};
