import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { createI18n } from 'vue-i18n';
import en from '@/locale/en';
import kr from '@/locale/kr';
import india from '@/locale/india';
import id from '@/locale/id';
import ru from '@/locale/ru';
import es from '@/locale/es';
import tr from '@/locale/tr';
import vn from '@/locale/vn';
import th from '@/locale/th';
import cn from '@/locale/cn';
import tw from '@/locale/tw';
import LS from '@/utils/localStorage';
import { locales } from '@/config/constants/locale';

import './index.css';

const i18 = new createI18n({
	legacy: false,
	locale: LS.getItem('locale') || locales[0].name,
	fallbackLocale: 'en',
	missingWarn: false,
	fallbackWarn: false,
	silentTranslationWarn: true,
	messages: {
		en,
		kr,
		india,
		id,
		ru,
		es,
		tr,
		vn,
		th,
		cn,
		tw
	}
});

createApp(App).use(store).use(router).use(i18).provide(i18, '$t').mount('#app');
