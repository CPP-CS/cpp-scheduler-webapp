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
import React, { useEffect, useState } from "react";
import { API } from "../..";
import { calcAvg, getCourse } from "../../utils";
import ReactGA from "react-ga";

export class Professors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      professorList: null,
      sections: null,
    };
  }

  componentDidMount() {
    fetch(API + "professorList")
      .then((data) => data.json())
      .then((res) => {
        this.setState({ professorList: res });
      });
  }

  getProfessorData() {
    // if (!this.state.value) return;
    fetch(API + "professorSections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first: this.state.value.InstructorFirst, last: this.state.value.InstructorLast }),
    })
      .then((data) => data.json())
      .then((res) => {
        this.setState({ sections: res });
      });
    // send professor search event to google analytics
    ReactGA.event({
      category: "Query",
      action: "Professor Data Search",
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value && this.state.value != null) {
      this.getProfessorData();
    }
  }

  render() {
    return (
      <Container sx={{ mt: 17 }}>
        {this.state.professorList == null ? null : (
          <Box>
            <Autocomplete
              value={this.state.value}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
              })}
              onChange={(ev, value) => this.setState({ value })}
              options={this.state.professorList}
              renderInput={(params) => <TextField {...params} label='Professor Name'></TextField>}
            />
          </Box>
        )}
        {this.state.sections == null || this.state.value == null ? (
          <SelectClass />
        ) : (
          <ProfessorData professor={this.state.value} sections={this.state.sections} />
        )}
      </Container>
    );
  }
}

function ProfessorData(props) {
  let professorData = {
    sectionCount: props.sections.length,
    gradedSections: 0,
    courses: {},
    gradeCount: 0,
  };

  // parse through sections
  for (let section of props.sections) {
    // count graded sections
    if (section.A) professorData.gradedSections++;
    let sectionName = getCourse(section);

    // sort by courses
    let courseList = professorData.courses;
    // create course and section data (if does not exist))
    if (!courseList[sectionName]) courseList[sectionName] = {};
    if (!(courseList[sectionName].sections instanceof Array)) courseList[sectionName].sections = [];
    if (!courseList[sectionName].gradeCount) courseList[sectionName].gradeCount = 0;
    if (!courseList[sectionName].label) courseList[sectionName].label = sectionName;

    //adds ClassTitle if possible
    if (section.ClassTitle) courseList[sectionName].label = `${sectionName} - ${section.ClassTitle}`;
    // adds section to list
    courseList[sectionName].sections.push(section);
    // adds gradeCount
    if (section.TotalEnrollment) {
      professorData.gradeCount += section.TotalEnrollment;
      courseList[sectionName].gradeCount += section.TotalEnrollment;
    }
  }

  for (let course in professorData.courses) {
    professorData.courses[course].avgGPA = calcAvg(professorData.courses[course].sections);
  }

  //convert professorData into state

  const [data, setData] = useState(professorData);

  // // find course average GPA
  // let getGPA = async (section) => {
  //   let sectionName = getCourse(section);
  //   if (!professorData.courses[sectionName].courseGPA) {
  //     fetch(API + "courseGPA", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ subject: section.Subject, courseNumber: section.CourseNumber }),
  //     })
  //       .then((data) => data.json())
  //       .then((res) => {
  //         console.log("res", res);
  //         professorData.courses[sectionName].courseGPA = res.avgGPA;
  //         console.log("professorData", professorData.courses[sectionName].courseGPA);
  //         setData(professorData);
  //         console.log("data after", data);
  //       });
  //   }
  // };
  // useEffect(() => {
  //   for (let section of props.sections) {
  //     getGPA(section);
  //   }
  // });

  console.log(props.sections);

  //create GPA table
  let tableData = [];
  let key = 0;

  let courses = Object.keys(data.courses).sort();
  for (let course of courses) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell>{`${data.courses[course].label}`}</TableCell>
        <TableCell>{`${data.courses[course].avgGPA}`}</TableCell>
        <TableCell>{`${data.courses[course].gradeCount}`}</TableCell>
      </TableRow>
    );
  }
  return (
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
      <Grid container spacing={1}></Grid>
      <Grid item xs={12}>
        <Typography variant='h2'>{props.professor.label}</Typography>
        <Typography variant='subtitle1'>
          Average GPA: {calcAvg(props.sections)} out of {data.gradeCount} Students
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject / Course</TableCell>
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
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
      <Typography variant='h2'>Select A Professor to see Data</Typography>
    </Paper>
  );
}
