<template>
  <div id="grey">
    <div
      id="errorContainer"
      :style="{
        hidden: 'hidden',
      }"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Error",
  props: {
    hidden: Boolean,
    errorMessage: String,
  },
});
</script>

<style>
#errorContainer {
  background-color: white;
  text-align: center;
  height: 10em;
  width: 15em;
  border-radius: 25px;
  border: solid black 1px;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
}
#grey {
  z-index: 1;
  height: 100vh;
  width: 100vw;
  background-color: lightgrey;
  opacity: 0.3;
  position: static;
}
</style>
