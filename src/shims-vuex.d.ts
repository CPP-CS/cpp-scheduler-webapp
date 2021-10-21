import { Store } from 'vuex';

import { Block, Schedule, SectionsData } from './Classes';

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    courses: SectionsData[];
    schedules: Schedule[];
    breaks: Block[];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
