// packages
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
// layouts
import Navbar from "@/layouts/restaurant/Navbar";
// components
import Card from "@/components/Card";
import { useGetAllRestaurantQuery } from "@/store/api/restaurants";
import Footer from "@/components/Footer";
import { Pagination } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { Skeleton } from "@mui/material";

const Restaurants = () => {
  const selectedFilters = {
    cuisines: "",
    tags: "",
    types: "",
    location: "",
  };
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError } = useGetAllRestaurantQuery(
    { selectedFilters, page: pageNumber },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const onPageChange = (event, value) => {
    setPageNumber(value);
  };

  return (
    <>
      <Head>
        <title>All Restaurants</title>
      </Head>
      <Navbar />
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Grid
          container
          item
          xs={12}
          spacing={2}
          sx={{ height: "fit-content", mt: 1 }}
        >
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              Best Restaurants in Surat
            </Typography>
          </Grid>
          {isLoading || isError
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  animation="wave"
                  variant="rectangular"
                  width={50}
                  height={140}
                />
              ))
            : data?.results?.map((restaurant) => (
                <Grid item xs={12} sm={3} md={3} key={restaurant.id}>
                  <Card {...restaurant} showExtra={true} />
                </Grid>
              ))}
          <Grid
            container
            item
            xs={12}
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Grid item xs={12} alignItems="center">
              <div>
                <Pagination
                  count={Math.ceil(data?.count / 12)}
                  onChange={onPageChange}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Restaurants;
