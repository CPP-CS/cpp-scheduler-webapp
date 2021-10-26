<template>
  <div id="breaksDisplayContainer">
    <div v-for="(breakBlock, index) in breaks" :key="index" class="breakDisplay">
      <fa icon="trash" @click="deleteBreak(index)" class="delete" />
      <h3>{{ convertTime(breakBlock.StartTime) }}-{{ convertTime(breakBlock.EndTime) }} {{ getDays(breakBlock) }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Block, WeekDays } from "@/Classes";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BreaksDisplay",
  computed: {
    breaks(): Block[] {
      return this.$store.state.breaks;
    },
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
    getDays(breakBlock: Block): String {
      let res = "";
      for (let day of Object.keys(WeekDays)) {
        res += (breakBlock as any)[day] == "True" ? day.substring(0, 3) + " " : "";
      }
      return res;
    },
    deleteBreak(index: number) {
      this.$store.commit("deleteBreak", index);
    },
  },
});
</script>

<style scoped>
#breaksDisplayContainer {
  box-sizing: border-box;
  border: 1px solid black;
  margin: 2px;
  padding: 5px 5%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
.breakDisplay {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  margin: 2px;
  padding: 5px 5%;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.delete {
  height: 0.7em;
}
</style>
