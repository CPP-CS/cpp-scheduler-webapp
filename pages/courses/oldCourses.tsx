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
  Box,
} from "@mui/material";
import React from "react";
import ReactGA from "react-ga4";
import { Course, Instruction } from "../../components/models";
import { API } from "../../components/types";
import { round } from "../../components/utils";

type State = {
  selected: Course | null;
  courseList: Course[] | null;
  instructionList: Instruction[] | null;
};

export default class Courses extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: null,
      courseList: null,
      instructionList: null,
    };
  }

  componentDidMount() {
    fetch(API + "data/courses/find", {
      method: "POST",
    })
      .then((data) => data.json())
      .then((res) => {
        let courseList = res as Course[];
        this.setState({ courseList });
      });
  }

  getCourseList() {
    if (!this.state.selected) {
      console.log("Tried getting instruction list without a selected course");
      return;
    }
    // get sections pertaining to instructor
    fetch(API + "data/instructions/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Subject: this.state.selected.Subject,
        CourseNumber: this.state.selected.CourseNumber,
      }),
    })
      .then((data) => data.json())
      .then((instructionList) => {
        this.setState({ instructionList });
      });
    // send instructor search event to google analytics
    ReactGA.event({
      category: "Query",
      action: "Course Data Search",
    });
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.selected !== this.state.selected && this.state.selected != null) {
      this.getCourseList();
    }
  }

  render() {
    return (
      <Container sx={{ mt: 17 }}>
        {this.state.courseList == null ? null : (
          <Box>
            <Autocomplete
              getOptionLabel={(option) => option.Label || "No Option Label"}
              value={this.state.selected}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
              })}
              onChange={(ev, value) => this.setState({ selected: value })}
              options={this.state.courseList || []}
              renderInput={(params) => <TextField {...params} label='Instructor Name'></TextField>}
            />
          </Box>
        )}
        {this.state.instructionList == null || this.state.selected == null ? (
          <SelectClass />
        ) : (
          <CourseData selected={this.state.selected} instructionList={this.state.instructionList} />
        )}
      </Container>
    );
  }
}

function CourseData(props: { selected: Course; instructionList: Instruction[] }) {
  const { selected, instructionList } = props;

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
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
      <Grid container spacing={1}></Grid>
      <Grid item xs={12}>
        <Typography variant='h2'>{selected.Label}</Typography>
        <Typography variant='subtitle1'>
          Average GPA: {round(selected.AvgGPA || 0)} out of {selected.TotalEnrollment} Students
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
  );
}

function SelectClass() {
  return (
    <Paper variant='elevation' elevation={4} sx={{ mt: 2, p: 10 }}>
      <Typography variant='h2'>Select A Course to see Data</Typography>
    </Paper>
  );
}
