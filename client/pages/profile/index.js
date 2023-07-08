import UserLayout from "@/layouts/user";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
} from "@mui/material";
import { selectCurrentUser } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "@/store/api/restaurants";
import Box from "@mui/material/Box";
import withAuth from "@/utils/withAuth";
import CardActions from "@mui/material/CardActions";
import useToggle from "@/hooks/useToggle";
import Modal from "@/components/Modal";
import { useState } from "react";
import EditProfile from "@/sections/user/profile/EditProfile";
import ChangePassword from "@/sections/user/profile/ChangePassword";
import { useDeleteBookingsMutation } from "@/store/api/profile";
import RenderCancel from "@/sections/user/profile/Grid/RenderCancel";
import BookingsGrid from "@/sections/user/profile/Grid/BookingsGrid";
import { commonColumns } from "@/sections/user/profile/Grid/BookingsGrid";
import Loading from "@/components/Loading";

function Index() {
  const [deleteBookings] = useDeleteBookingsMutation();
  const { isOpen, onOpen, onClose } = useToggle();
  const { isOpen: isOpenD, onOpen: onOpenD, onClose: onCloseD } = useToggle();

  const upcomingColumns = [
    ...commonColumns,
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "order_payment_id",
      headerName: "Payment Id",
      width: 200,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) =>
        RenderCancel(params, deleteBookings, 3, isOpenD, onOpenD, onCloseD),
    },
  ];

  const pastColumns = [
    ...commonColumns,
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "order_payment_id",
      headerName: "Payment Id",
      width: 300,
      editable: false,
    },
  ];

  const user = useSelector(selectCurrentUser);
  const [modalContent, setModalContent] = useState();
  const { data, isLoading } = useGetUserProfileQuery(user?.id, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  return (
    <UserLayout title="Profile Page">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ mt: 4 }}>
            <Card style={{ maxWidth: 400, margin: "auto", borderRadius: 10 }}>
              <CardContent>
                <Avatar
                  style={{
                    width: 80,
                    height: 80,
                    margin: "auto",
                    marginBottom: 16,
                  }}
                  alt="Profile"
                  src={data?.user?.image_url}
                />
                <Typography variant="h6" component="h2" align="center">
                  {data?.user?.first_name} {data?.user?.last_name}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  align="center"
                  gutterBottom
                >
                  Total Restaurants Dined In: {data?.total_bookings}
                </Typography>
                {/* Additional fields or information can be added here */}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    setModalContent("Edit");
                    onOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setModalContent("Change");
                    onOpen();
                  }}
                >
                  Change Password
                </Button>
              </CardActions>
            </Card>
            <Grid>{/* Add more components or content here */}</Grid>
          </Box>

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 5 }}
          >
            <Grid item xs={12}>
              {data?.upcoming_bookings.length > 0 ? (
                <h3>Upcoming Bookings</h3>
              ) : (
                <h3>No Upcoming Bookings to show</h3>
              )}
              {data?.upcoming_bookings.length > 0 && (
                <Box sx={{ height: "100%", width: "100%" }}>
                  <BookingsGrid
                    rows={data?.upcoming_bookings || []}
                    columns={upcomingColumns}
                  ></BookingsGrid>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              {data?.past_bookings?.length > 0 ? (
                <>
                  <h3>Past Bookings</h3>
                  <Box sx={{ height: "100%", width: "100%" }}>
                    <BookingsGrid
                      rows={data?.past_bookings || []}
                      columns={pastColumns}
                    ></BookingsGrid>
                  </Box>
                </>
              ) : (
                <>
                  <h3>No Past Bookings to show</h3>
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              {data?.cancelled_bookings?.length > 0 ? (
                <>
                  <h3>Cancelled Bookings</h3>
                  <Box sx={{ height: "100%", width: "100%" }}>
                    <BookingsGrid
                      rows={data?.cancelled_bookings || []}
                      columns={pastColumns}
                    ></BookingsGrid>
                  </Box>
                </>
              ) : (
                <>
                  <h3>No Cancelled Bookings to show</h3>
                </>
              )}
            </Grid>
          </Grid>
          {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose}>
              {modalContent == "Edit" ? <EditProfile /> : <ChangePassword />}
            </Modal>
          )}
        </>
      )}
    </UserLayout>
  );
}

export default withAuth(Index, ["3"], "/");
