import axios from 'axios';
import store from '@/store';
import router from '@/router';

const TIMEOUT = 1000 * 10;

const instance = axios.create({
	baseURL: store.state.apiUrl,
	timeout: TIMEOUT,
	headers: {
		'Content-type': 'application/json',
		'Cache-Control': 'no-cache'
	}
});

instance.interceptors.request.use(function (config) {
	store.state.isLoading = true;

	if (store.state.accessToken != '') {
		config['headers'] = {
			authorization: `Bearer ${store.state.accessToken}`
		};
	}

	return config;
});

instance.interceptors.response.use(
	async response => {
		store.state.errorCount = 0;

		store.state.isLoading = false;
		// setTimeout(() => {
		// 	store.state.isLoading = false;
		// }, 1000);

		return response;
	},
	async error => {
		const errorRes = error.response;
		const originalRequest = error.config;

		store.state.errorCount += 1;

		/* 		if (store.state.errorCount < 2 && errorRes.status == 401) {
			return axios(originalRequest);
		} */

		setTimeout(() => {
			store.state.isLoading = false;
		}, 1000);

		// console.log('code =' + errorRes.status);

		if (errorRes.status == 401 || errorRes.status == 403) {
			store.commit('initToken');

			router.push('/');
		}
		//throw error

		return Promise.reject(error);
	}
);

export default instance;
