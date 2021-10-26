<template>
  <div id="addBreaksContainer">
    <form id="addBreaksForm">
      <fieldset>
        <legend>Start Time:</legend>
        <select name="startHour" id="startHour" v-model="startHour">
          <option v-for="hour in hours" :key="hour">{{ hour }}</option>
        </select>

        <select name="startMinute" id="startMinute" v-model="startMinute">
          <option v-for="minute in minutes" :key="minute">{{ minute }}</option>
        </select>

        <select name="startMinute" id="startMinute" v-model="startPeriod">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>End Time:</legend>
        <select name="endHour" id="endHour" v-model="endHour">
          <option v-for="hour in hours" :key="hour">{{ hour }}</option>
        </select>

        <select name="endMinute" id="endMinute" v-model="endMinute">
          <option v-for="minute in minutes" :key="minute">{{ minute }}</option>
        </select>

        <select name="endMinute" id="endMinute" v-model="endPeriod">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </fieldset>

      <fieldset class="days">
        <label for="sunday">Sun</label>
        <input type="checkbox" name="sunday" id="sunday" v-model="sunday" />
        <label for="monday">Mon</label>
        <input type="checkbox" name="monday" id="monday" v-model="monday" />
        <label for="tuesday">Tue</label>
        <input type="checkbox" name="tuesday" id="tuesday" v-model="tuesday" />
        <label for="wednesday">Wed</label>
        <input type="checkbox" name="wednesday" id="wednesday" v-model="wednesday" />
        <label for="thursday">Thu</label>
        <input type="checkbox" name="thursday" id="thursday" v-model="thursday" />
        <label for="friday">Fri</label>
        <input type="checkbox" name="friday" id="friday" v-model="friday" />
        <label for="saturday">Sat</label>
        <input type="checkbox" name="saturday" id="saturday" v-model="saturday" />
      </fieldset>

      <input type="button" value="Add Break" @click="addBreak" />
    </form>
  </div>
</template>
<script lang="ts">
import { Block } from "@/Classes";
import { defineComponent } from "vue";
export default defineComponent({
  name: "AddBreaks",
  data() {
    return {
      startHour: "00",
      startMinute: "00",
      startPeriod: "AM",
      endHour: "00",
      endMinute: "00",
      endPeriod: "AM",
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      minutes: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
      hours: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"],
    };
  },
  methods: {
    addBreak() {
      let startTime = `${this.startPeriod == "AM" ? this.startHour : (parseInt(this.startHour) + 12).toString()}:${
        this.startMinute
      }:00`;
      let endTime = `${this.endPeriod == "AM" ? this.endHour : (parseInt(this.endHour) + 12).toString()}:${
        this.endMinute
      }:00`;

      let breakBlock: Block = {
        EndTime: endTime,
        Friday:
          this.friday
            .toString()
            .charAt(0)
            .toUpperCase() + this.friday.toString().slice(1),
        Monday:
          this.monday
            .toString()
            .charAt(0)
            .toUpperCase() + this.monday.toString().slice(1),
        Saturday:
          this.saturday
            .toString()
            .charAt(0)
            .toUpperCase() + this.saturday.toString().slice(1),
        StartTime: startTime,
        Sunday:
          this.sunday
            .toString()
            .charAt(0)
            .toUpperCase() + this.sunday.toString().slice(1),
        Thursday:
          this.thursday
            .toString()
            .charAt(0)
            .toUpperCase() + this.thursday.toString().slice(1),
        Tuesday:
          this.tuesday
            .toString()
            .charAt(0)
            .toUpperCase() + this.tuesday.toString().slice(1),
        Wednesday:
          this.wednesday
            .toString()
            .charAt(0)
            .toUpperCase() + this.wednesday.toString().slice(1),
      };
      this.$store.dispatch("addBreak", breakBlock);
    },
  },
});
</script>

<style scoped lang="scss">
#addBreaksForm {
  padding: 1em 0.2em;
  border-radius: 5px;
  border: gray solid 3px;
  display: flex;
  flex-direction: column;
}

label {
  margin: 0 10px;
}

.days {
  label {
    margin: 1px;
  }
  input {
    margin: 1px;
  }
}

input,
fieldset {
  margin: 10px;
}

::-webkit-scrollbar {
  width: 0;
}
</style>
