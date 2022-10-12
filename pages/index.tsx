import { Box, Button, Container, Stack, SxProps, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";

export default function Home() {
  let size = useMediaQuery("(min-width: 900px)");
  return (
    <Container maxWidth='xl'>
      <Box id='homePage' sx={{ mt: 30 }}>
        <Typography variant={"h1"} sx={{ textAlign: { xs: "center", md: "left" } }}>
          CPP Scheduler
        </Typography>
        <Box id='subTitle'>
          <Typography variant={"h2"} sx={{ textAlign: { xs: "center", md: "left" } }}>
            Data & Resources for CalPoly Pomona Students
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ mt: 3 }} spacing={2}>
          <NavButton link='/schedule-builder'>
            <Typography>Build a Schedule</Typography>
          </NavButton>
          <NavButton link='/professors'>
            <Typography>Professor Data</Typography>
          </NavButton>
          <NavButton link='/courses'>
            <Typography>Course Data</Typography>
          </NavButton>
        </Stack>
        <Box id='disclaimer' sx={{ position: "absolute", bottom: "3vh", left: "10vw", width: "80vw" }}>
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

function NavButton(props: { link: string; children: ReactElement; sx?: SxProps }) {
  return (
    <Link href={props.link}>
      <a style={{ textDecoration: "none" }}>
        <Button variant='outlined' sx={{ width: { xs: "100%" } }}>
          {props.children}
        </Button>
      </a>
    </Link>
  );
}
