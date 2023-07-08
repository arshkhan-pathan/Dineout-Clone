import React from "react";
import Review from "@/components/Review";
import { Divider, Stack, Typography } from "@mui/material";

function ReviewSection({ reviews }) {
  if (reviews?.length > 0) {
    return (
      <Stack direction="column" spacing={1} id="Reviews">
        <Typography
          variant="h5"
          style={{ fontWeight: "bold", margin: "10px 15px" }}
        >
          Reviews
        </Typography>
        <Divider
          sx={{
            paddingBlock: 0.5,
            backgroundColor: "#eeeee4",
            borderColor: "transparent",
            mt: 0,
          }}
        />
        <Stack direction="column" spacing={1}>
          {reviews?.map((review) => {
            return (
              <Review
                key={Math.random()}
                reviewerName={review?.customer_name}
                rating={review?.rating}
                reviewText={review?.comment}
                reviewDate={review?.created_at}
                reviewerAvatar={review?.user_imageurl}
              />
            );
          })}
        </Stack>
      </Stack>
    );
  }
}

export default ReviewSection;
