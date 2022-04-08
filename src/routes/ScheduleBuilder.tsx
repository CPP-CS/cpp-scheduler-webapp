import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid/main";
import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Button,
  createFilterOptions,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Loading } from "components/Loading";
import { API } from "index";
import { Course, Section } from "models";
import moment, { Moment } from "moment";
import React, { Fragment, useState } from "react";
import { CalendarEvent, Query, QueryResult, QueryType, Schedule, WeekDays } from "../app/Classes";

const DEFAULT_TERM = "F 2022";

function sortSchedule(schedule: Schedule) {
  schedule.sort((first, second) => {
    if (!first || !first.StartTime) return 1;
    if (!second || !second.StartTime) return -1;

    let one: Moment = moment(first.StartTime, "HH:mm");
    let two: Moment = moment(second.StartTime, "HH:mm");

    // console.log("one", one);
    // console.log("two", two);

    if (one.hour() === two.hour()) return one.minute() - two.minute();
    return one.hour() - two.hour();
  });
}
function isValidSchedule(schedule: Schedule) {
  for (let day of Object.keys(WeekDays)) {
    let first: Section;
    let second: Section;
    for (let section of schedule) {
      if ((section as any)[day] === true) {
        // check for course missing start/endtime(but has days for some reason???)
        if (!section.StartTime || !section.EndTime) {
          console.log("Section doesn't have start/endtime despite having days of the week? SKIPPING", section);
          alert(
            `One of your sections has a start/endtime despite having days of the week? Please contact the developer to look at this error. Section: ${section.Term} ${section.Subject} ${section.CourseNumber} ${section.Section} ${section.ClassNumber} id: ${section.id}`
          );
          continue;
        }

        if (first! === undefined || first! === undefined) {
          first = section;
        } else {
          second = section;
          if (moment(first.EndTime!, "HH:mm").hour() === moment(second.StartTime!, "HH:mm").hour()) {
            if (moment(first.EndTime!, "HH:mm").minute() > moment(second.StartTime!, "HH:mm").minute()) return false;
          }
          if (moment(first.EndTime!, "HH:mm").hour() > moment(second.StartTime!, "HH:mm").hour()) return false;
          first = second;
        }
      }
    }
  }
  return true;
}
function getColor(section: Section) {
  let mode = section.InstructionMode || "TBA";
  switch (mode.toLowerCase()) {
    case "face-to-face":
      return "#ffbfc5";
    case "fully synchronous":
      return "#ffc89c";
    case "hybrid synchronous component":
      return "#faefbe";
    case "fully asynchronous":
      return "#8fffff";
    case "hybrid asynchronous component":
      return "#baffd5";
    case "bisynchronous":
      return "#d3cfff";
    case "hyflex":
      return "#fac4ff";
    default:
      return "white";
  }
}
function getDays(section: Section) {
  let res: string = "";
  if (section.Sunday) res += "Su";
  if (section.Monday) res += "M";
  if (section.Tuesday) res += "Tu";
  if (section.Wednesday) res += "W";
  if (section.Thursday) res += "Th";
  if (section.Friday) res += "F";
  if (section.Saturday) res += "S";
  if (res === "") return "TBA";
  return res;
}

interface ScheduleState {
  loading: boolean;
  courseList: Course[];
  queryList: Array<Query>;
  queryResults: Array<QueryResult>;
  schedules: Schedule[];
  currentSchedule: number;
  notif: { on: boolean; msg: string; severity: "warning" | "error" | "success" | "info" | undefined };
}

export default class ScheduleBuilder extends React.Component<{}, ScheduleState> {
  constructor(props: any) {
    super(props);
    let queryList: Query[] = this.getSaveData() || [];
    this.initSaveOnClose();
    this.removeQuery = this.removeQuery.bind(this);
    this.addQuery = this.addQuery.bind(this);
    this.setCurrentSchedule = this.setCurrentSchedule.bind(this);
    this.setQueryResults = this.setQueryResults.bind(this);
    this.state = {
      courseList: [],
      queryList: queryList,
      queryResults: [],
      loading: true,
      schedules: [],
      currentSchedule: -1,
      notif: { on: false, msg: "There was a problem...", severity: "warning" },
    };
    this.query();
  }

