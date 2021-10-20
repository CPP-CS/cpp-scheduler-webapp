import { State } from '@vue/runtime-core';
import { createStore } from 'vuex';

import { Schedule, Section, SectionsData, WeekDays } from './Classes';

function filterCourses(courses: SectionsData[]) {
  let filteredCourses: SectionsData[] = courses.map((sectionsData) => {
    return {
      name: sectionsData.name as string,
      sections: sectionsData.sections.filter((section: Section) => {
        return section.Selected == true;
      }),
    };
  });
  filteredCourses.forEach((sectionsData) => {
    if (sectionsData.sections.length == 0) {
      // No sections selected for sectionsData.name error
      return;
    }
  });
  return filteredCourses;
}
function isValidSchedule(schedule: Schedule) {
  for (let day of Object.keys(WeekDays)) {
    let first: Section;
    let second: Section;
    for (let section of schedule) {
      if ((section as any)[day] == "True") {
        if (first! === undefined) {
          first = section;
        } else {
          second = section;
          if (getHours(first.EndTime) == getHours(second.StartTime)) {
            if (getMinutes(first.EndTime) > getMinutes(second.StartTime)) return false;
          }
          if (getHours(first.EndTime) > getHours(second.StartTime)) return false;
          first = second;
        }
      }
    }
  }
  return true;
}
function sortSchedule(schedule: Schedule) {
  schedule.sort((first, second) => {
    let one = first.StartTime;
    let two = second.StartTime;
    if (one == "TBA") return 1;
    if (two == "TBA") return -1;
    if (getHours(one) == getHours(two)) return getMinutes(one) - getMinutes(two);
    return getHours(one) - getHours(two);
  });
}
function getHours(str: string): number {
  return parseInt(str.substring(0, 2));
}
function getMinutes(str: string): number {
  return parseInt(str.substring(3, 5));
}

const store = createStore({
  state() {
    return {
      courses: [] as SectionsData[],
      schedules: [] as Schedule[],
    };
  },
  getters: {
    getSchedules: (state: State) => {
      store.commit("findSchedules");
      console.log(state.schedules);
      return state.schedules;
    },
  },
  mutations: {
    sortCourses(state: State) {
      state.courses.sort((a: SectionsData, b: SectionsData) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    addCourse(state: State, sectionsData: SectionsData) {
      state.courses.push(sectionsData);
    },
    switchSelected(state: State, payload: { className: string; sectionNumber: number }) {
      state.courses = state.courses.map((sectionsData) => {
        if (sectionsData.name == payload.className) {
          sectionsData.sections = sectionsData.sections.map((section: Section) => {
            if (section.Section == payload.sectionNumber) {
              section.AcademicSession = "changed";
              section.Selected = !section.Selected;
            }
            return section;
          });
        }
        return sectionsData;
      }) as SectionsData[];
    },
    clearCourses(state: State) {
      state.courses = [];
    },
    deleteCourse(state: State, courseName: String) {
      state.courses = state.courses.filter((course) => {
        return course.name != courseName;
      });
    },
    findSchedules(state) {
      let courses = filterCourses(state.courses);
      if (courses.length == 0) return [];

      let result: Schedule[] = [];
      for (let section of courses[0].sections) {
        result.push([section]);
      }
      for (let i = 1; i < courses.length; i++) {
        let tempSchedules: Schedule[] = [];
        for (let section of courses[i].sections) {
          for (let schedule of result) {
            let newSchedule: Schedule = [...schedule, section];
            sortSchedule(newSchedule);
            if (isValidSchedule(newSchedule)) tempSchedules.push(newSchedule);
          }
        }
        result = tempSchedules;
      }
      state.schedules = result;
    },
  },
  actions: {
    addCourse(context, sectionsData: SectionsData) {
      context.commit("addCourse", sectionsData);
      context.commit("sortCourses");
    },
    deleteCourse(context, sectionsData: SectionsData) {
      context.commit("deleteCourse", sectionsData);
      context.commit("sortCourses");
    },
  },
});
export default store;
