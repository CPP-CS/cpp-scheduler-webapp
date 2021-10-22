<template>
  <div id="scheduleContainer">
    <FullCalendar :options="calendarOptions" ref="fullCalendar" />
  </div>
</template>

<script lang="ts">
import "@fullcalendar/core/vdom";
import FullCalendar, { EventApi } from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import { PropType, defineComponent } from "vue";
import { Schedule, Section, WeekDays } from "@/Classes";

interface Event {
  title: String;
  start: String;
  end: String;
  courseIndex: Number;
  textColor: String;
  backgroundColor: String;
}

function getColor(section: Section) {
  let mode = section.InstructionMode;
  switch (mode.toLowerCase()) {
    case "bisynchronous":
      return "#fca9b0";
    case "face-to-face":
      return "#cfecff";
    case "fully synchronous":
      return "#fff5cc";
    case "fully asynchronous":
      return "#7fd463";
    case "hyflex":
      return "#faefbe";
    case "hybrid asynchronous component":
      return "#ace0fc";
    case "hybrid synchronous component":
      return "#beb8ff";
    default:
      return "white";
  }
}

export default defineComponent({
  name: "ScheduleView",
  components: {
    FullCalendar,
  },
  computed: {
    calendarOptions() {
      return {
        plugins: [timeGridPlugin],
        initialView: "timeGridWeek",
        allDaySlot: false,
        dayHeaderFormat: { weekday: "short" },
        headerToolbar: {
          start: "",
          center: "",
          end: "",
        },
        initialDate: "2011-10-02",
        slotMinTime: "06:00:00",
        events: this.events,
        slotDuration: "00:30:00",
        expandRows: true,
        height: "100%",

        eventClick: (eventClickInfo: { event: { extendedProps: { courseIndex: Number } } }) => {
          this.selectSection(eventClickInfo.event.extendedProps.courseIndex);
        },
      };
    },

    schedule(): Schedule {
      if (this.selectedSchedule == undefined || this.$store.state.schedules.length == 0) return [];
      return this.$store.state.schedules[this.selectedSchedule];
    },
    events() {
      let res: Array<Event> = [];
      for (let [index, section] of this.schedule.entries()) {
        for (let [day, num] of Object.entries(WeekDays)) {
          if ((section as any)[day] == "True") {
            res.push({
              title: `${section.Subject}${section.CourseNumber} ${section.Instructor}`,
              start: `2011-10-${num}T${section.StartTime}`,
              end: `2011-10-${num}T${section.EndTime}`,
              courseIndex: index,
              textColor: "black",
              backgroundColor: getColor(section),
            });
          }
        }
      }
      return res;
    },
  },
  props: {
    selectedSchedule: Number,
  },
  methods: {
    convertTime(str: String): String {
      if (str == "TBA") return "TBA";
      if (str.length != 8) return "ERROR";
      let hours: number = parseInt(str.substring(0, 2));
      let minutes: string = str.substring(3, 5);
      let end: string;
      if (hours > 12) {
        hours -= 12;
        end = "PM";
      } else {
        end = "AM";
      }
      return `${hours}:${minutes} ${end}`;
    },
    selectSection(courseIndex: Number) {
      this.$emit("select-section", courseIndex);
    },
  },
  emits: ["select-section"],
});
</script>

<style scoped>
#scheduleContainer {
  width: 100%;
  flex-grow: 1;
  min-width: 400px;
  overflow-y: visible;
}
</style>