  showNotif(msg?: string | undefined, severity?: "warning" | "error" | "success" | "info" | undefined) {
    this.setState((prevState: ScheduleState) => {
      return {
        notif: {
          on: true,
          msg: msg || "There was a problem...",
          severity: severity || "warning",
        },
      };
    });
  }

  getSaveData() {
    try {
      let queries: Query[] | undefined = undefined;
      let stored: string | null = window.localStorage.getItem("queries");
      if (stored !== null) queries = JSON.parse(stored);
      if (queries) {
        for (let query of queries) {
          if (!query.expanded) query.expanded = false;
        }
        return queries;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  initSaveOnClose() {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      try {
        window.localStorage.setItem("queries", JSON.stringify(this.state.queryList));
      } catch (e) {
        console.log("Failed to save data: ", e);
      }
    });
  }

  addQuery(query: Query) {
    // console.log("QueryList: ", this.state.queryList);
    this.setState({ queryList: [...this.state.queryList, query] });
  }

  removeQuery(query: Query) {
    let { queryList } = this.state;
    for (let i = 0; i < queryList.length; i++) {
      if (queryList[i] === query) {
        let newList: Query[] = [...queryList.splice(0, i), ...queryList.splice(1)];
        // console.log("newList:", newList);
        this.setState({ queryList: newList });
        return;
      }
    }
  }

  setCurrentSchedule(currentSchedule: number) {
    // console.log("Current Schedule Changed: ", currentSchedule);
    this.setState({ currentSchedule });
  }

  setQueryResults(queryResults: QueryResult[]) {
    this.setState({ queryResults });
  }

  async query() {
    console.log("Querying....", this.state.queryList);
    this.setState({ loading: true });
    let queryResults: QueryResult[] = [];
    for (const query of this.state.queryList) {
      const { type, course } = query;

      if (type === QueryType.byCourse) {
        // query
        let data = await fetch(API + "data/sections/find", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Term: DEFAULT_TERM,
            Subject: course?.Subject,
            CourseNumber: course?.CourseNumber,
          }),
        });
        let res: Section[] = await data.json();
        // console.log("Query Result Sections: ", res);
        let queryResult: QueryResult = {
          sections: res,
          query: query,
        };
        queryResults.push(queryResult);
      }
      console.log("Query Results: ", queryResults);
    }
    this.calculateSchedules(queryResults);
    this.setState({ queryResults, loading: false });
  }

  componentDidMount() {
    fetch(API + "data/courses/find", {
      method: "POST",
    })
      .then((data) => data.json())
      .then((res) => {
        let courseList = res as Course[];
        this.setState({ courseList, loading: false });
      });
  }

  calculateSchedules(queryResults: QueryResult[]) {
    this.setState({ loading: true });
    // console.log("Calculating schedules queryresults:", queryResults);
    if (queryResults.length === 0) {
      this.setState({ schedules: [], currentSchedule: -1 });
      return;
    }
    let result: Schedule[] = [];
    for (let i = 0; i < queryResults.length; i++) {
      let queryResult = queryResults[i];

      if (queryResult.sections.length === 0) {
        this.showNotif(
          "There are no available sections for one of your queries, it will not be in your schedule",
          "warning"
        );
        continue;
      }

      if (result.length === 0) {
        result = queryResult.sections.map((section) => [section]);
      } else {
        let tempSchedules: Schedule[] = [];
        overflow: for (let section of queryResults[i].sections) {
          for (let schedule of result) {
            let newSchedule: Schedule = [...schedule, section];
            // console.log("About to sort schedule:", newSchedule);
            sortSchedule(newSchedule);
            if (isValidSchedule(newSchedule)) tempSchedules.push(newSchedule);

            //cap schedules
            if (tempSchedules.length > 999) break overflow;
          }
        }
        result = tempSchedules;
      }
    }
    this.setState({ schedules: result, loading: false });
    // console.log("Calculated Schedules: ", this.state.schedules);
  }

  componentDidUpdate(prevProps: any, prevState: ScheduleState) {
    if (this.state.queryList !== prevState.queryList) {
      this.query();
    }
    // console.log("schedules:", this.state.schedules, prevState.schedules);
    if (this.state.schedules !== prevState.schedules) {
      // console.log(
      //   "Change in Schedule Length: ",
      //   prevState.schedules.length,
      //   this.state.schedules.length,
      //   this.state.currentSchedule
      // );
      let scheduleCount = this.state.schedules.length;
      if (prevState.currentSchedule === -1) this.setCurrentSchedule(0);
      if (scheduleCount === 0) this.setCurrentSchedule(-1);
      if (this.state.currentSchedule >= scheduleCount) this.setCurrentSchedule(scheduleCount - 1);
      // console.log("New Current Schedule Index: ", this.state.currentSchedule);
    }
  }

  render() {
    if (this.state.loading) return <Loading />;
    return (
      <Grid
        container
        sx={{
          pt: 10,
          height: {
            md: "100vh",
          },
        }}>
        <Snackbar
          open={this.state.notif.on}
          autoHideDuration={6000}
          onClose={() => {
            this.setState((prevState: ScheduleState) => {
              return {
                notif: {
                  on: false,
                  msg: prevState.notif.msg,
                  severity: prevState.notif.severity,
                },
              };
            });
          }}>
          <Alert severity={this.state.notif.severity} sx={{ width: "100%" }}>
            {this.state.notif.msg}
          </Alert>
        </Snackbar>
        <Grid item xs={12} md={4} sx={{ height: { md: "100%" } }}>
          <Box overflow='scroll' sx={{ height: { md: "100%" } }}>
            <AddQuery addQuery={this.addQuery} courseList={this.state.courseList} />
            <QueryList
              queryResults={this.state.queryResults}
              removeQuery={this.removeQuery}
              setQueryResults={this.setQueryResults}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack height='100%' direction='column' alignItems='center'>
            <SelectSchedule
              schedules={this.state.schedules}
              currentIndex={this.state.currentSchedule}
              setCurrentIndex={this.setCurrentSchedule}
            />
            <Box minHeight={800} height='100%' width='100%'>
              {this.state.currentSchedule !== -1 ? (
                <ScheduleDisplay schedules={this.state.schedules} currentSchedule={this.state.currentSchedule} />
              ) : null}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    );
  }
}

