import { Autocomplete, Container, createFilterOptions, Grid, List, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { API } from "../..";
import { calcAvg, getCourse } from "../../utils";

export class Professors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { InstructorFirst: "Thanh", InstructorLast: "Nguyen", label: "Thanh Nguyen" },
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
    this.getProfessorData();
  }

  getProfessorData() {
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
        {this.state.sections == null || this.state.value == null ? null : (
          <ProfessorData professor={this.state.value} sections={this.state.sections} />
        )}
      </Container>
    );
  }
}

class ProfessorData extends React.Component {
  constructor(props) {
    super(props);
    let sections = this.props.sections;
    let professorData = {
      sectionCount: sections.length,
      gradedSections: 0,
      subjects: {},
      courses: {},
    };

    // parse through sections
    for (let section of sections) {
      // count graded sections
      if (section.A) professorData.gradedSections++;
      // sort by subject
      let subjectList = professorData.subjects;
      if (!subjectList[section.Subject]) subjectList[section.Subject] = {};
      if (!(subjectList[section.Subject].sections instanceof Array)) subjectList[section.Subject].sections = [];
      subjectList[section.Subject].sections.push(section);

      // sort by courses
      let courseList = professorData.courses;
      if (!courseList[getCourse(section)]) courseList[getCourse(section)] = {};
      if (!(courseList[getCourse(section)].sections instanceof Array)) courseList[getCourse(section)].sections = [];
      courseList[getCourse(section)].sections.push(section);
    }

    for (let subject in professorData.subjects) {
      professorData.subjects[subject].avgGPA = calcAvg(professorData.subjects[subject].sections);
    }
    for (let course in professorData.courses) {
      professorData.courses[course].avgGPA = calcAvg(professorData.courses[course].sections);
    }

    this.state = { professorData };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.professor !== this.props.professor) this.updateData();
  }

  updateData() {
    let sections = this.props.sections;
    let professorData = {
      sectionCount: sections.length,
      gradedSections: 0,
      subjects: new Set(),
      courses: new Set(),
    };
    for (let section of sections) {
      if (section.A) professorData.gradedSections++;
      professorData.subjects.add(section.Subject);
      professorData.courses.add(section.Subject + " " + section.CourseNumber);
    }
    this.setState({ professorData });
  }
  render() {
    return (
      <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
        <Grid container spacing={1}></Grid>
        <Grid item xs={12}>
          <Typography variant='h2'>{this.props.professor.label}</Typography>
          <Typography variant='subtitle1'>
            Average GPA: {calcAvg(this.props.sections)} out of {this.state.professorData.gradedSections} Courses
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <List></List>
        </Grid>
      </Paper>
    );
  }
}
