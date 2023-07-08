// packages
import { useRouter } from "next/router";
import Slider from "react-slick";
import styled from "styled-components";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";
// layout
import Navbar from "@/layouts/restaurant/Navbar";
import { useGetRestaurantQuery } from "@/store/api/restaurants";
import Reservation from "@/sections/user/restaurant/Reservation";
import AboutUs from "@/sections/user/restaurant/AboutUs";
import FoodMenu from "@/sections/user/restaurant/FoodMenu";
import SubMenu from "@/sections/user/restaurant/Submenu";
import Footer from "@/components/Footer";
import ReviewSection from "@/sections/user/restaurant/ReviewSection";
import ReviewComponent from "@/sections/user/restaurant/ReviewComponent";
import { Skeleton } from "@mui/material";
import Head from "next/head";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "next/image";
import Modal from "@/components/Maps/Modal";

const Main = styled.div`
  /* width: 79vw; */
  display: flex;
  justify-content: space-between;
  gap: 1.143vw;
  margin: 18px 0px 24px;
`;

const Left = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;

  > div {
    background-color: #ffffff;
    border-radius: 4px;
  }
`;

const RestaurantInfo = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const user = useSelector(selectCurrentUser);

  let { data, isLoading, isError } = useGetRestaurantQuery(restaurantId, {
    refetchOnMountOrArgChange: true,
  });

  const breadcrumbs = [
    <Typography sx={{ fontSize: 14 }} key="1" color="text.disabled">
      Restaurants
    </Typography>,
    <Typography sx={{ fontSize: 14 }} key="2" color="text.primary">
      {data?.name}
    </Typography>,
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <>
      <Head>
        <title>{data?.name} || Dineout (Find Best Restaurants)</title>
      </Head>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ marginTop: "35px", marginBottom: "8px" }}
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Grid container spacing={2} id="Overview">
          <Grid item xs={12} md={8}>
            <Box>
              <Card elevation={0}>
                <CardContent sx={{ padding: 0 }}>
                  {isLoading || isError ? (
                    <Skeleton variant="rectangular" width={800} height={400} />
                  ) : (
                    <PhotoProvider>
                      <Slider
                        {...settings}
                        style={{
                          height: 400,
                          borderRadius: 0,
                          overflow: "hidden",
                          marginBottom: "10px",
                        }}
                      >
                        {data?.images.map((image, id) => (
                          <div key={id}>
                            <PhotoView key={image.image} src={image.image}>
                              <Image
                                src={image.image}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                alt={`Image ${id + 1}`}
                              />
                            </PhotoView>
                          </div>
                        ))}
                      </Slider>
                    </PhotoProvider>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingInline: "15px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        component="h4"
                        sx={{ fontWeight: "bold" }}
                      >
                        {data?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#696969", display: "flex" }}
                      >
                        {data?.address} | {data?.locality} | {data?.city} |{" "}
                        {<Modal data={data?.coordinates} isOpen={true}></Modal>}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#696969" }}>
                        Time :
                        <Typography
                          variant="text"
                          sx={{
                            textTransform: "capitalize",
                            color: "green",
                            marginLeft: "10px",
                          }}
                        >
                          Opens at {data?.opening_time}
                        </Typography>
                        <Typography
                          variant="text"
                          sx={{
                            textTransform: "capitalize",
                            color: "red",
                            marginLeft: "10px",
                          }}
                        >
                          Closes at {data?.closing_time}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#696969", fontWeight: "600" }}
                      >
                        Approx <>₹ {data?.avg_cost}</> for Two People | Booking
                        Charge :<> ₹{data?.unit_charge}/ Person</> (Pricing May
                        affect on Trending Days)
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#696969" }}>
                        {data?.cuisines.map((cuisine) => {
                          return ` ${cuisine.name},`;
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={data?.ratings.toFixed(1)}
                      color="success"
                      sx={{
                        borderRadius: 1,
                        height: 45,
                        width: 55,
                        fontSize: 16,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Reservation user={user} />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} md={8}>
            <Main>
              <Left>
                <SubMenu />
                <FoodMenu menu={data?.menuImages} isLoading={isLoading} />
                <AboutUs
                  cuisines={data?.cuisines}
                  types={data?.types}
                  charge={data?.unit_charge}
                  average={data?.avg_cost}
                  tags={data?.tags}
                />
                <ReviewComponent
                  restaurantId={restaurantId}
                  user={user?.id}
                ></ReviewComponent>
                <ReviewSection reviews={data?.reviews}></ReviewSection>
                <></>
              </Left>
            </Main>
          </Grid>
        </Grid>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default RestaurantInfo;
