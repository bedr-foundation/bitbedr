<template>
	<div></div>
</template>

<script setup>
import { defineEmits, defineExpose } from 'vue';
import http from '@/api/http';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import { checkError } from '@/utils/util';

defineExpose({
	requestLogin
});

const emit = defineEmits(['updateLogin', 'updateCreate', 'showPopupMsg']);

function requestLogin() {
	http
		.post('/auth/login', {
			account: store.state.myAccount,
			password: openCrypto.decode(store.state.myPasswd)
		})
		.then(response => {
			console.log(response);

			store.commit('setAccessToken', { accessToken: response.data.data.accessToken });
			store.commit('setMyData', { data: response.data.data });

			if (store.state.device == 'Mobile') {
				window.plugins.OneSignal.default.login(response.data.data.wallet.address);
			}

			getNoticeInfos();
		})
		.catch(error => {
			// let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
			// emit('showPopupMsg', errMsg);
			emit('updateCreate');
		});
}

const getNoticeInfos = () => {
	http
		.get('/api/notices', {
			params: {}
		})
		.then(response => {
			console.log(response);

			let res = response.data.data;
			let resPopup = res.filter(v => v.popup == 1);

			store.commit('setNoticeInfos', { data: res });

			if (resPopup.length > 0) {
				store.state.noticePopupPos = 0;
			}

			getSwapList();
		})
		.catch(error => {
			let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
			emit('showPopupMsg', errMsg);
		});
};

const getSwapList = () => {
	http
		.get('/swap/list', {
			params: {}
		})
		.then(response => {
			console.log(response);

			const res = response.data.data;
			let swapList = {};

			for (let key in res) {
				var from = res[key].from;
				var to = res[key].to;

				if (!swapList[from]) swapList[from] = [];

				swapList[from].unshift(to);
			}

			store.commit('setSwapList', { data: swapList });

			emit('updateLogin');
		})
		.catch(error => {
			let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
			emit('showPopupMsg', errMsg);
		});
};
</script>

<style scoped></style>
