import { Container, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";

export default function Home() {
  let size = useMediaQuery("(min-width: 900pxr)");
  return (
    <Container maxWidth='xl'>
      <Box id='homePage' sx={{ mt: 30 }}>
        <Typography variant={size ? "h1" : "h2"}>CPP Scheduler</Typography>
        <Box id='subTitle'>
          <Typography variant={size ? "h3" : "h5"}>Planning Resources for CalPoly Pomona students</Typography>
        </Box>
      </Box>
    </Container>
  );
}
