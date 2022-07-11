// import App from 'next/app'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import "@fontsource/lato";
import "@fontsource/roboto";

import { createTheme, Theme, ThemeProvider } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";
import { Provider } from "react-redux";
import NavBar from "../components/NavBar";
import { store, wrapper } from "../store/store";
import ReactGA from "react-ga4";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

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

function MyApp({ Component, pageProps }: AppProps) {
  let router = useRouter();
  useEffect(() => {
    ReactGA.initialize("G-BFNLVWP9W2");
    // ReactGA.send(window.location.pathname);
  });
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>CPP Scheduler</title>
          <meta
            name='description'
            key='description'
            content='Course planning and information for Calpoly students. CPP Scheduler provides a Schedule Builder, Professor Grades, Course Grades, Course Search, and various other resources.'
          />
          <link
            rel='canonical'
            href={("https://www.cppscheduler.com" + (router.asPath === "/" ? "" : router.asPath)).split("?")[0]}
          />
        </Head>
        <NavBar />
        {/* <PersistGate loading={<Loading />} persistor={persistor}> */}
        <Component {...pageProps} />
        {/* </PersistGate> */}
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
