<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<div @click="goBack" class="w-[15%] cursor-pointer"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">{{ $t('word.myInfo') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-3"></div>
		<div class="px-8 w-full overflow-y-auto">
			<template v-if="showMode == 'USER'">
				<div class="h-5"></div>
				<div>{{ $t('word.name') }}</div>
				<div class="h-2"></div>
				<input v-model="name" type="text" class="w-full h-11 text-sm text-black g-input-white" readonly />
				<div class="h-5"></div>
				<div>{{ $t('word.loginId') }}</div>
				<div class="h-2"></div>
				<input v-model="loginId" type="text" class="w-full h-11 text-sm text-black g-input-white" readonly />
				<div class="h-5"></div>
				<div>{{ $t('word.emailAddress') }}</div>
				<div class="h-2"></div>
				<input v-model="email" type="text" class="w-full h-11 text-sm text-black g-input-white" readOnly />
			</template>
			<template v-if="showMode == 'STORE'">
				<div class="h-5"></div>
				<div>{{ $t('word.payQrcode') }}</div>
				<div class="h-10"></div>
				<div v-if="store.state.storeOwnerId > 0" class="w-full flex justify-center items-center">
					<div v-if="address != ''" class="p-2 flex justify-center items-center qrcode">
						<div class="p-1 qrcode-bg">
							<QRCodeVue3
								:dotsOptions="{ type: 'square', color: '#000000' }"
								:cornersSquareOptions="{ type: 'square', color: '#000000' }"
								:cornersDotOptions="{ type: 'square', color: '#000000' }"
								:value="payData"
							/>
						</div>
					</div>
				</div>
			</template>
			<div class="h-20"></div>
			<div v-if="store.state.storeOwnerId > 0" class="w-full flex justify-around items-center">
				<div v-if="showMode == 'USER'" class="w-32 h-10 flex justify-center items-center text-sm g-btn-color" @click="changeMode('STORE')">
					QR Code
				</div>
				<div v-if="showMode == 'STORE'" class="w-32 h-10 flex justify-center items-center text-sm g-btn-color" @click="changeMode('USER')">
					{{ $t('word.myInfo') }}
				</div>
				<div class="w-36 h-10 flex justify-center items-center text-sm g-btn-color" @click="router.push('/sales')">
					{{ $t('word.salesList') }}
				</div>
			</div>
			<div v-else class="w-full flex justify-center items-center">
				<div class="w-64 h-10 flex justify-center items-center text-sm g-btn-color" @click="router.push('/setting')">
					{{ $t('word.check') }}
				</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import QRCodeVue3 from 'qrcode-vue3';
import MainModal from '@/components/MainModal.vue';
import { useI18n } from 'vue-i18n';
import { checkError, escapeUnicode } from '@/utils/util';

const { t } = useI18n();

const myData = reactive(store.getters['getMyData']);
const tokenInfos = store.getters['getTokenInfos'];
const mySymbol = 'BEDR';
const address = ref('');

const showMode = ref('USER');
const storeName = ref('');
const name = ref(myData['name']);
const loginId = store.state.phoneNumber;
const email = ref(myData['email']);

const payData = ref();

onMounted(() => {
	if (tokenInfos[mySymbol].chainId == 'TRON') {
		address.value = myData.wallet.tronAddress;
	} else {
		address.value = myData.wallet.address;
	}

	if (store.state.storeOwnerId > 0) {
		getStoreInfo();
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

const changeMode = mode => {
	showMode.value = mode;
};

const updateMyInfo = () => {
	http
		.post('/users/profile', {
			name: name.value,
			email: email.value
		})
		.then(response => {
			console.log(response);

			myData['name'] = name.value;
			myData['email'] = email.value;

			store.commit('setMyData', {
				data: myData
			});

			router.push('/setting');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getStoreInfo = () => {
	http
		.get('/pay/storeOwner', {
			params: {}
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				let res = response.data.data;

				storeName.value = res.name;
				payData.value =
					'{"type":"pay","shopId":"' +
					res.sid +
					'","shopAddress":"' +
					address.value +
					'", "shopCountry":"' +
					res.country +
					'","shopName":"' +
					escapeUnicode(res.name) +
					'"}';
				console.log(payData.value);
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const goBack = () => {
	router.push('/' + store.state.mainPage);
};
</script>

<style scoped>
.input-no-border {
	border: none !important;
	box-shadow: 0px !important;
	background: transparent !important;
}

.line {
	background: #c9d8f5;
}

.qrcode {
	max-width: 250px;
	border-radius: 6px;
	border: 2px solid #0b0f27;
	background: #0b0f27;
}

.qrcode-bg {
	background: #ffffff;
}
</style>
