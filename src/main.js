import { setupI18n } from './i18n/index.js';

setupI18n();

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
