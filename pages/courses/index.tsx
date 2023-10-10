import {
  Autocomplete,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  AutocompleteRenderInputParams,
} from "@mui/material";
import Head from "next/head";
import { SearchBar } from "components/data/SearchBar";
import { Course } from "types/models";
import { API } from "constants/API";

export default function CourseSearch(props: { courseLabels: string[] }) {
  return (
    <>
      <Head>
        <title>CPP Course Search</title>
        <meta name='description' content='Search for Cal Poly Pomona - CPP Course Data and History' key='description' />
      </Head>
      <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "60vh" }}>
        <Typography variant='h1' textAlign='center'>
          Search for Course Data
        </Typography>
        <SearchBar
          subtext='Select a Course...'
          labels={props.courseLabels}
          current={null}
          sx={{ px: { md: "20%" }, mt: 3 }}
          path='/courses/'
        />
      </Container>
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(API + "data/courses/findAll", {
    method: "POST",
  });
  let courseList = (await data.json()) as Course[];

  return {
    props: {
      courseLabels: courseList.map((course) => course.Label),
    },
    // revalidate: 60 * 60 * 24, // 1 day
  };
}
