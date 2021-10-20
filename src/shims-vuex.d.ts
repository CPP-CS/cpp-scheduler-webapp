import { Store } from 'vuex';

import { Schedule, SectionsData } from './Classes';

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    courses: SectionsData[];
    schedules: Schedule[];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
