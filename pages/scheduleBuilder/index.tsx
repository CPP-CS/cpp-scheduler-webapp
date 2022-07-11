import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  createFilterOptions,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { fetchQueries, getLocalSave, schedulerActions } from "../../store/slices/schedulerSlice";
import { store, useAppDispatch, useAppSelector } from "../../store/store";

import moment from "moment";
import { Key, useEffect, useState } from "react";

import { API, Break, CalendarEvent, Query, QueryType, WeekDays } from "../../components/types";
import { Course, Section } from "../../components/models";
import { getDays, round } from "../../components/utils";
import { GetSave, LoadSave } from "../../components/Save";
import { Loading } from "../../components/Loading";

import Calendar from "../../components/Calendar";
import Head from "next/head";

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

export default function ScheduleBuilder(props: { courseList: Course[] }) {
  let { setCourseList } = schedulerActions;
  let schedulerState = useAppSelector((state) => state.scheduler);
  let { resetting, currentSchedule } = schedulerState;
  const dispatch = useAppDispatch();
  useEffect(() => {
    // get save data
    dispatch(getLocalSave).then(() => {
      // query and reconcile data
      dispatch(fetchQueries);
    });

    dispatch(setCourseList(props.courseList));
    dispatch(schedulerActions.setResetting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setup auto saving state
  if (typeof window !== "undefined") {
    window.onbeforeunload = () => {
      window.localStorage.setItem("cppscheduler_next", JSON.stringify(schedulerState));
    };
  }

  return (
    <>
      <Head>
        <title>Schedule Builder</title>
        <meta
          name='description'
          content='Schedule Builder for CalPoly Pomona (CPP) students. Organizes courses, sections, and breaks.'
          key='description'
        />
      </Head>
      {resetting ? (
        <Loading />
      ) : (
        <Grid
          container
          sx={{
            pt: 10,
            height: {
              md: "100vh",
            },
          }}>
          <Grid item xs={12} md={4} sx={{ height: { md: "100%" } }}>
            <Box overflow='scroll' sx={{ height: { md: "100%" } }}>
              <AddQuery />
              <QueryList />
              <AddBreak />
              <BreakList />
              <GetSave />
              <LoadSave />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack height='100%' direction='column' alignItems='center'>
              <SelectSchedule />
              <Box minHeight={600} height='100%' width='100%'>
                {currentSchedule !== -1 ? <ScheduleDisplay /> : null}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(API + "data/courses/find", {
    method: "POST",
  });
  let courseList: Course[] = await data.json();
  return {
    props: {
      courseList,
    },
  };
}

function AddQuery(props: {}) {
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
      {queryType === QueryType.byCourse ? <CourseQuery /> : null}
    </Paper>
  );
}

function CourseQuery(props: {}) {
  const [course, setCourse] = useState<Course | null>(null);
  const courseList: Course[] = useAppSelector((state) => state.scheduler.courseList);
  const dispatch = useAppDispatch();
  // console.log("CourseList in CourseQuery:", courseList);
  return (
    <div>
      <Autocomplete
        getOptionLabel={(option) => option.Label || "No Option Label"}
        fullWidth
        id='course'
        options={courseList}
        renderInput={(params) => <TextField {...params} label='Select Course' />}
        value={course}
        onChange={(e, val) => {
          setCourse(val);
        }}
        isOptionEqualToValue={(option, val) => option.Label == val.Label}
        filterOptions={createFilterOptions({
          matchFrom: "any",
          limit: 100,
        })}
      />
      <Button
        variant='outlined'
        onClick={() => {
          if (course) {
            store.dispatch(
              schedulerActions.addQuery({
                type: QueryType.byCourse,
                course: course,
                minGPA: 0,
                expanded: false,
                allowStaff: true,
                sections: [],
              })
            );
            dispatch(fetchQueries);
          }
        }}>
        Add Course
      </Button>
    </div>
  );
}

function QueryList(props: {}) {
  let queries: Query[] = useAppSelector((state) => state.scheduler.queryList);
  let loading: boolean = useAppSelector((state) => state.scheduler.loading);
  const dispatch = useAppDispatch();
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Stack direction='row'>
        <Typography variant='h3'>Query List</Typography>
        {loading && <CircularProgress />}
      </Stack>
      {queries.map((query: Query, queryIndex: number) => {
        let title: string = "";
        if (query.type === QueryType.byCourse)
          title = `Course: ${query.course?.Subject}${query.course?.CourseNumber} | GPA:${round(
            query.course?.AvgGPA || 0
          )}(${query.course?.TotalEnrollment})`;
        return (
          <Accordion
            key={query.course?.Label}
            expanded={query.expanded}
            elevation={5}
            onChange={() => {
              dispatch(schedulerActions.toggleQueryExpanded(queryIndex));
            }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Grid container alignItems='center'>
                <Grid item xs='auto'>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      // console.log("removing query");
                      dispatch(schedulerActions.removeQuery(queryIndex));
                      // console.log("dispatched query");
                      dispatch(fetchQueries);
                    }}>
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid item xs>
                  <Typography variant='h5'>{title}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              {query.sections.map((section, sectionIndex) => {
                return (
                  <Accordion
                    key={section.Section}
                    elevation={5}
                    expanded={section.expanded}
                    onChange={() => {
                      dispatch(schedulerActions.toggleSectionExpanded({ queryIndex, sectionIndex }));
                    }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Switch
                        checked={section.selected}
                        size='small'
                        onChange={(e) => {
                          // negate expanded call
                          dispatch(schedulerActions.toggleSectionExpanded({ queryIndex, sectionIndex }));
                          dispatch(schedulerActions.toggleSectionSelected({ queryIndex, sectionIndex }));
                          dispatch(fetchQueries);
                        }}
                      />
                      <Typography>{`${section.Section} - ${
                        section.InstructorFirst ? section.InstructorFirst : "Staff"
                      } ${section.InstructorLast ? section.InstructorLast : ""} - ${
                        section.InstructionMode ? section.InstructionMode : "TBA"
                      } | GPA:${round(section.instructions?.AvgGPA || 0)}(${
                        section.instructions?.TotalEnrollment
                      })`}</Typography>
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

function SelectSchedule(props: {}) {
  let { schedules, currentSchedule } = useAppSelector((state) => state.scheduler);
  if (schedules.length === 0) return null;
  return (
    <Pagination
      size='large'
      siblingCount={3}
      count={schedules.length}
      page={currentSchedule + 1}
      onChange={(event, val) => store.dispatch(schedulerActions.setCurrentSchedule(val - 1))}
    />
  );
}

function ScheduleDisplay(props: {}) {
  let { schedules, currentSchedule, breakList, loading } = useAppSelector((state) => state.scheduler);
  let schedule = schedules[currentSchedule];
  let events: Array<CalendarEvent> = [];
  // generate events only if schedule exists (schedule doesn't exist while loading)
  if (schedule) {
    for (let index = 0; index < schedule.length; index++) {
      let section: Section = schedule[index];
      // console.log("Section: ", section);
      for (let [day, num] of Object.entries(WeekDays)) {
        if ((section as any)[day] === true) {
          // console.log(day, section);
          // console.log(
          //   "Start Time: ",
          //   `2011-10-${num}T${moment(section.StartTime, "HH:mm").format("hh:mm")}:00.000Z`,
          //   "End Time: ",
          //   `2011-10-${num}T${moment(section.EndTime, "HH:mm").format("hh:mm")}:00.000Z`
          // );
          events.push({
            title: `${section.Subject}${section.CourseNumber} [${section.Section}] ${
              section.InstructorFirst ? section.InstructorFirst : "Staff"
            } ${section.InstructorLast ? section.InstructorLast : ""}`,
            start: `2011-10-${num}T${moment(section.StartTime, "HH:mm").format("HH:mm")}:00`,
            end: `2011-10-${num}T${moment(section.EndTime, "HH:mm").format("HH:mm")}:00`,
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
    for (let index = 0; index < breakList.length; index++) {
      let currBreak: Break = breakList[index];
      for (let [day, num] of Object.entries(WeekDays)) {
        if ((currBreak as any)[day] === true) {
          events.push({
            title: currBreak.name,
            start: `2011-10-${num}T${moment(currBreak.StartTime, "HH:mm").format("HH:mm")}:00`,
            end: `2011-10-${num}T${moment(currBreak.EndTime, "HH:mm").format("HH:mm")}:00`,
            courseIndex: index,
            textColor: "black",
            backgroundColor: "gray",
            borderColor: "black",
            section: currBreak,
          });
        }
      }
    }
  }

  // console.log("Events: ", events);

  return loading ? <Loading /> : <Calendar events={events} />;
}

function AddBreak() {
  const dispatch = useAppDispatch();
  const [breakData, setBreakData] = useState<Break>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,

    StartTime: "12:00",
    EndTime: "13:00",

    name: "Break Name",
    selected: true,
  });
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Stack direction='column' spacing={2}>
        <Typography variant='h3'>Add Break</Typography>
        <TextField
          id='breakName'
          label='Break Name'
          variant='outlined'
          value={breakData.name}
          onChange={(e) => {
            setBreakData({ ...breakData, name: e.target.value });
          }}
        />
        <ToggleButtonGroup value=''>
          <ToggleButton
            selected={breakData.Sunday}
            value={breakData.Sunday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Sunday: !breakData.Sunday,
              });
            }}>
            <Typography>Su</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Monday}
            value={breakData.Monday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Monday: !breakData.Monday,
              });
            }}>
            <Typography>Mo</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Tuesday}
            value={breakData.Tuesday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Tuesday: !breakData.Tuesday,
              });
            }}>
            <Typography>Tu</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Wednesday}
            value={breakData.Wednesday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Wednesday: !breakData.Wednesday,
              });
            }}>
            <Typography>We</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Thursday}
            value={breakData.Thursday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Thursday: !breakData.Thursday,
              });
            }}>
            <Typography>Th</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Friday}
            value={breakData.Friday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Friday: !breakData.Friday,
              });
            }}>
            <Typography>Fr</Typography>
          </ToggleButton>
          <ToggleButton
            selected={breakData.Saturday}
            value={breakData.Saturday}
            onClick={() => {
              setBreakData({
                ...breakData,
                Saturday: !breakData.Saturday,
              });
            }}>
            <Typography>Sa</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        <Stack direction='row'>
          <TextField
            label='Start Time'
            value={breakData.StartTime}
            type='time'
            onChange={(e) => {
              setBreakData({ ...breakData, StartTime: e.target.value });
            }}
          />
          <TextField
            label='End Time'
            value={breakData.EndTime}
            type='time'
            onChange={(e) => {
              setBreakData({ ...breakData, EndTime: e.target.value });
            }}
          />
        </Stack>
        <Button
          variant='outlined'
          onClick={() => {
            dispatch(schedulerActions.addBreak(breakData));
            dispatch(schedulerActions.calculateSchedules());
          }}>
          Add Break
        </Button>
      </Stack>
    </Paper>
  );
}

function BreakList() {
  const dispatch = useAppDispatch();
  const breakList = useAppSelector((state) => state.scheduler.breakList);
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Break List</Typography>
      <List>
        {breakList.map((currBreak: Break, index: number) => {
          return (
            <Paper key={index} elevation={2} sx={{ px: 3, py: 1 }}>
              <Stack direction='row' alignItems='center'>
                <IconButton
                  onClick={() => {
                    dispatch(schedulerActions.removeBreak(index));
                    dispatch(schedulerActions.calculateSchedules());
                  }}>
                  <Delete />
                </IconButton>
                <Stack direction='column'>
                  <Typography>Name: {currBreak.name}</Typography>
                  <Typography>
                    Time: {currBreak.StartTime} - {currBreak.EndTime}
                  </Typography>
                  <Typography>Days: {getDays(currBreak)}</Typography>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </List>
    </Paper>
  );
}
