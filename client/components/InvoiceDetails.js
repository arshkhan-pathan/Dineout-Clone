import React from "react";
import { Typography, Paper } from "@mui/material";
import { useGetBookingInvoiceQuery } from "@/store/api/restaurants";
import Loading from "./Loading";

const InvoiceDetails = ({ bookingId }) => {
  const { data: invoice, isLoading } = useGetBookingInvoiceQuery(bookingId);
  //

  const renderInvoiceDetails = () => {
    if (!invoice) {
      return null;
    }
    if (isLoading) {
      return <Loading />;
    }

    const {
      id,
      customer_name,
      amount,
      created_at,
      restaurant,
      booking_details,
    } = invoice;

    const invoiceDetails = [
      { label: "Customer", value: customer_name },
      { label: "Amount", value: `₹ ${amount}` },
      { label: "Created At", value: created_at },
      { label: "Restaurant", value: restaurant?.name },
      { label: "Booking ID", value: booking_details?.booking_id },
      { label: "Date", value: booking_details?.date },
      { label: "Start Time", value: booking_details?.start_time },
      { label: "Table No", value: booking_details?.table },
      { label: "End Time", value: booking_details?.end_time },
      { label: "Guests", value: booking_details?.guests },
      {
        label: "Additional Details",
        value: booking_details?.additional_details,
      },
    ];

    return (
      <>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Invoice #{id}
          </Typography>
          {invoiceDetails.map(({ label, value }) => (
            <Typography variant="subtitle1" sx={{ mb: 1 }} key={label}>
              <b>{label}:</b> {value}
            </Typography>
          ))}
        </Paper>
      </>
    );
  };

  return renderInvoiceDetails();
};

export default InvoiceDetails;
