import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Navbar from "@/layouts/restaurant/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function Error() {
  const router = useRouter();

  return (
    <>
      <Head>
        {router.asPath == "/forbidden" ? "Forbidden" : "404 Page Not Found"}
      </Head>
      <Navbar></Navbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography variant="h2">Invalid Page</Typography>
              {router.asPath == "/forbidden" ? (
                <Typography variant="h6">
                  Sorry Your Role doesn’t allow you to use this Page
                </Typography>
              ) : (
                <Typography variant="h6">
                  The page you’re looking for doesn’t exist.
                </Typography>
              )}
            </Grid>
            <Grid xs={6}>
              <Image
                src="https://res.cloudinary.com/dhe9hmzbn/image/upload/v1687778649/thrillist-404_i6x186.gif"
                alt=""
                width={500}
                height={250}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer></Footer>
    </>
  );
}
