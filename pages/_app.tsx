// import App from 'next/app'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import { createTheme, Theme, ThemeProvider } from "@mui/material";
import Head from "next/head";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loading } from "../components/Loading";
import NavBar from "../components/NavBar";
import { persistor, store, wrapper } from "../store/store";

const theme: Theme = createTheme(createTheme(), {
  palette: {
    primary: {
      main: "#388e3c",
    },
    secondary: {
      main: "#ffb300",
    },
    warning: {
      main: "#f4511e",
    },
    success: {
      main: "#00e676",
    },
  },
  typography: {
    fontFamily: "Lato, Roboto",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <title>CPP Scheduler</title>
          </Head>
          <NavBar />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default wrapper.withRedux(MyApp);