function AddQuery(props: { courseList: Course[]; addQuery: (query: Query) => void }) {
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

function CourseQuery(props: { courseList: Course[]; addQuery: (query: Query) => void }) {
  const [course, setCourse] = useState<Course | null>();
  return (
    <div>
      <Autocomplete
        getOptionLabel={(option) => option.Label || "No Option Label"}
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
          if (course) props.addQuery({ type: QueryType.byCourse, course: course, minGPA: 0, expanded: false });
        }}>
        Add Course
      </Button>
    </div>
  );
}

function QueryList(props: {
  queryResults: Array<QueryResult>;
  removeQuery: (query: Query) => void;
  setQueryResults: (queryResults: QueryResult[]) => void;
}) {
  // console.log("Query Results: ", props.queryResults);
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Query List</Typography>
      {props.queryResults.map((queryResult: QueryResult) => {
        let { query } = queryResult;
        let title: string = "";
        if (query.type === QueryType.byCourse) title = `Course: ${query.course?.Subject}${query.course?.CourseNumber}`;
        return (
          <Accordion
            key={query.course?.Label}
            expanded={query.expanded}
            elevation={5}
            onChange={() => {
              query.expanded = !query.expanded;
              props.setQueryResults(props.queryResults);
            }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Grid container alignItems='center'>
                <Grid item>
                  <IconButton onClick={() => props.removeQuery(query)}>
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography>{title}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>
                {`Avg GPA: ${
                  query.course?.AvgGPA ? (Math.round(query.course?.AvgGPA * 100) / 100).toFixed(2) : "No Data"
                }`}
              </Typography>
              {queryResult.sections.map((section) => {
                return (
                  <Accordion key={section.Section} elevation={5}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{`Section ${section.Section} - ${
                        section.InstructorFirst ? section.InstructorFirst : "Staff"
                      } ${section.InstructorLast ? section.InstructorLast : ""} - ${
                        section.InstructionMode ? section.InstructionMode : "TBA"
                      }`}</Typography>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                      <Typography>Class Number: {section.ClassNumber}</Typography>
                      <Typography>Days: {getDays(section)}</Typography>
                      <Typography>
                        {section.StartTime && section.EndTime
                          ? `Time: ${moment(section.StartTime, "h:mm:ss").format("h:mma")} - ${moment(
                              section.EndTime,
                              "h:mm:ss"
                            ).format("h:mma")}`
                          : "Time: TBA"}
                      </Typography>
                      <Typography>Location: {section.Location || "TBA"}</Typography>
                      <Typography>Component: {section.Component}</Typography>
                      <Typography>Units: {section.Units}</Typography>
                    </AccordionDetails>
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

function SelectSchedule(props: {
  schedules: Schedule[];
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
}) {
  if (props.schedules.length === 0) return null;
  return (
    <Pagination
      size='large'
      siblingCount={3}
      count={props.schedules.length}
      page={props.currentIndex + 1}
      onChange={(event, val) => props.setCurrentIndex(val - 1)}
    />
  );
}

function ScheduleDisplay(props: { schedules: Schedule[]; currentSchedule: number }) {
  let schedule = props.schedules[props.currentSchedule];
  let events: Array<CalendarEvent> = [];
  //schedule
  for (let index = 0; index < schedule.length; index++) {
    let section: Section = schedule[index];
    console.log("Section: ", section);
    for (let [day, num] of Object.entries(WeekDays)) {
      if ((section as any)[day] === true) {
        // console.log(day, section);
        console.log(
          "Start Time: ",
          `2011-10-${num}T${moment(section.StartTime, "HH:mm").format("hh:mm")}:00.000Z`,
          "End Time: ",
          `2011-10-${num}T${moment(section.EndTime, "HH:mm").format("hh:mm")}:00.000Z`
        );
        events.push({
          title: `${section.Subject}${section.CourseNumber} [${section.Section}] ${
            section.InstructorFirst ? section.InstructorFirst : "Staff"
          } ${section.InstructorLast ? section.InstructorLast : ""}`,
          start: `2011-10-${num}T${moment(section.StartTime, "HH:mm").format("hh:mm")}:00`,
          end: `2011-10-${num}T${moment(section.EndTime, "HH:mm").format("hh:mm")}:00`,
          courseIndex: index,
          textColor: "black",
          backgroundColor: getColor(section),
          borderColor: "black",
          section: section,
        });
      }
      if (section.StartTime === null && section.EndTime === null) {
        events.push({
          title: `${section.Subject}${section.CourseNumber}[${section.Section}] ${
            section.InstructorFirst ? section.InstructorFirst : "Staff"
          } ${section.InstructorLast ? section.InstructorLast : ""}`,
          start: `2011-10-${num}`,
          end: `2011-10-${num}`,
          courseIndex: index,
          textColor: "black",
          backgroundColor: getColor(section),
          borderColor: "black",
          section: section,
        });
      }
    }
  }
  // console.log("Events: ", events);
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView='timeGridWeek'
      allDaySlot={true}
      allDayContent='Async'
      dayHeaderFormat={{ weekday: "short" }}
      headerToolbar={{ start: "", center: "", end: "" }}
      initialDate='2011-10-02'
      slotMinTime='06:00:00'
      events={events}
      slotDuration='00:30:00'
      expandRows={true}
      height='100%'
      eventContent={(arg) => {
        let event: CalendarEvent = arg.event.extendedProps as CalendarEvent;
        let section: Section = event.section as Section;
        return (
          <Tooltip
            enterTouchDelay={0}
            title={
              <Box>
                <Typography>Class Number: {section.ClassNumber}</Typography>
                <Typography>Days: {getDays(section)}</Typography>
                <Typography>
                  {section.StartTime && section.EndTime
                    ? `Time: ${moment(section.StartTime, "HH:mm").format("h:mma")} - ${moment(
                        section.EndTime,
                        "HH:mm"
                      ).format("h:mma")}`
                    : "Time: TBA"}
                </Typography>
                <Typography>Location: {section.Location || "TBA"}</Typography>
                <Typography>Component: {section.Component}</Typography>
                <Typography>Units: {section.Units}</Typography>
              </Box>
            }>
            <div className='fc-event-main-frame'>
              {arg.timeText && <div className='fc-event-time'>{arg.timeText}</div>}
              <div className='fc-event-title-container'>
                <div className='fc-event-title fc-sticky'>{arg.event.title || <Fragment>&nbsp;</Fragment>}</div>
              </div>
            </div>
          </Tooltip>
        );
      }}
    />
  );
}
