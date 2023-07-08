// packages
import Slider from "react-slick";
import { Box, Container, Typography, Grid } from "@mui/material";
// layouts
import UserLayout from "@/layouts/user";
// store
import {
  useGetAllRestaurantQuery,
  useGetFeaturedRestaurantQuery,
} from "@/store/api/restaurants";
// components
import Card from "@/components/Card";
import FillerButtons from "@/components/FillerButtons";
import { selectCurrentLocation } from "@/store/slices/restaurantSlice";
import { useSelector } from "react-redux";
import { settings } from "@/sections/user/restaurants/SliderSettings";
import Skeleton from "@mui/material/Skeleton";

const Home = () => {
  const selectedLocation = useSelector(selectCurrentLocation);
  //
  const selectedFilters = {
    cuisines: "",
    tags: "",
    types: "",
    location: selectedLocation.name,
  };
  //

  const {
    data: allRestaurans,
    isLoading,
    isError,
  } = useGetAllRestaurantQuery(
    { selectedFilters, page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: featuredRestaurant,
    isLoading: featuredLoading,
    isError: featuredError,
  } = useGetFeaturedRestaurantQuery(
    { selectedFilters },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <UserLayout>
      <Box sx={{ mt: 4 }}>
        <Container maxWidth="lg">
          <Grid
            container
            xs={12}
            sx={{
              height: "fit-content",
              "& .slick-track": {
                display: "flex",
                marginLeft: "0px",
                "& .slick-slide": {
                  marginRight: "15px",
                },

                "& .slick-slide:last-child": {
                  marginRight: "auto",
                },
              },
            }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginBottom: "20px" }}
              >
                Restaurants Near You
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {isLoading || isError ? (
                <Slider {...settings}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      animation="wave"
                      variant="rectangular"
                      width={50}
                      height={140}
                    />
                  ))}
                </Slider>
              ) : (
                <Slider {...settings}>
                  {allRestaurans?.results?.map((restaurant) => (
                    <Card key={restaurant.id} {...restaurant} />
                  ))}
                </Slider>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid
            container
            xs={12}
            sx={{
              height: "fit-content",
              "& .slick-track": {
                display: "flex",
                marginLeft: "0px",
                "& .slick-slide": {
                  marginRight: "15px",
                },

                "& .slick-slide:last-child": {
                  marginRight: "auto",
                },
              },
            }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginBottom: "20px" }}
              >
                Featured Restaurants
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {featuredLoading || featuredError ? (
                <>
                  <Slider {...settings}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        animation="wave"
                        variant="rectangular"
                        width={50}
                        height={140}
                      />
                    ))}
                  </Slider>
                </>
              ) : (
                <Slider {...settings}>
                  {featuredRestaurant?.map((restaurant) => (
                    <Card key={restaurant.id} {...restaurant} />
                  ))}
                </Slider>
              )}
            </Grid>
          </Grid>
          <FillerButtons />
        </Container>
      </Box>
    </UserLayout>
  );
};

export default Home;
