<template>
  <div id="scheduleContainer">
    <FullCalendar :options="calendarOptions" ref="fullCalendar" />
  </div>
</template>

<script lang="ts">
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import { PropType, defineComponent } from "vue";
import { Schedule, Section, WeekDays } from "@/Classes";

interface Event {
  title: String;
  start: String;
  end: String;
  section: Section;
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
        slotDuration: "1:00:00",
        height: "479px",
        eventClick: (eventClickInfo: { event: { extendedProps: { section: any } } }) => {
          this.selectSection(eventClickInfo.event.extendedProps.section);
        },
      };
    },
    events() {
      let res: Array<Event> = [];

      for (let section of this.schedule!) {
        for (let [day, num] of Object.entries(WeekDays)) {
          if ((section as any)[day] == "True") {
            res.push({
              title: `${section.Subject}${section.CourseNumber} ${section.Instructor}`,
              start: `2011-10-${num}T${section.StartTime}`,
              end: `2011-10-${num}T${section.EndTime}`,
              section: section,
            });
          }
        }
      }
      console.log("calculated results", res);
      return res;
    },
  },
  props: {
    schedule: Array as PropType<Schedule>,
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
    selectSection(section: Section) {
      this.$emit("select-section", section);
    },
  },
  emits: ["select-section"],
});
</script>

<style scoped>
#scheduleContainer {
  width: 50%;
  flex-grow: 1;
  min-width: 400px;
  /* padding: 0 5px; */
}
</style>
