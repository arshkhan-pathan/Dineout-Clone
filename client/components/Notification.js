import { useState, useEffect } from "react";
// @mui
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";
import {
  useGetUserNotificationQuery,
  useMarkNotificationsAsReadMutation,
} from "@/store/api/profile";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import PendingIcon from "@mui/icons-material/Pending";

export default function NotificationsPopover() {
  const user = useSelector(selectCurrentUser);
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();
  const { data } = useGetUserNotificationQuery(user?.id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [notifications, setNotifications] = useState(data || []);

  const totalUnRead = notifications.filter(
    (item) => item.is_read === false
  ).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
    markNotificationsAsRead(user?.id);
  };
  useEffect(() => {
    setNotifications(data || []);
  }, [data]);

  return (
    <>
      <IconButton
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <List
          disablePadding
          subheader={
            <ListSubheader
              disableSticky
              sx={{ py: 1, px: 2.5, typography: "overline" }}
            >
              UnRead
            </ListSubheader>
          }
        >
          {notifications
            .filter((notification) => notification.is_read == false)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
        </List>

        <List
          disablePadding
          subheader={
            <ListSubheader
              disableSticky
              sx={{ py: 1, px: 2.5, typography: "overline" }}
            >
              Before that
            </ListSubheader>
          }
        >
          {notifications
            .filter((notification) => notification.is_read == true)
            .slice(0, 3)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
        </List>

        <Divider sx={{ borderStyle: "dashed" }} />
      </Popover>
    </>
  );
}

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);
  const createdDate = new Date(notification.created).toLocaleString();
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.isUnRead && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <NotificationsIcon sx={{ mr: 0.5, width: 16, height: 16 }} />
            {createdDate}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.subject}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {notification.body}
      </Typography>
    </Typography>
  );

  if (notification.type === "1") {
    return {
      avatar: <DoneOutlineIcon />,
      title,
    };
  }
  if (notification.type === "2") {
    return {
      avatar: <NotInterestedIcon />,
      title,
    };
  }
  if (notification.type === "3") {
    return {
      avatar: <PendingIcon />,
      title,
    };
  }

  return {
    avatar: notification.avatar ? <NotificationsIcon /> : null,
    title,
  };
}
