import { toast } from "react-hot-toast";
import { Button } from "@mui/material";
import AlertDialog from "@/components/Dialog";

function RenderCancel(
  params,
  deleteBookings,
  role,
  isOpenD,
  onOpenD,
  onCloseD
) {
  const bookingId = params.row.id;

  const handleCancelBooking = () => {
    const data = { id: bookingId, role };

    deleteBookings(data)
      .unwrap()
      .then((res) => {
        toast.success("Cancelled");
      })
      .catch((err) => {
        toast.error(err.data.error);
      });
    onCloseD();
  };
  return (
    <>
      <Button variant="outlined" size="small" onClick={onOpenD}>
        Cancel
      </Button>
      <AlertDialog
        open={isOpenD}
        handleClose={onCloseD}
        dialogTitle={"Booking Cancellation"}
        dialogText={"Are you sure you want to cancel this Booking?"}
        handleAgree={handleCancelBooking}
      ></AlertDialog>
    </>
  );
}

export default RenderCancel;
