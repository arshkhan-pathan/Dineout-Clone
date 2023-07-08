import React from "react";

import {
  Card,
  CardHeader,
  Avatar,
  Typography,
  CardContent,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const Review = ({
  reviewerName,
  reviewerAvatar,
  rating,
  reviewText,
  reviewDate,
}) => {
  return (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar src={reviewerAvatar} />}
          title={reviewerName}
          subheader={reviewDate} // Replace 'reviewDate' with the actual variable containing the date
          sx={{ paddingTop: 4 }}
        />
        <CardContent sx={{ paddingTop: 0, paddingLeft: 4 }}>
          <Typography variant="body1" gutterBottom>
            {reviewText}
          </Typography>
          <Rating name="rating" value={rating} readOnly />
        </CardContent>
      </Card>
    </>
  );
};

export default Review;
