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
import { Instruction, Instructor } from "../../../components/models";
import { API } from "../../../components/types";
import { round } from "../../../components/utils";

let bob: Instructor = {
  InstructorFirst: "Bob",
  InstructorLast: "",
  Label: "Bob",
  AvgGPA: 100,
  id: -1,
  TotalEnrollment: 999,
};

type State = {
  selected: Instructor | null;
  instructorList: Instructor[] | null;
  instructionList: Instruction[] | null;
};

export default class Instructors extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: null,
      instructorList: null,
      instructionList: null,
    };
  }

  componentDidMount() {
    fetch(API + "data/instructors/find", {
      method: "POST",
    })
      .then((data) => data.json())
      .then((res) => {
        let instructorList = res as Instructor[];
        // bob easteregg
        instructorList.push(bob);
        this.setState({ instructorList });
      });
  }

  getInstructionList() {
    if (!this.state.selected) {
      console.log("Tried getting instruction list without a selected instructor");
      return;
    }
    // special bob easteregg
    if (this.state.selected.id === -1) {
      this.setState({
        instructionList: [
          {
            id: -1,
            courseId: -1,
            instructorId: -1,
            CourseNumber: "101",
            InstructorFirst: "Bob",
            InstructorLast: "",
            Subject: "CS",
            AvgGPA: 999,
            TotalEnrollment: 999,
          },
        ],
      });
      return;
    }
    // get instructions pertaining to professor
    fetch(API + "data/instructions/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        InstructorFirst: this.state.selected.InstructorFirst,
        InstructorLast: this.state.selected.InstructorLast,
      }),
    })
      .then((data) => data.json())
      .then((instructionList) => {
        this.setState({ instructionList });
      });
    // send professor search event to google analytics
    ReactGA.event({
      category: "Query",
      action: "Instructor Data Search",
    });
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.selected !== this.state.selected && this.state.selected != null) {
      this.getInstructionList();
    }
  }

  render() {
    return (
      <Container sx={{ mt: 17 }}>
        {this.state.instructorList == null ? null : (
          <Box>
            <Autocomplete
              getOptionLabel={(option) => option.Label || "No Option Label"}
              value={this.state.selected}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
              })}
              onChange={(ev, value) => this.setState({ selected: value })}
              options={this.state.instructorList || []}
              renderInput={(params) => <TextField {...params} label='Instructor Name'></TextField>}
            />
          </Box>
        )}
        {this.state.instructionList == null || this.state.selected == null ? (
          <SelectClass />
        ) : (
          <InstructorData selected={this.state.selected} instructionList={this.state.instructionList} />
        )}
      </Container>
    );
  }
}

function InstructorData(props: { selected: Instructor; instructionList: Instruction[] }) {
  const { selected, instructionList } = props;

  //create GPA table
  let tableData: Array<JSX.Element> = [];
  let key = 0;

  for (let instruction of instructionList) {
    tableData.push(
      <TableRow key={key++}>
        <TableCell>
          {selected.InstructorFirst === "Bob" && selected.InstructorLast === "" ? (
            <a href='https://discord.gg/wKyZgkqHh6'>Join the Bob Discord Server!</a>
          ) : (
            `${instruction.Subject} ${instruction.CourseNumber}`
          )}
        </TableCell>
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
