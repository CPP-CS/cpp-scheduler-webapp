import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { Query, QueryResult, QueryType, Schedule, WeekDays } from "app/Classes";
import { RootState, store } from "app/store";
import { API } from "index";
import { Course, Section } from "models";
import moment from "moment";
import { Moment } from "moment";

interface SchedulerState {
  loading: boolean;
  courseList: Course[];
  queryList: Array<Query>;
  queryResults: Array<QueryResult>;
  schedules: Schedule[];
  currentSchedule: number;
  notif: { on: boolean; msg: string; severity: "warning" | "error" | "success" | "info" | undefined };
}
const initialState: SchedulerState = {
  courseList: [],
  queryList: [],
  queryResults: [],
  loading: true,
  schedules: [],
  currentSchedule: -1,
  notif: { on: false, msg: "There was a problem...", severity: "warning" },
};

const DEFAULT_TERM = "F 2022";

function filterCourses(queryResults: QueryResult[]): QueryResult[] {
  // console.log(
  //   "Filtered Courses:",
  //   queryResults.map((result) => {
  //     return {
  //       query: result.query,
  //       sections: result.sections.filter((section) => {
  //         if ((!section.InstructorFirst || section.InstructorFirst === "Staff") && !result.query.allowStaff)
  //           return false;
  //         return true;
  //       }),
  //     };
  //   })
  // );
  return queryResults.map((result) => {
    return {
      query: result.query,

      sections: result.sections.filter((section) => {
        if ((!section.InstructorFirst || section.InstructorFirst === "Staff") && !result.query.allowStaff) return false;
        return true;
      }),
    };
  });
}

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

export async function fetchQueries(dispatch: Dispatch, getState: () => RootState) {
  let state = getState().scheduler;
  console.log("Querying....", state.queryList);
  store.dispatch(schedulerActions.setLoading(true));
  let queryResults: QueryResult[] = [];
  for (const query of state.queryList) {
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

  dispatch(schedulerActions.setQueryResults(queryResults));
  dispatch(schedulerActions.calculateSchedules(filterCourses(queryResults)));
  dispatch(schedulerActions.setLoading(false));
}

export const schedulerSlice = createSlice({
  name: "scheduler",
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<Query>) => {
      // console.log("QueryList: ", this.state.queryList);
      state.queryList = [...state.queryList, action.payload];
    },

    removeQuery: (state, action: PayloadAction<number>) => {
      state.queryList.splice(action.payload, 1);
    },

    setCurrentSchedule: (state, action: PayloadAction<number>) => {
      // console.log("Current Schedule Changed: ", currentSchedule);
      state.currentSchedule = action.payload;
    },

    setQueryResults(state, action: PayloadAction<QueryResult[]>) {
      state.queryResults = action.payload;
    },

    setQueryList(state, action: PayloadAction<Query[]>) {
      state.queryList = action.payload;
    },

    calculateSchedules: (state, action: PayloadAction<QueryResult[]>) => {
      let { queryResults } = state;
      // console.log("Calculating schedules queryresults:", queryResults);
      if (queryResults.length === 0) {
        state.schedules = [];
        state.currentSchedule = -1;
        return;
      }
      let result: Schedule[] = [];
      for (let i = 0; i < queryResults.length; i++) {
        let queryResult = queryResults[i];

        if (queryResult.sections.length === 0) {
          alert(
            "There are no available sections for one of your queries, it will not be in your schedule"
            // "warning"
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

      let scheduleCount = result.length;
      if (state.currentSchedule === -1) state.currentSchedule = 0;
      if (scheduleCount === 0) state.currentSchedule = -1;
      if (state.currentSchedule >= scheduleCount) state.currentSchedule = scheduleCount - 1;

      state.schedules = result;

      // console.log("Calculated Schedules: ", this.state.schedules);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setCourseList: (state, action: PayloadAction<Course[]>) => {
      state.courseList = action.payload;
    },

    toggleExpanded: (state, action: PayloadAction<number>) => {
      state.queryResults[action.payload].query.expanded = !state.queryResults[action.payload].query.expanded;
    },
  },
});

export const schedulerActions = schedulerSlice.actions;

export default schedulerSlice.reducer;
