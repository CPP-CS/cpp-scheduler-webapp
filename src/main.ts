import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';

import App from './App.vue';

library.add(faChevronDown, faChevronUp, faTrash);

createApp(App)
  .component("fa", FontAwesomeIcon)
  .mount("#app");
