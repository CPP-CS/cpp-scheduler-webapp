import { Course, Instruction } from "types/models";
import { API } from "constants/API";
import ReactGA from "react-ga4";
import {
  Grid,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { defaultKeywords, round } from "utils/utils";
import { Container } from "@mui/system";
import { SearchBar } from "components/data/SearchBar";

import Head from "next/head";
import { cache, CourseMap } from "utils/cache";
import { theme } from "pages/_app";
import { Info } from "components/Info";

export default function CourseListing(props: { course: string; instructionList: string; courseLabels: string }) {
  let md = useMediaQuery(theme.breakpoints.up("md"));

  let course = JSON.parse(props.course) as Course;
  let instructionList = JSON.parse(props.instructionList) as Instruction[];
  let courseLabels = JSON.parse(props.courseLabels) as string[];

  //create GPA table
  let tableData: Array<JSX.Element> = [];
  let key = 0;

  // generate table
  let cellStyles: SxProps = {
    // py: { xs: 1 },
  };
  for (let instruction of instructionList) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell sx={cellStyles}>{`${instruction.InstructorFirst} ${instruction.InstructorLast}`}</TableCell>
        <TableCell sx={cellStyles}>{`${round(instruction.AvgGPA || 0)}`}</TableCell>
        <TableCell sx={cellStyles}>{`${instruction.TotalEnrollment}`}</TableCell>
      </TableRow>
    );
  }

  // generate metadata
  let description = `Course data and history for ${course.Label}${
    course.CourseTitle ? " - " + course.CourseTitle : ""
  }. Average GPA: ${course.AvgGPA ? round(course.AvgGPA) : "unknown"} out of ${course.TotalEnrollment} enrollments`;
  let keyword = [
    course.Subject,
    course.CourseNumber,
    course.Label,
    ...instructionList.reduce(
      (arr, instruction) => arr.concat(`${instruction.InstructorFirst} ${instruction.InstructorLast}`),
      [] as String[]
    ),
    "course",
    ...defaultKeywords,
  ].join(", ");

  return (
    <>
      <Head>
        <title>{course.Label}</title>
        <meta name='description' key='description' content={description} />
        <meta name='keywords' key='keywords' content={keyword} />
      </Head>
      <Container sx={{ px: { md: 10, xs: 2 }, p: 5 }} maxWidth='lg'>
        <SearchBar
          subtext='Select a Course...'
          labels={courseLabels}
          current={course.Label || "Error label not found in course"}
          path='/courses/'
        />
        <Grid item xs={12} mt={3}>
          <Typography variant='h2' variantMapping={{ h2: "h1" }} textAlign='center'>{`${course.Label}${
            course.CourseTitle ? " - " + course.CourseTitle : ""
          } `}</Typography>
          <Typography variant='h4' variantMapping={{ h4: "h2" }} textAlign='center'>
            Avg GPA: {round(course.AvgGPA || 0)} / {course.TotalEnrollment} <Info text='test' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size={md ? undefined : "small"}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Instructor Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Avg GPA
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Total Grades
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableData}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  // gets course list
  let data = await fetch(API + "data/courses/findAll", {
    method: "POST",
  });
  let courseList = (await data.json()) as Course[];
  await cache.set(
    "courses",
    courseList.reduce((map: CourseMap, course) => {
      map[course.Label?.toLowerCase().replaceAll(" ", "-") || "err"] = course;
      return map;
    }, {})
  );
  return {
    paths: courseList.map((course) => {
      return { params: { courseLabel: course.Label?.toLowerCase().replaceAll(" ", "-") } };
    }),
    fallback: false,
  };
}

export async function getStaticProps(props: { params: { courseLabel: string } }) {
  let { courseLabel } = props.params;

  let courseMap = (await cache.get("courses")) as CourseMap;
  let course = courseMap[courseLabel];
  let courseList = Object.values(courseMap);

  // get instructions pertaining to course
  let data = await fetch(API + "data/instructions/findByCourse", {
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

  return {
    props: {
      course: JSON.stringify(course),
      instructionList: JSON.stringify(instructionList),
      courseLabels: JSON.stringify(courseList.map((course) => course.Label)),
    },
    // revalidate: 60 * 60 * 24, // 1 day
  };
}
