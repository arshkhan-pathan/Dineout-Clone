import baseApi from "@/store/api/base";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Tooltip, IconButton } from "@mui/material";

export const viewPerformance = (params, dispatch, setPerformanceData) => {
  const rowData = params.row;

  const onViewPerformance = async () => {
    const { status, data, error, refetch } = await dispatch(
      baseApi.endpoints.restaurantDataStats.initiate(rowData.id, {
        forceRefetch: true,
      })
    );

    setPerformanceData(data);
  };

  return (
    <Tooltip title="View Performance">
      <IconButton onClick={onViewPerformance}>
        <RemoveRedEyeIcon />
      </IconButton>
    </Tooltip>
  );
};
