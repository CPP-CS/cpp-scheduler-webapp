import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme, Theme } from "@mui/material";
import Home from "./routes/Home";
import NavBar from "./components/NavBar";

import "@fontsource/lato";
import "@fontsource/roboto";
import Credits from "./routes/Credits";
import ScheduleBuilder from "./routes/ScheduleBuilder";
import Grades from "./routes/Grades";
import Help from "./routes/Help";
import { Professors } from "./routes/Grades/Professors";

export const API = "http://localhost:3000/";

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
            <Route path='/scheduleBuilder' element={<ScheduleBuilder />} />
            <Route path='/grades' element={<Grades />} />
            <Route path='/grades/courses' element={<Grades />} />
            <Route path='/grades/departments' element={<Grades />} />
            <Route path='/grades/professors' element={<Professors />} />
            <Route path='/help' element={<Help />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='*' element={<Navigate to={"/"} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
