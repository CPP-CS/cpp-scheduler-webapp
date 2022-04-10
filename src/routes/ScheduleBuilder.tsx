import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid/main";
import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { fetchQueries, schedulerActions } from "app/slices/schedulerSlice";
import { store, useAppDispatch, useAppSelector } from "app/store";
import { Loading } from "components/Loading";
import { API } from "index";
import { Course, Section } from "models";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { round } from "utils";
import { CalendarEvent, Query, QueryType, WeekDays } from "../app/Classes";

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

export default function ScheduleBuilder(props: {}) {
  let { setLoading, setCourseList } = schedulerActions;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(true));

    // ADD LOAD SAVE DATA HERE

    // query
    dispatch(fetchQueries);
    // get courses
    fetch(API + "data/courses/find", {
      method: "POST",
    })
      .then((data) => data.json())
      .then((res) => {
        let courseList = res as Course[];
        dispatch(setCourseList(courseList));
        dispatch(setLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, currentSchedule } = useAppSelector((state) => state.scheduler);
  if (loading) return <Loading />;
  return (
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
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack height='100%' direction='column' alignItems='center'>
          <SelectSchedule />
          <Box minHeight={800} height='100%' width='100%'>
            {currentSchedule !== -1 ? <ScheduleDisplay /> : null}
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
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
  const [course, setCourse] = useState<Course | null>();
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
  const dispatch = useDispatch();
  return (
    <Paper sx={{ p: 3 }} elevation={4}>
      <Typography variant='h3'>Query List</Typography>
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
                <Grid item xs={1}>
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
                <Grid item xs={11}>
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
                      } | GPA:${round(section.instructions.AvgGPA || 0)}(${
                        section.instructions.TotalEnrollment
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
  let { schedules, currentSchedule } = useAppSelector((state) => state.scheduler);
  let schedule = schedules[currentSchedule];
  let events: Array<CalendarEvent> = [];
  //schedule
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

// interface ScheduleState {}
//
// export default class ScheduleBuilder extends React.Component<{}, ScheduleState> {
//   // constructor(props: any) {
//   //   super(props);
//   // let queryList: Query[] = this.getSaveData() || [];
//   // this.initSaveOnClose();
//   // this.removeQuery = this.removeQuery.bind(this);
//   // this.addQuery = this.addQuery.bind(this);
//   // this.setCurrentSchedule = this.setCurrentSchedule.bind(this);
//   // this.setQueryResults = this.setQueryResults.bind(this);
//   // this.setQueryList = this.setQueryList.bind(this);
//   // this.state = {};
//   // this.query();
//   // }

//   // showNotif(msg?: string | undefined, severity?: "warning" | "error" | "success" | "info" | undefined) {
//   //   this.setState((prevState: ScheduleState) => {
//   //     return {
//   //       notif: {
//   //         on: true,
//   //         msg: msg || "There was a problem...",
//   //         severity: severity || "warning",
//   //       },
//   //     };
//   //   });
//   // }

//   componentDidMount() {
//     let { setLoading, setCourseList, initSaveOnClose } = schedulerActions;
//     store.dispatch(setLoading(true));
//     store.dispatch(initSaveOnClose());
//     // ADD LOAD SAVE DATA HERE

//     // query
//     query(store.dispatch);
//     // get courses
//     fetch(API + "data/courses/find", {
//       method: "POST",
//     })
//       .then((data) => data.json())
//       .then((res) => {
//         let courseList = res as Course[];
//         store.dispatch(setCourseList(courseList));
//         store.dispatch(setLoading(false));
//       });
//   }

//   // componentDidUpdate(prevProps: any, prevState: ScheduleState) {
//   //   if (this.state.queryList !== prevState.queryList) {
//   //     // console.log("Query List changed: ", prevState.queryList, this.state.queryList);
//   //     this.query();
//   //   }
//   //   // console.log("schedules:", this.state.schedules, prevState.schedules);
//   //   if (this.state.schedules !== prevState.schedules) {
//   //     // console.log(
//   //     //   "Change in Schedule Length: ",
//   //     //   prevState.schedules.length,
//   //     //   this.state.schedules.length,
//   //     //   this.state.currentSchedule
//   //     // );
//   //     let scheduleCount = this.state.schedules.length;
//   //     if (prevState.currentSchedule === -1) this.setCurrentSchedule(0);
//   //     if (scheduleCount === 0) this.setCurrentSchedule(-1);
//   //     if (this.state.currentSchedule >= scheduleCount) this.setCurrentSchedule(scheduleCount - 1);
//   //     // console.log("New Current Schedule Index: ", this.state.currentSchedule);
//   //   }
//   // }

//   render() {
//     let state = store.getState().scheduler;
//     if (state.loading) return <Loading />;
//     return (
//       <Grid
//         container
//         sx={{
//           pt: 10,
//           height: {
//             md: "100vh",
//           },
//         }}>
//         {/* <Snackbar
//           open={this.state.notif.on}
//           autoHideDuration={6000}
//           onClose={() => {
//             this.setState((prevState: ScheduleState) => {
//               return {
//                 notif: {
//                   on: false,
//                   msg: prevState.notif.msg,
//                   severity: prevState.notif.severity,
//                 },
//               };
//             });
//           }}>
//           <Alert severity={this.state.notif.severity} sx={{ width: "100%" }}>
//             {this.state.notif.msg}
//           </Alert>
//         </Snackbar> */}
//         <Grid item xs={12} md={4} sx={{ height: { md: "100%" } }}>
//           <Box overflow='scroll' sx={{ height: { md: "100%" } }}>
//             <AddQuery courseList={state.courseList} />
//             <QueryList queryResults={state.queryResults} />
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Stack height='100%' direction='column' alignItems='center'>
//             <SelectSchedule schedules={state.schedules} currentIndex={state.currentSchedule} />
//             <Box minHeight={800} height='100%' width='100%'>
//               {state.currentSchedule !== -1 ? (
//                 <ScheduleDisplay schedules={state.schedules} currentSchedule={state.currentSchedule} />
//               ) : null}
//             </Box>
//           </Stack>
//         </Grid>
//       </Grid>
//     );
//   }
// }
