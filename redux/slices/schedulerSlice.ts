import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

import moment from "moment";
import { Moment } from "moment";
import { Course, Section } from "../../types/models";
import { Break, Query, QueryType, Schedule, WeekDays } from "types/types";
import { RootState, store } from "../store";
import { API } from "constants/API";

export interface SchedulerState {
  loading: boolean;
  resetting: boolean;
  courseList: Course[];
  queryList: Query[];
  breakList: Break[];
  schedules: Schedule[];
  currentSchedule: number;
}
const initialState: SchedulerState = {
  courseList: [],
  queryList: [],
  breakList: [],
  loading: true,
  resetting: false,
  schedules: [],
  currentSchedule: -1,
};

const DEFAULT_TERM = "F 2022";

function filterCourses(queryList: Query[], breakList: Break[]): Query[] {
  return queryList.map((query) => {
    // copy query
    let newQuery = Object.assign({}, query);
    newQuery.sections = query.sections.filter((section) => {
      if (!section.selected) return false;
      if (conflictsWithBreak(section, breakList)) return false;
      return true;
    });
    return newQuery;
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

function conflictsWithBreak(section: Section, breakList: Break[]): boolean {
  if (section.StartTime === null && section.EndTime === null) return false;
  let sectionStart = moment(section.StartTime, "HH:mm");
  let sectionEnd = moment(section.EndTime, "HH:mm");
  for (let currBreak of breakList) {
    let breakStart = moment(currBreak.StartTime, "HH:mm");
    let breakEnd = moment(currBreak.EndTime, "HH:mm");
    for (let weekDay of Object.keys(WeekDays)) {
      if ((section as any)[weekDay] === true && (currBreak as any)[weekDay] === true) {
        if (sectionStart.isSameOrBefore(breakEnd) && sectionEnd.isSameOrAfter(breakStart)) {
          console.log("Section Filtered:", JSON.parse(JSON.stringify(section)));
          return true;
        }
      }
    }
  }
  return false;
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

async function fetchByCourse(course: Course | undefined): Promise<Section[]> {
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
  return res;
}

function reconcileQuerySections(query: Query, queryResults: Section[]) {
  // copy query
  query = JSON.parse(JSON.stringify(query));
  // add/update sections
  for (let queryResult of queryResults) {
    let found = false;
    // update existing section

    for (let section of query.sections) {
      // console.log("Query Result: ", queryResult.Subject, queryResult.CourseNumber, queryResult.Section);
      // console.log("Existing section: ", queryResult.Subject, queryResult.CourseNumber, queryResult.Section);
      if (
        queryResult.Subject === section.Subject &&
        queryResult.CourseNumber === section.CourseNumber &&
        queryResult.Section === section.Section
      ) {
        Object.assign(section, queryResult);
        console.log("Updated existing section:", section);
        found = true;
      }
    }
    // add new section
    if (!found) {
      console.log("Adding new section:", queryResult, "to", query.sections);
      query.sections.push({
        ...queryResult,
        // set default values
        expanded: true,
        selected: true,
      });
    }
  }

  // remove deleted(by school) sections
  for (let i = 0; i < query.sections.length; i++) {
    let section = query.sections[i];
    if (
      !queryResults.some(
        (queryResult) =>
          queryResult.Subject === section.Subject &&
          queryResult.CourseNumber === section.CourseNumber &&
          queryResult.Section === section.Section
      )
    ) {
      query.sections.splice(i, 1);
    }
  }
  return query;
}

export async function getLocalSave(dispatch: Dispatch, getState: () => RootState) {
  // load save data
  let storage = window.localStorage.getItem("cppscheduler_next");
  if (storage) {
    console.log("loading save data...");
    dispatch(schedulerActions.loadSave(JSON.parse(storage)));
  }
}

export async function fetchQueries(dispatch: Dispatch, getState: () => RootState) {
  store.dispatch(schedulerActions.setLoading(true));
  // get querylist from store
  let queryList = getState().scheduler.queryList;
  console.log("Querying....", queryList);

  // store new query array
  let newQueryList: Query[] = [];

  // iterate through all queries in state,
  for (const query of queryList) {
    const { type, course } = query;
    let queryResults: Section[];
    if (type === QueryType.byCourse) {
      queryResults = await fetchByCourse(course);
      newQueryList.push(reconcileQuerySections(query, queryResults));
    }
    console.log("Query Results: ", queryResults! || "No type?");
  }

  dispatch(schedulerActions.setQueryList(newQueryList));
  // console.log("Before calculate schedules: ", getState().scheduler.queryList);
  dispatch(schedulerActions.calculateSchedules());
  // console.log("After calculate schedules: ", getState().scheduler.queryList);
  dispatch(schedulerActions.setLoading(false));
}

export const schedulerSlice = createSlice({
  name: "scheduler",
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<Query>) => {
      console.log("State", JSON.parse(JSON.stringify(state)));
      console.log("Payload", action.payload);
      state.queryList = [...state.queryList, action.payload];
    },

    removeQuery: (state, action: PayloadAction<number>) => {
      state.queryList.splice(action.payload, 1);
    },

    setCurrentSchedule: (state, action: PayloadAction<number>) => {
      // console.log("Current Schedule Changed: ", currentSchedule);
      state.currentSchedule = action.payload;
    },

    setQueryList(state, action: PayloadAction<Query[]>) {
      state.queryList = action.payload;
    },

    calculateSchedules: (state) => {
      let queryList = filterCourses(state.queryList, state.breakList);

      //sort sections
      queryList.forEach((query) => {
        query.sections.sort((a, b) => {
          if (!b.InstructorFirst || b.InstructorFirst === "Staff") return -999;
          if (!a.InstructorFirst || a.InstructorFirst === "Staff") return 999;
          return (b.instructions.AvgGPA || 0) - (a.instructions.AvgGPA || 0);
        });
      });

      console.log("Calculating schedules queryList:", JSON.parse(JSON.stringify(queryList)));
      if (queryList.length === 0) {
        state.schedules = [];
        state.currentSchedule = -1;
        return;
      }
      let result: Schedule[] = [];
      for (let i = 0; i < queryList.length; i++) {
        let query = queryList[i];

        if (query.sections.length === 0) {
          alert(
            "There are no available sections for one of your queries, it will not be in your schedule"
            // "warning"
          );
          continue;
        }

        if (result.length === 0) {
          result = query.sections.map((section) => [section]);
        } else {
          let tempSchedules: Schedule[] = [];
          overflow: for (let section of queryList[i].sections) {
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

    toggleQueryExpanded: (state, action: PayloadAction<number>) => {
      state.queryList[action.payload].expanded = !state.queryList[action.payload].expanded;
    },

    toggleSectionExpanded: (state, action: PayloadAction<{ queryIndex: number; sectionIndex: number }>) => {
      let { queryIndex, sectionIndex } = action.payload;
      state.queryList[queryIndex].sections[sectionIndex].expanded =
        !state.queryList[queryIndex].sections[sectionIndex].expanded;
    },

    toggleSectionSelected: (state, action: PayloadAction<{ queryIndex: number; sectionIndex: number }>) => {
      let { queryIndex, sectionIndex } = action.payload;
      state.queryList[queryIndex].sections[sectionIndex].selected =
        !state.queryList[queryIndex].sections[sectionIndex].selected;
    },

    addBreak(state, action: PayloadAction<Break>) {
      let currBreak = action.payload;
      let breakStart = moment(currBreak.StartTime, "HH:mm");
      let breakEnd = moment(currBreak.EndTime, "HH:mm");
      if (breakEnd.isAfter(breakStart)) {
        state.breakList.push(action.payload);
      } else {
        alert("Invalid break time, make sure start is before end");
      }
    },

    removeBreak(state, action: PayloadAction<number>) {
      state.breakList.splice(action.payload, 1);
    },

    setState(state, action: PayloadAction<SchedulerState | {}>) {
      try {
        Object.assign(state, action.payload);
        // console.log("Loading save data: ", JSON.parse(JSON.stringify(state)));
      } catch (e) {
        console.log("Error setting state: ", e);
      }
    },

    setResetting(state, action: PayloadAction<boolean>) {
      state.resetting = action.payload;
    },

    loadSave(state, action: PayloadAction<SchedulerState>) {
      let { breakList, currentSchedule, queryList } = action.payload;
      state.breakList = breakList;
      state.currentSchedule = currentSchedule;
      state.queryList = queryList;
    },
  },
});

export const schedulerActions = schedulerSlice.actions;
export default schedulerSlice.reducer;

// export default persistReducer({ key: "release", storage }, schedulerSlice.reducer);
