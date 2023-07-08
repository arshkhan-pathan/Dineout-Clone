import Axios from "axios";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";
import useToggle from "@/hooks/useToggle";
import Modal from "@/components/Modal";
import Auth from "@/layouts/user/navbar/Auth";
import InvoiceDetails from "./InvoiceDetails";
import { toast } from "react-hot-toast";
export default function Payment({
  restaurantId,
  start_time,
  end_time,
  date,
  guests,
  table,
  resetReservation,
}) {
  const { isOpen, onOpen, onClose } = useToggle();
  const [modalContent, setModalContent] = useState("AUTH");
  const [booking, setBooking] = useState();
  const user = useSelector(selectCurrentUser);
  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/restaurant/payment/success/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          //
          //
          setBooking(res.data.booking);
          setModalContent("");
          toast.success("🎉 Your Booking Is Confimed");
          onOpen();
        })
        .catch((err) => {
          //
          toast.error("❌ Something Went Wrong");
        });
    } catch (error) {}
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await loadScript();

    try {
      const data = await Axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/restaurant/pay/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          date: date,
          start_time: start_time,
          end_time: end_time,
          guests: guests,
          additional_details: "",
          amount: 100,
          isPaid: false,
          customer: user?.id,
          restaurant: restaurantId,
          table: table,
        },
      });

      if (data.status === 201) {
        var options = {
          key_id: process.env.NEXT_PUBLIC_REACT_RAZORPAY_KEY,
          key_secret: process.env.NEXT_PUBLIC_REACT_RAZORPAY_SECRET,
          amount: data.data.payment.amount,
          currency: "INR",
          name: "DineOut",
          description: "Transaction to Confirm Booking!",
          image:
            "https://im1.dineout.co.in/images/uploads/misc/2019/Jul/25/website-logo.png",
          order_id: data.data.payment.id,
          handler: function (response) {
            handlePaymentSuccess(response);
          },
          prefill: {
            name: "User's name",
            email: "User's email",
            contact: "User's phone",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#913bad",
          },
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("No tables Available for thissss slot");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("No tables Avialiable");
        console.error("No tables Available for thisd slot");
      } else {
        console.error("Error:", error);
      }
    }
  };

  const onCloseModal = () => {
    onClose();
    if (modalContent !== "AUTH") {
      resetReservation();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        size="large"
        color="primary"
        onClick={user ? showRazorpay : onOpen}
        sx={{
          color: "white",
          textTransform: "capitalize",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Continue
      </Button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
          {modalContent == "AUTH" ? (
            <Auth onClose={onClose} />
          ) : (
            <>
              <InvoiceDetails bookingId={booking}></InvoiceDetails>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
