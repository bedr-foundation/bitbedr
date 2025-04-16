<template>
	<header>
		<div class="h-20"></div>
		<div class="h-6"></div>
		<div><img src="@/assets/images/logo.svg" /></div>
		<div class="h-16"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="px-8 w-full login-box">
				<div class="h-8"></div>
				<div class="text-2xl text-center">{{ $t('word.login') }}</div>
				<div class="h-1"></div>
				<div class="text-center">{{ $t('word.welcome') }}</div>
				<div class="h-8"></div>
				<div>{{ $t('word.lang') }}</div>
				<div class="h-1"></div>
				<div>
					<select v-model="langType" @change="changeLocale" class="w-full h-11 text-xs px-5">
						<option v-for="lo in locales" :key="lo.name" :value="lo.name">{{ lo.label }}</option>
					</select>
				</div>
				<div class="h-6"></div>
				<div class="h-1"></div>
				<div>{{ $t('word.loginId') }}</div>
				<input
					v-model="account"
					type="text"
					class="px-5 w-full h-11 text-sm text-black g-input-white"
					:placeholder="$t('word.loginId')"
					@keyup.enter="checkLogin"
				/>
				<div class="h-3"></div>
				<div>{{ $t('word.password') }}</div>
				<div class="h-1"></div>
				<div class="relative">
					<input
						v-model="passwd"
						v-bind:type="[showPassword ? 'text' : 'password']"
						class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
						:placeholder="$t('word.password')"
						@keyup.enter="checkLogin"
					/>
					<div class="flex absolute inset-y-0 right-0 items-center pl-3">
						<div class="pr-3" @click="showPassword = !showPassword">
							<div v-if="showPassword == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
							<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
						</div>
					</div>
				</div>
				<div class="h-2"></div>
				<div class="w-full flex justify-between items-center">
					<router-link :to="'findId'" class="text-xs">{{ $t('word.loginIdFind') }} ></router-link>
					<router-link :to="'findPass'" class="text-xs">{{ $t('word.passwordFind') }} ></router-link>
				</div>
				<div class="h-12"></div>
				<div @click="checkLogin" class="h-12 flex justify-center items-center text-sm g-btn-none">{{ $t('word.login') }}</div>
				<div class="h-3"></div>
				<router-link :to="'join'" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.join') }} </router-link>
				<div class="h-8"></div>
				<div v-if="store.state.appVersion != ''">
					<div class="text-center text-xs text-[#172C6B]">Version {{ store.state.appVersion }}</div>
					<div class="h-6"></div>
				</div>
			</div>
			<div class="h-8"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError } from '@/utils/util';
import { locales } from '@/config/constants/locale';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const langType = ref(store.state.locale);
const account = ref(store.state.phoneNumber);
const passwd = ref('');

const showPassword = ref(false);

onMounted(() => {
	store.commit('setClear');

	if (store.state.platform == 'Android' || store.state.platform == 'iOS') {
		if (store.state.accessToken != '') {
			requestReLogin();
		}
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

const changeLocale = () => {
	if (langType.value != '' && store.state.locale != langType.value) {
		store.commit('setLocale', { lang: langType.value });
		locale.value = langType.value;
	}
};

const checkLogin = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.Keyboard.close();
	} else {
		document.activeElement.blur();
	}

	if (account.value == '') {
		popupMsg.value = t('message.inputLoginId');
	} else if (passwd.value == '') {
		popupMsg.value = t('message.inputPassword');
	} else {
		requestLogin();
	}
};

const requestLogin = () => {
	http
		.post('/auth/login', {
			account: account.value,
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			if (store.state.device == 'Mobile') {
				window.plugins.OneSignal.default.login(account.value);
			}

			store.commit('setAccessToken', { accessToken: response.data.data.accessToken });
			store.commit('setPhoneNumber', { phoneNumber: account.value });
			store.commit('setMyData', { data: response.data.data });

			if (response.data.data.wallet.address == '') {
				createWallet();
			} else {
				getNoticeInfos();
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
				getNoticeInfos();
			}
		})
		.catch(error => {
			// popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
			store.state.isLoading = false;
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

			getSwapList();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
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

			getStoreOwner();
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
			myData.wallet.tronAddress = response.data.data.tronAddress;
			store.commit('setMyData', { data: myData });

			getNoticeInfos();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getStoreOwner = () => {
	http
		.get('/pay/storeOwner', {
			params: {}
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				store.commit('setStoreOwnerId', { idx: response.data.data.sid });
			} else {
				store.commit('setStoreOwnerId', { idx: 0 });
			}

			if (store.state.paymentKey != '') {
				getTkTokenInfos();
			} else {
				if (store.state.platform == 'Android' || store.state.platform == 'iOS') {
					window.bgColor = '#FFFFFF';
					window.plugins.getAppVersion.setBgColor();
				}

				router.push('/play');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getTkTokenInfos = () => {
	http
		.get('/api/tokenInfos', {
			params: {}
		})
		.then(response => {
			console.log(response);

			store.state.isLoading = true;

			const resData = response.data.data;
			let scannerInfos = {};
			let tmpTokenInfos = {};
			let tmpExchangeInfos = {};

			resData.exchange.forEach(res => {
				tmpExchangeInfos[res.currency] = res;
			});

			resData.tokenInfos.forEach(res => {
				tmpTokenInfos[res.symbol] = res;
			});

			resData.scanner.forEach(res => {
				scannerInfos[res.chainId] = res;
			});

			store.commit('setExchangeInfos', {
				data: tmpExchangeInfos
			});

			store.commit('setTokenInfos', {
				data: tmpTokenInfos
			});

			store.commit('setScannerInfos', {
				data: scannerInfos
			});

			getTkPoint();
		});
	/* 		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		}) */
};

const getTkPoint = () => {
	let myData = store.getters['getMyData'];

	http
		.get('/token/balancePoint', {
			params: {}
		})
		.then(response => {
			console.log(response);

			store.state.isBalanceUpdate = false;
			store.state.refreshTime = new Date();

			let res = response.data.data.balances;

			for (let key in res) {
				let curSymbol = res[key].symbol;

				myData[curSymbol] = res[key].balance;
			}

			store.commit('setMyData', {
				data: myData
			});

			router.replace('/onlinePay');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.login-box {
	border-radius: 30px;
	background: #ebf0f5;
}
</style>
