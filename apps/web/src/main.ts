import '@/assets/global.css';
import '@/assets/typography.css';
import '@/assets/styles.postcss';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupStore } from './stores/setup';
import { setupComponents } from './components/setup';

const app = createApp(App);

setupComponents(app);
setupStore(app);
app.use(router);

app.mount('#app');
