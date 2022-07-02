import {
  Autocomplete,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  AutocompleteRenderInputParams,
} from "@mui/material";
import { useRouter } from "next/router";
import { CourseSearchBar } from "../../components/data/CourseSearchBar";
import { Course } from "../../components/models";
import { API } from "../../components/types";

function SelectClass() {
  return (
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
      <Typography variant='h2'>Select A Course to see Data</Typography>
    </Paper>
  );
}

export default function CourseSearch(props: { courseLabels: string[] }) {
  return (
    <Container sx={{ mt: 17 }}>
      {props.courseLabels == null ? null : <CourseSearchBar courseLabels={props.courseLabels} current='' />}

      <SelectClass />
    </Container>
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
    revalidate: 60 * 60 * 24, // 1 day
  };
}
