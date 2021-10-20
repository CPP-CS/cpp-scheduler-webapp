<template>
  <div id="container">
    <Courses />
    <Schedules />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Courses from "./components/Courses.vue";
import Schedules from "./components/Schedules.vue";

export default defineComponent({
  name: "App",
  components: {
    Courses,
    Schedules,
  },
  data() {
    return {
      errorMessage: "error" as String,
      hidden: false,
      id: 1,
    };
  },
  methods: {},
});
</script>

<style>
#container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 961px) {
  #container {
    display: flex;
    flex-direction: row;
  }
}

* {
  font-family: "Noto Sans Display", sans;
}
::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}
</style>
