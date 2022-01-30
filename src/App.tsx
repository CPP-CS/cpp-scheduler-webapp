import { ThemeProvider } from "@emotion/react";
import { Typography } from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";
import React from "react";
import "./App.css";
const theme: Theme = createTheme({
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
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Typography variant="h2">Hi</Typography>
      </div>
    </ThemeProvider>
  );
}

export default App;
