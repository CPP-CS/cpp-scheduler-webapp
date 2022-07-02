import { Course, Instruction } from "../../components/models";
import { API } from "../../components/types";
import ReactGA from "react-ga4";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { round } from "../../components/utils";
import { Container } from "@mui/system";
import CourseSearch from ".";
import { CourseSearchBar } from "../../components/data/CourseSearchBar";

export default function CourseListing(props: { course: string; instructionList: string; courseLabels: string }) {
  let course = JSON.parse(props.course) as Course;
  let instructionList = JSON.parse(props.instructionList) as Instruction[];
  let courseLabels = JSON.parse(props.courseLabels) as string[];

  //create GPA table
  let tableData: Array<JSX.Element> = [];
  let key = 0;

  for (let instruction of instructionList) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell>{`${instruction.InstructorFirst} ${instruction.InstructorLast}`}</TableCell>
        <TableCell>{`${round(instruction.AvgGPA || 0)}`}</TableCell>
        <TableCell>{`${instruction.TotalEnrollment}`}</TableCell>
      </TableRow>
    );
  }
  return (
    <Container sx={{ mt: 17 }}>
      <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
        <CourseSearchBar courseLabels={courseLabels} />
        <Grid item xs={12} mt={3}>
          <Typography variant='h2'>{course.Label}</Typography>
          <Typography variant='subtitle1'>
            Average GPA: {round(course.AvgGPA || 0)} out of {course.TotalEnrollment} Students
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Instructor Name</TableCell>
                  <TableCell>Avg GPA</TableCell>
                  <TableCell>Total Grades</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableData}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Paper>
    </Container>
  );
}

export async function getStaticPaths() {
  // gets course list
  let data = await fetch(API + "data/courses/find", {
    method: "POST",
  });
  let courseList = (await data.json()) as Course[];

  return {
    paths: courseList.map((course) => {
      return { params: { courseLabel: course.Label?.toLowerCase().replaceAll(" ", "-") } };
    }),
    fallback: false,
  };
}

export async function getStaticProps(props: { params: { courseLabel: string } }) {
  let { courseLabel } = props.params;

  // search course
  let data = await fetch(API + "data/courses/findFirst", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Subject: courseLabel.split("-")[0],
      // set courseNumber to
      CourseNumber: courseLabel.split("-")[1],
    }),
  });
  let course = (await data.json()) as Course;

  // get instructions pertaining to course
  data = await fetch(API + "data/instructions/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Subject: course.Subject,
      CourseNumber: course.CourseNumber,
    }),
  });
  let instructionList = (await data.json()) as Instruction[];

  // send course search event to google analytics
  ReactGA.event({
    category: "Query",
    action: "Course Data Search",
  });

  // get course list
  data = await fetch(API + "data/courses/find", {
    method: "POST",
  });
  let courseList = (await data.json()) as Course[];

  return {
    props: {
      course: JSON.stringify(course),
      instructionList: JSON.stringify(instructionList),
      courseLabels: JSON.stringify(courseList.map((course) => course.Label)),
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
}
