<template>
	<header>
		<div class="h-24"></div>
		<div><img src="@/assets/images/logo.svg" /></div>
		<div class="h-20"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-login-box">
		<div class="px-16 w-full overflow-y-auto">
			<div class="h-8"></div>
			<div class="text-center">{{ $t('word.login') }}</div>
			<div class="h-8"></div>
			<div>
				<SelectCountry />
			</div>
			<div class="h-2"></div>
			<div class="g-input-box">
				<div class="p-3 text-xs">{{ $t('word.phoneNumber') }}</div>
				<div class="h-[1px] line"></div>
				<input
					v-model="phoneNumber"
					type="text"
					class="w-full h-11 g-input-no-border text-sm text-black"
					:placeholder="$t('word.phoneNumber')"
					@keyup.enter="checkLogin"
				/>
			</div>
			<div class="h-2"></div>
			<div class="g-input-box">
				<div class="p-3 text-xs">{{ $t('word.password') }}</div>
				<div class="h-[1px] line"></div>
				<input
					v-model="passwd"
					type="password"
					class="w-full h-11 g-input-no-border text-sm text-black"
					:placeholder="$t('word.password')"
					@keyup.enter="checkLogin"
				/>
			</div>
			<div class="h-2"></div>
			<router-link :to="'reset'" class="w-full text-xs flex justify-end items-center">{{ $t('word.passwordFind') }} </router-link>
			<div class="h-12"></div>
			<div @click="checkLogin" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.login') }}</div>
			<div class="h-2"></div>
			<router-link :to="'join'" class="h-12 flex justify-center items-center text-sm g-btn-none">{{ $t('word.join') }} </router-link>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import SelectCountry from '@/components/SelectCountry.vue';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const phoneNumber = ref(store.state.phoneNumber);
const passwd = ref('');

onMounted(() => {
	store.commit('setClear');

	if (store.state.accessToken != '') {
		requestReLogin();
	}
});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	visible.value = false;
	popupMsg.value = '';
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const checkLogin = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.Keyboard.close();
	} else {
		document.activeElement.blur();
	}

	if (phoneNumber.value == '' || passwd.value == '') {
		popupMsg.value = t('message.checkPhoneAndPass');
	} else {
		requestLogin();
	}
};

const requestLogin = () => {
	http
		.post('/auth/login', {
			account: makePhoneNumber(phoneNumber.value),
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			store.commit('setAccessToken', { accessToken: response.data.data.accessToken });
			store.commit('setPhoneNumber', { phoneNumber: phoneNumber.value });
			store.commit('setMyData', { data: response.data.data });

			if (response.data.data.wallet.address == '') {
				createWallet();
			} else {
				getMiningInfo();
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const requestReLogin = () => {
	http
		.post('/auth/relogin', {})
		.then(response => {
			console.log(response);

			store.commit('setMyData', { data: response.data.data });

			if (response.data.data.wallet.address == '') {
				createWallet();
			} else {
				getMiningInfo();
			}
		})
		.catch(error => {
			// popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
			store.state.isLoading = false;
		});
};

const getMiningInfo = () => {
	http
		.get('/api/miningInfo', {
			params: {}
		})
		.then(response => {
			console.log(response);

			store.commit('setMiningInfo', response.data);

			getNoticeInfos();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

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

			router.push('/play');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const createWallet = () => {
	let myData = store.getters['getMyData'];

	http
		.post('/users/wallet', {
			dbcPassword: 'user_' + myData.uid
		})
		.then(response => {
			console.log(response);

			myData.wallet.address = response.data.data.address;
			myData.wallet.dbcAddress = response.data.data.dbcAddress;
			console.log(myData);
			store.commit('setMyData', { data: myData });

			getMiningInfo();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.line {
	background: #c9d8f5;
}
</style>
