//
import { Box } from "@mui/material";
import MiniDrawer from "./Drawer";
import { styled } from "@mui/material/styles";

import PrimarySearchAppBar from "./Appbar";
import Head from "next/head";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));
const AdminLayout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div style={{ backgroundColor: "white" }}>
        <PrimarySearchAppBar />
        <Box sx={{ display: "flex" }}>
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
            <DrawerHeader />
            {children}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default AdminLayout;
