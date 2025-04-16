<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]"></div>
			<div class="grow text-center">Payment</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="px-8 w-full">
			<div class="w-full h-[74px] flex justify-center items-center text-white tkpay-box">
				<div class="h-2"></div>
				<div class="px-2 w-full flex items-center font-normal">
					<div class="w-[4%]"></div>
					<div class="flex justify-center items-center g-wallet-border"><img class="g-wallet-icon" :src="detailInfo.icon" /></div>
					<div class="pl-2 text-xl">{{ detailInfo.name }}</div>
					<div class="grow"></div>
					<div class="ml-2 mt-px flex flex-col items-end text-xl">
						<div v-if="myData[mySymbol] != undefined">
							{{ setDecimals(balance, detailInfo.decimals) }}
						</div>
						<div v-else>0</div>
						<div v-if="myData[mySymbol] != undefined" class="text-xs">
							{{ currency }}
							<template v-for="exchange in exchangeInfos" :key="exchange.currency">
								<template v-if="exchange.currency == currency">
									{{ setDecimals(balance * detailInfo.price * exchange.price, detailInfo.priceDecimals) }}
								</template>
							</template>
						</div>
						<div v-else class="text-xs">0</div>
					</div>
					<div class="w-[4%]"></div>
				</div>
			</div>
			<div class="h-3"></div>
			<div class="store-box">
				<template v-if="store.state.paymentStatus != ''">
					<div class="p-5">{{ $t('message.onlinePayError') }}</div>
				</template>
				<template v-else-if="onlineInfo != undefined">
					<template v-if="onlineInfo.status == 0">
						<div class="pt-5 px-5">Store Name : {{ onlineInfo.sid_store.name }}</div>
						<div class="pt-2 pb-5 px-5">{{ onlineInfo.itemName }}</div>
					</template>
					<template v-else>
						<div class="p-5">{{ $t('message.onlinePayError') }}</div>
					</template>
				</template>
			</div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div class="h-6"></div>
			<div v-if="store.state.paymentStatus == '' && onlineInfo != undefined && onlineInfo.status == 0" class="px-8">
				<div class="h-2"></div>
				<div>{{ $t('word.amountOfPayment') }}</div>
				<div class="h-1"></div>
				<div class="flex">
					<div class="grow">
						<input type="number" v-model.number="amount" class="w-full h-11 text-right text-black" readonly />
					</div>
					<div class="pl-2 w-28">
						<div class="h-11 flex justify-center items-center text-sm g-btn-color">
							<div v-if="onlineInfo != undefined && store.state.paymentKey != ''">{{ currency }}</div>
						</div>
					</div>
				</div>
				<div class="h-5"></div>
				<div>{{ mySymbol }}</div>
				<div class="h-1"></div>
				<input v-model="tkpay" type="text" class="w-full h-11 text-right g-gray" readOnly />
				<div class="h-1"></div>
				<input v-model="tkpoint" type="text" class="w-full h-11 text-right g-gray" readOnly />
				<div class="h-10"></div>
				<div class="h-5"></div>
				<div class="w-full flex justify-center items-center">
					<div
						v-if="amount > 0 && tkpay > 0 && balance >= parseFloat(tkpay.replace(/,/g, ''))"
						@click="startOnlineApprove"
						class="w-64 h-10 flex justify-center items-center text-sm g-btn-color"
					>
						{{ $t('word.purchase') }}
					</div>
					<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.purchase') }}</div>
				</div>
				<div class="h-5"></div>
			</div>
			<div v-else class="px-8">
				<div class="h-10"></div>
				<div class="h-5"></div>
				<div class="w-full flex justify-center items-center">
					<div @click="closePay" class="w-64 h-10 flex justify-center items-center text-sm g-btn-color">
						{{ $t('word.check') }}
					</div>
				</div>
				<div class="h-5"></div>
			</div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div v-if="popupParam == 'currency'" class="w-full">
			<SelectCurrency @updateCurrency="hideModal" />
		</div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import SelectCurrency from '@/components/SelectCurrency.vue';
