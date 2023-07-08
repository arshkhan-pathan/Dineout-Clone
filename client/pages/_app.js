// packages
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "react-photo-view/dist/react-photo-view.css";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { wrapper, store } from "../app/store";
// store
import store, { persistor } from "@/store";
// css
import "@/assets/css/global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff645a",
    },
  },
});

function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <GlobalStyles
              styles={{
                "*::-webkit-scrollbar": {
                  width: "6px",
                  height: "6px",
                },
                "*::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                },
                "*::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "*::-webkit-scrollbar-thumb:active": {
                  backgroundColor: "#333",
                },
                "#__next": {
                  backgroundColor: "#eeeee4",
                },
              }}
            />
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Component {...pageProps} />
              <Toaster position="top-center" reverseOrder={false} />
            </LocalizationProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
