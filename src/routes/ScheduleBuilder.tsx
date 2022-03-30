import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  createFilterOptions,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Loading } from "components/Loading";
import { API } from "index";
import React, { useState } from "react";
import { Course, CourseList, Query, QueryResult, QueryType, Section } from "../app/Classes";

const DEFAULT_TERM = "F 2022";

export default class ScheduleBuilder extends React.Component<
  {},
  { courseList: CourseList; queryList: Array<Query>; queryResults: Array<QueryResult>; loading: boolean }
> {
  constructor(props: any) {
    super(props);
    this.addQuery = this.addQuery.bind(this);
    this.state = { courseList: [], queryList: [], queryResults: [], loading: true };
  }

  componentDidMount() {
    fetch(API + "courseList")
      .then((data) => data.json())
      .then((courseList) => {
        this.setState({ courseList, loading: false });
      });
  }

  async query() {
    // console.log("Querying....", this.state.queryList);
    this.setState({ loading: true });
    let queryResults: QueryResult[] = [];
    for (const query of this.state.queryList) {
      const { type, course } = query;
      if (type === QueryType.byCourse) {
        let data = await fetch(API + "query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            term: DEFAULT_TERM,
            subject: course?.Subject,
            courseNumber: course?.CourseNumber,
          }),
        });
        let res: Section[] = (await data.json()).sections;
        console.log("Query Result Sections: ", res);
        let queryResult: QueryResult = {
          sections: res,
          query: query,
        };
        queryResults.push(queryResult);
      }
      // console.log("Query Results: ", queryResults);
    }
    this.setState({ queryResults, loading: false });
  }

  componentDidUpdate(
    prevProps: any,
    prevState: { courseList: CourseList; queryList: Array<Query>; queryResults: Array<QueryResult>; loading: boolean }
  ) {
    if (this.state.queryList !== prevState.queryList) {
      this.query();
    }
  }

  addQuery(query: Query) {
    // console.log("QueryList: ", this.state.queryList);
    this.setState({ queryList: [...this.state.queryList, query] });
  }
  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Grid container sx={{ mt: 10 }}>
        <Grid item xs={12} md={6}>
          <AddQuery addQuery={this.addQuery} courseList={this.state.courseList} />
          <QueryList queryResults={this.state.queryResults} />
        </Grid>
      </Grid>
    );
  }
}

function AddQuery(props: { courseList: CourseList; addQuery: (query: Query) => void }) {
  // default query type is by course
  const [queryType, setQueryType] = useState<QueryType | undefined>(QueryType.byCourse);

  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Add Query</Typography>
      <InputLabel id='queryType-label'>Query Type</InputLabel>
      <Select
        labelId='queryType-label'
        id='queryType'
        value={queryType}
        label='Query Type'
        onChange={(e) => setQueryType(e.target.value as QueryType)}
        fullWidth>
        <MenuItem value={QueryType.byCourse}>By Course</MenuItem>
      </Select>

      {/* course query */}
      {queryType === QueryType.byCourse ? (
        <CourseQuery courseList={props.courseList} addQuery={props.addQuery} />
      ) : null}
    </Paper>
  );
}

function CourseQuery(props: { courseList: CourseList; addQuery: (query: Query) => void }) {
  const [course, setCourse] = useState<Course | null>();
  return (
    <div>
      <Autocomplete
        fullWidth
        id='course'
        options={props.courseList}
        renderInput={(params) => <TextField {...params} label='Select Course' />}
        value={course}
        onChange={(e, val) => {
          setCourse(val);
        }}
        filterOptions={createFilterOptions({
          matchFrom: "any",
          limit: 100,
        })}
      />
      <Button
        variant='outlined'
        onClick={() => {
          if (course) props.addQuery({ type: QueryType.byCourse, course: course, minGPA: 0 });
        }}>
        Add Course
      </Button>
    </div>
  );
}

function QueryList(props: { queryResults: Array<QueryResult> }) {
  console.log("Query Results: ", props.queryResults);
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Query List</Typography>
      {props.queryResults.map((queryResult: QueryResult) => {
        let { query } = queryResult;
        let title: string = "";
        if (query.type === QueryType.byCourse)
          title = `Course: ${query.course?.Subject}${query.course?.CourseNumber}(${
            query.course?.AvgGPA ? Math.round(query.course?.AvgGPA * 100) / 100 : ""
          })`;
        return (
          <Accordion key={query.course?.label} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {queryResult.sections.map((section) => {
                return (
                  <Accordion key={section.Section}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{`Section ${section.Section} - ${
                        section.InstructorFirst ? section.InstructorFirst : "Staff"
                      } ${section.InstructorLast ? section.InstructorLast : ""} - ${
                        section.InstructionMode ? section.InstructionMode : "TBA"
                      }`}</Typography>
                    </AccordionSummary>
                  </Accordion>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
}