import { setDecimals, checkError, showToast } from '@/utils/util';
import openCrypto from '@/utils/openCrypto';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mySymbol = store.state.payName;
const tokenInfos = store.getters['getTokenInfos'];
const exchangeInfos = store.getters['getExchangeInfos'];
const detailInfo = tokenInfos[mySymbol];
const myData = store.getters['getMyData'];
const balance = myData[mySymbol];

const popupParam = ref('');
const amount = ref('');
const tkpay = ref('');
const tkpoint = ref('');

const onlineInfo = ref();
const currency = ref('');

onMounted(() => {
	if (store.state.paymentStatus != '') {
		store.commit('setPaymentKey', { key: 'END' });
	} else if (store.state.paymentKey != '') {
		getOnlineInfo();
	}

	let paymentInfo = JSON.parse(openCrypto.decode(decodeURIComponent(store.state.paymentKey)));
	currency.value = paymentInfo.currency;
});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	popupMsg.value = '';
	visible.value = false;

	updateAmount();
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const showPopup = type => {
	if (store.state.paymentKey != '') {
		return false;
	}

	popupParam.value = type;

	showModal();
};

const updateAmount = () => {
	if (amount.value > 0) {
		tkpay.value = setDecimals(amount.value / exchangeInfos[currency.value].price, detailInfo.decimals);
		tkpoint.value = setDecimals((amount.value / exchangeInfos[currency.value].price) * 0.3, tokenInfos[store.state.payName].decimals);
	}
};

const getOnlineInfo = () => {
	let paymentInfo = JSON.parse(openCrypto.decode(decodeURIComponent(store.state.paymentKey)));
	console.log(paymentInfo);

	http
		.get('pay/online/info', {
			params: {
				tid: paymentInfo.tid
			}
		})
		.then(response => {
			console.log(response);

			if (response.data.data.status == 0) {
				onlineInfo.value = response.data.data;
				amount.value = onlineInfo.value.totalAmount;
			} else {
				store.commit('setPaymentKey', { key: 'END' });
				store.commit('setPaymentStatus', { key: 'CLOSE' });
			}

			updateAmount();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const startOnlineApprove = () => {
	let paymentInfo = JSON.parse(openCrypto.decode(decodeURIComponent(store.state.paymentKey)));

	http
		.post('/pay/online/approve', {
			storeId: paymentInfo.storeId,
			tid: paymentInfo.tid,
			partnerOrderId: onlineInfo.value.partnerOrderId,
			partnerUserId: onlineInfo.value.partnerUserId,
			currency: paymentInfo.currency,
			totalAmount: onlineInfo.value.totalAmount
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				showToast(t('message.paymentSuccess'));

				store.commit('setPaymentRid', { rid: response.data.data.paymentId });
				store.commit('setPaymentKey', { key: 'OK' });
				store.commit('setPaymentStatus', { key: 'NEXT' });

				// 부모창에 결제 완료 전달
				window.opener.postMessage({ paymentId: response.data.data.paymentId }, onlineInfo.value.callbackDomain);

				router.replace('/onlineReceipt');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const closePay = () => {
	store.commit('setPaymentKey', { key: 'END' });
	store.commit('setPaymentStatus', { key: 'CLOSE' });
	// window.close();

	window.opener.postMessage('closeWindow', '*');
};
</script>

<style scoped>
.tkpay-box {
	background-color: #0b0f27;
	background-size: cover;
	border-radius: 12px;
}

.store-box {
	background: linear-gradient(90deg, #f1c7c7 0%, #f7e3d8 100%);
	border: 1px solid #ffffff;
	box-shadow: 0px 4px 8px #e9d6d3;
	border-radius: 6px;
}

.wallet-border {
	/* background: #ffffff;
	border: 1px solid #bcbcbc;
	border-radius: 50%; */
	width: 30px;
	height: 30px;
}

.wallet-icon {
	width: 30px;
	height: 30px;
	flex-shrink: 0;
}
</style>
