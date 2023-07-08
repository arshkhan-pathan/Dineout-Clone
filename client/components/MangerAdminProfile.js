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
import CardActions from "@mui/material/CardActions";
import useToggle from "@/hooks/useToggle";
import Modal from "@/components/Modal";
import { useState } from "react";
import EditProfile from "@/sections/user/profile/EditProfile";
import ChangePassword from "@/sections/user/profile/ChangePassword";

function MangerAdminProfile() {
  const { isOpen, onOpen, onClose, onToggle } = useToggle();
  // Onopen will create modal
  const user = useSelector(selectCurrentUser);
  const [modalContent, setModalContent] = useState();
  //
  const { data } = useGetUserProfileQuery(user?.id, {
    refetchOnMountOrArgChange: true,
  });
  //

  return (
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
              {user?.first_name}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="center"
              gutterBottom
            >
              {data?.user.first_name} {data?.user.last_name}
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
        <Grid></Grid>
      </Box>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          {modalContent == "Edit" ? <EditProfile /> : <ChangePassword />}
        </Modal>
      )}
    </>
  );
}

export default MangerAdminProfile;
