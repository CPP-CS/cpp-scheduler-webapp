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
        <title>Course Search</title>
        <meta name='description' content='Search for Cal Poly Pomona(CPP) Course History and Data' key='description' />
      </Head>
      <Container sx={{ mt: 17, display: "flex", flexDirection: "column", justifyContent: "center", height: "60vh" }}>
        <Typography variant='h1' textAlign='center'>
          Search for Course Data
        </Typography>
        <SearchBar
          subtext='Select a Course...'
          labels={props.courseLabels}
          current={null}
          sx={{ px: { md: "20%" }, mt: 3 }}
        />
      </Container>
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(API + "data/courses/find", {
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
