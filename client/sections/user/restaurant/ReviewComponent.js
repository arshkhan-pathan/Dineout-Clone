import React from "react";
import { Box, Typography, Rating, Button, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateReviewMutation } from "@/store/api/restaurants";

function ReviewComponent({ restaurantId, user }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [createReview] = useCreateReviewMutation();

  const handleReviewSubmit = async () => {
    const data = {
      rating: rating,
      comment: reviewText,
      restaurant: restaurantId,
      user: user,
    };
    try {
      const review = await createReview(data).unwrap();

      toast.success("Review Created Successfully");
    } catch (err) {
      if (err.data.non_field_errors) {
        toast.error("You Have already given a Review");
      } else if (!user) {
        toast.error("Sign In to Create Review");
      } else {
        toast.error("Review Creation Failed");
      }
    }
    setReviewText("");
    setRating(0);
  };

  return (
    <Box sx={{ p: "16px 24px" }} id="WriteReview">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Write a Review
      </Typography>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        size="large"
        sx={{ marginBottom: "10px" }}
      />
      <TextField
        id="review-text"
        label="Your Review"
        variant="outlined"
        fullWidth
        multiline
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ marginBottom: "10px" }}
      />
      <Button
        variant="contained"
        onClick={handleReviewSubmit}
        sx={{ bgcolor: "#3595ff" }}
      >
        <Typography sx={{ color: "white" }}>Submit Review</Typography>
      </Button>
    </Box>
  );
}

export default ReviewComponent;
