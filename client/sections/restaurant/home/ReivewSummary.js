import React from "react";
import Review from "@/components/Review";
import { Pagination, Box, Button, Grid } from "@mui/material";

const ReviewSummmary = ({
  reviews,
  currentPage,
  totalPages,
  onPageChange,
  count,
  selectedFilters,
  onFilterChange,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container>
        <Grid item xs={2}>
          <Button
            variant={selectedFilters === "-date" ? "contained" : "outlined"}
            onClick={() => onFilterChange("-date")}
          >
            Newest
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={selectedFilters === "date" ? "contained" : "outlined"}
            onClick={() => onFilterChange("date")}
          >
            Oldest
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={selectedFilters === "-ratings" ? "contained" : "outlined"}
            onClick={() => onFilterChange("-ratings")}
          >
            Highest
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant={selectedFilters === "ratings" ? "contained" : "outlined"}
            onClick={() => onFilterChange("ratings")}
          >
            Lowest
          </Button>
        </Grid>
      </Grid>
      {reviews?.map((review) => (
        <Review
          key={review.id}
          reviewerName={review.customer_name}
          reviewerAvatar={review.user_imageurl}
          rating={review.rating}
          reviewText={review.comment}
          reviewDate={review.created_at}
        />
      ))}
      <Pagination
        count={Math.ceil(count / 5)}
        page={currentPage}
        onChange={onPageChange}
      />
    </Box>
  );
};

export default ReviewSummmary;
