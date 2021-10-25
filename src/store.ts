import LZUTF8 from 'lzutf8';
import { ActionContext, createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import { Block, Course, SaveData, Schedule, Section, WeekDays } from './Classes';

function filterCourses(courses: Course[]) {
  let filteredCourses: Course[] = courses.map((sectionsData) => {
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
function error(error: String) {
  alert(error);
}

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: State) => {
    return { courses: state.courses };
  },
});

interface State {
  courses: Course[];
  schedules: Schedule[];
  breaks: Block[];
}

const store = createStore({
  plugins: [vuexLocal.plugin],
  state() {
    return {
      courses: [] as Course[],
      schedules: [] as Schedule[],
      breaks: [] as Block[],
    };
  },
  getters: {
    getSchedules(state: State) {
      store.commit("findSchedules");
      return state.schedules;
    },
    getSaveData(state: State) {
      let saveData: SaveData = {
        breaks: state.breaks,
        courses: [],
        activeSections: [],
      };
      for (let course of state.courses) {
        saveData.courses.push({
          subject: course.sections[0].Subject,
          courseNumber: course.sections[0].CourseNumber.toString(),
        });
        for (let section of course.sections) {
          if (section.Selected) {
            saveData.activeSections.push(section.ClassNumber);
          }
        }
      }
      console.log("saved data", saveData);
      return LZUTF8.compress(JSON.stringify(saveData), {
        outputEncoding: "StorageBinaryString",
      });
    },
  },
  mutations: {
    sortCourses(state: State) {
      state.courses.sort((a: Course, b: Course) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    addCourse(state: State, course: Course) {
      state.courses.push(course);
    },
    switchSelected(state: State, payload: { className: string; sectionNumber: number }) {
      state.courses = state.courses.map((sectionsData) => {
        if (sectionsData.name == payload.className) {
          sectionsData.sections = sectionsData.sections.map((section: Section) => {
            if (section.Section == payload.sectionNumber) {
              section.Selected = !section.Selected;
            }
            return section;
          });
        }
        return sectionsData;
      }) as Course[];
    },
    clearCourses(state: State) {
      state.courses = [];
    },
    deleteCourse(state: State, courseName: String) {
      state.courses = state.courses.filter((course) => {
        return course.name != courseName;
      });
    },
    setCourses(state: State, courses: Course[]) {
      state.courses = courses;
    },
    findSchedules(state) {
      let courses = filterCourses(state.courses);
      if (courses.length == 0) {
        state.schedules = [];
        return;
      }

      let result: Schedule[] = [];
      for (let section of courses[0].sections) {
        result.push([section]);
      }
      for (let i = 1; i < courses.length; i++) {
        let tempSchedules: Schedule[] = [];
        overflow: for (let section of courses[i].sections) {
          for (let schedule of result) {
            let newSchedule: Schedule = [...schedule, section];
            sortSchedule(newSchedule);
            if (isValidSchedule(newSchedule)) tempSchedules.push(newSchedule);

            //cap schedules
            if (tempSchedules.length > 999) break overflow;
          }
        }
        result = tempSchedules;
      }
      state.schedules = result;
    },
  },
  actions: {
    async findCourse(context, parameters: { subject: string; courseNumber: string }) {
      parameters.subject = parameters.subject.toUpperCase();
      if (typeof parameters.courseNumber == "string") {
        parameters.courseNumber.toUpperCase();
      }
      let query = `https://cpp-scheduler.herokuapp.com/api/courses/Sp22/?Subject=${parameters.subject}&CourseNumber=${parameters.courseNumber}`.replace(
        " ",
        "+"
      );
      let response = await fetch(query);
      let sections: Array<Section> = await response.json();
      if (sections.length == 0) {
        error(`No sections found under: ${parameters.subject}${parameters.courseNumber}`);
      } else if (
        context.state.courses.find(
          (sectionsData) => sectionsData.name == `${parameters.subject} ${parameters.courseNumber}`
        )
      ) {
        error(`Course already added: ${parameters.subject}${parameters.courseNumber}`);
      } else if (context.state.courses.length >= 12) {
        error(`Cannot add course. Maximum reached`);
      } else {
        sections.forEach((section) => (section.Selected = true));
        sections.sort((a, b) => {
          return a.Section - b.Section;
        });
        let course: Course = {
          name: `${parameters.subject} ${parameters.courseNumber}`,
          sections: sections,
        };
        context.dispatch("addCourse", course);
      }
    },
    loadSaveData(context: ActionContext<State, State>, input: string) {
      let saveData: SaveData;
      try {
        saveData = JSON.parse(
          LZUTF8.decompress(input, {
            inputEncoding: "StorageBinaryString",
          })
        );
        console.log("Loaded Save Data", saveData);

        if ("breaks" in saveData) {
          context.state.breaks = saveData.breaks;
        }

        if ("courses" in saveData) {
          context.state.courses = [];
          context.dispatch("findCourses", saveData).then(() => {
            console.log("fixing sections");

            console.log(saveData.activeSections);
            context.state.courses.forEach((course) => {
              course.sections.forEach((section) => {
                // console.log(section.ClassNumber);
                section.Selected = saveData.activeSections.includes(section.ClassNumber);
                // console.log(saveData.activeSections.includes(section.CourseNumber), section.Selected);
              });
            });
          });
        }
      } catch (err) {
        error("Failed to load save data: " + err);
      }
    },
    async findCourses(context, saveData: SaveData) {
      for (let course of saveData.courses) {
        await context.dispatch("findCourse", course);
        console.log("finding courses");
      }
    },
    addCourse(context, course: Course) {
      context.commit("addCourse", course);
      context.commit("sortCourses");
    },
    deleteCourse(context, course: Course) {
      context.commit("deleteCourse", course);
      context.commit("sortCourses");
    },
  },
});

export default store;
