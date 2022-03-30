import {
  Autocomplete,
  createFilterOptions,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { API } from "index";
import React, { useState } from "react";
import { CourseList, Query } from "../app/Classes";

export default class ScheduleBuilder extends React.Component<{}, { queries: Query[]; courseList: CourseList }> {
  constructor(props: any) {
    super(props);
    this.addQuery.bind(this);
    this.state = { queries: [], courseList: [] };
  }

  componentDidMount() {
    fetch(API + "courseList")
      .then((data) => data.json())
      .then((courseList) => this.setState({ courseList }));
  }

  addQuery(query: Query) {
    this.setState({ queries: [...this.state.queries, query] });
  }
  render() {
    return (
      <Grid container sx={{ mt: 10 }}>
        <Grid item xs={12} md={6}>
          {this.state.courseList ? <AddQuery courseList={this.state.courseList} /> : null}
        </Grid>
      </Grid>
    );
  }
}

function AddQuery(props: { courseList: CourseList }) {
  const [queryType, setQueryType] = useState("byCourse");

  let courseQuery = (
    <Autocomplete
      id='course'
      options={props.courseList}
      renderInput={(params) => <TextField {...params} />}
      filterOptions={createFilterOptions({
        matchFrom: "any",
        limit: 100,
      })}
    />
  );

  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Add Query</Typography>
      <InputLabel id='queryType-label'>Query Type</InputLabel>
      <Select
        labelId='queryType-label'
        id='queryType'
        value={queryType}
        label='Query Type'
        onChange={(e) => setQueryType(e.target.value)}>
        <MenuItem value='byCourse'>By Course</MenuItem>
      </Select>

      {/* course query */}
      {queryType === "byCourse" ? courseQuery : null}
    </Paper>
  );
}
