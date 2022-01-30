import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "@fontsource/lato";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme, Stack, Theme } from "@mui/material";
import Home from "./routes/Home";
import NavBar from "./components/NavBar";

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

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<Navigate to={"/"} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
