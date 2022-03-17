import {
  Autocomplete,
  Container,
  createFilterOptions,
  Grid,
  Paper,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { API } from "../..";
import { calcAvg, getProfessor } from "../../utils";
import ReactGA from "react-ga4";

export class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      courseList: null,
      sections: null,
    };
  }

  componentDidMount() {
    fetch(API + "courseList")
      .then((data) => data.json())
      .then((res) => {
        this.setState({ courseList: res });
      });
  }

  getCourseData() {
    // if (!this.state.value) return;
    fetch(API + "courseSections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject: this.state.value.Subject, courseNumber: this.state.value.CourseNumber }),
    })
      .then((data) => data.json())
      .then((res) => {
        this.setState({ sections: res });
      });
    // send professor search event to google analytics
    ReactGA.event({
      category: "Query",
      action: "Course Data Search",
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value && this.state.value != null) {
      this.getCourseData();
    }
  }

  render() {
    return (
      <Container sx={{ mt: 17 }}>
        {this.state.courseList == null ? null : (
          <Box>
            <Autocomplete
              value={this.state.value}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
              })}
              onChange={(ev, value) => this.setState({ value })}
              options={this.state.courseList}
              renderInput={(params) => <TextField {...params} label='Course Name'></TextField>}
            />
          </Box>
        )}
        {this.state.sections == null || this.state.value == null ? (
          <SelectClass />
        ) : (
          <CourseData course={this.state.value} sections={this.state.sections} />
        )}
      </Container>
    );
  }
}

function CourseData(props) {
  let courseData = {
    sectionCount: props.sections.length,
    gradedSections: 0,
    professors: {},
    gradeCount: 0,
  };

  // parse through sections
  for (let section of props.sections) {
    // count graded sections
    if (section.A) courseData.gradedSections++;
    let professorName = getProfessor(section);

    // sort by professor
    let courseList = courseData.professors;
    // create course and section data (if does not exist))
    if (!courseList[professorName]) courseList[professorName] = {};
    if (!(courseList[professorName].sections instanceof Array)) courseList[professorName].sections = [];
    if (!courseList[professorName].gradeCount) courseList[professorName].gradeCount = 0;
    if (!courseList[professorName].label) courseList[professorName].label = professorName;

    // adds section to list
    courseList[professorName].sections.push(section);
    // adds gradeCount
    if (section.TotalEnrollment) {
      courseData.gradeCount += section.TotalEnrollment;
      courseList[professorName].gradeCount += section.TotalEnrollment;
    }
  }
  console.log(courseData.professors);
  // calculate average GPAs
  for (let professor in courseData.professors) {
    courseData.professors[professor].avgGPA = calcAvg(courseData.professors[professor].sections);
  }

  console.log(props.sections);

  //create GPA table
  let tableData = [];
  let key = 0;

  let courses = Object.keys(courseData.professors).sort();
  for (let course of courses) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell>{`${courseData.professors[course].label}`}</TableCell>
        <TableCell>{`${courseData.professors[course].avgGPA}`}</TableCell>
        <TableCell>{`${courseData.professors[course].gradeCount}`}</TableCell>
      </TableRow>
    );
  }
  return (
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: { md: 10, xs: 2 } }}>
      <Grid container spacing={1}></Grid>
      <Grid item xs={12}>
        <Typography variant='h2'>{props.course.label}</Typography>
        <Typography variant='subtitle1'>
          Average GPA: {calcAvg(props.sections)} out of {courseData.gradeCount} Students
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Professor</TableCell>
                <TableCell>Avg GPA</TableCell>
                <TableCell>Total Grades</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableData}</TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Paper>
  );
}

function SelectClass() {
  return (
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: { md: 10, xs: 2 } }}>
      <Typography variant='h2'>Select a Course to See Data</Typography>
    </Paper>
  );
}
