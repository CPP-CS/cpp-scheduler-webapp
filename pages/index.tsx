import { Box, Button, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";

export default function Home() {
  let size = useMediaQuery("(min-width: 900px)");
  return (
    <Container maxWidth='xl'>
      <Box id='homePage' sx={{ mt: 30 }}>
        <Typography variant={size ? "h1" : "h2"}>CPP Scheduler</Typography>
        <Box id='subTitle'>
          <Typography variant={size ? "h3" : "h5"}>Planning Resources for CalPoly Pomona students</Typography>
        </Box>
        <Stack direction='row' sx={{ mt: 3 }} spacing={2}>
          <NavButton link='/schedule-builder'>
            <Typography>Build a Schedule</Typography>
          </NavButton>
          <NavButton link='/instructors'>
            <Typography>Instructor Data</Typography>
          </NavButton>
          <NavButton link='/courses'>
            <Typography>Course Data</Typography>
          </NavButton>
        </Stack>
        <Box id='disclaimer' sx={{ position: "absolute", top: "93vh", left: "10vw", width: "80vw" }}>
          <Typography variant='caption'>
            CPP Scheduler is not created by, managed by, endorsed by, or affiliated with Cal Poly Pomona or the
            California State University system. CPP Scheduler is a 100% student run open source project. We do not
            warrant the information provided on this website for accuracy or relevancy. For clarification on the
            information provided, please utilize official CPP resources and datasources
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

function NavButton(props: { link: string; children: ReactElement }) {
  return (
    <Link href={props.link}>
      <a style={{ textDecoration: "none" }}>
        <Button variant='outlined'>{props.children}</Button>
      </a>
    </Link>
  );
}
