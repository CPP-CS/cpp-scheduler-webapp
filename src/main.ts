import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretSquareLeft,
  faCaretSquareRight,
  faChevronDown,
  faChevronUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';

import App from './App.vue';
import store from './store';

// icons
library.add(faChevronDown, faChevronUp, faTrash, faCaretSquareLeft, faCaretSquareRight);

createApp(App)
  .use(store)
  .component("fa", FontAwesomeIcon)
  .mount("#app");
