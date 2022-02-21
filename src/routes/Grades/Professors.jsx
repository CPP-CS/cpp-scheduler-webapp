import { Autocomplete, Container, createFilterOptions, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { API } from "../..";

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
        console.log(this.state.sections);
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

const GPA = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0,
};

function calcAvg(sections) {
  let tEnrollment = 0;
  let tPoints = 0;
  for (let section of sections) {
    if (!section.TotalEnrollment) continue;
    tEnrollment += section.TotalEnrollment;
    for (let grade of Object.keys(GPA)) {
      tPoints += GPA[grade] * section[grade];
    }
  }
  return Math.round((tPoints / tEnrollment) * 1000) / 1000;
}

class ProfessorData extends React.Component {
  constructor(props) {
    super(props);
    let sections = props.sections;
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
  }
  render() {
    return (
      <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
        <Typography variant='h2'>{this.props.professor.label}</Typography>
        <Typography variant='subtitle1'>Average GPA: {calcAvg(this.props.sections)}</Typography>
      </Paper>
    );
  }
}
