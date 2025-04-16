<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="goBack"><img src="@/assets/images/btn_close.svg" /></div>
			<div v-if="store.state.shopType == 'info'" class="grow text-center">Sales</div>
			<div v-else class="grow text-center">Receipt</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div v-if="payData != undefined" class="px-5 w-full g-list-box">
				<div class="h-6"></div>
				<div class="text-xl">{{ $t('word.paymentAmount') }} ({{ exchangeList[payData.currency - 1] }})</div>
				<div class="h-2"></div>
				<div class="w-full flex justify-center items-center text-xs g-gray">
					<div>{{ $t('word.payTime') }}</div>
					<div class="grow"></div>
					<div>{{ getShowDate(payData.createdAt) }}</div>
				</div>
				<template v-if="store.state.shopType != 'info'">
					<div class="h-5"></div>
					<div v-if="payData.memo != ''" class="text-center">{{ payData.memo }}</div>
					<div v-else class="text-center">{{ $t('word.storeName') }} : {{ payData.sid_store.name }}</div>
				</template>
				<div class="h-5"></div>
				<div class="text-center text-3xl">{{ payData.price }}</div>
				<div class="h-3"></div>
				<div class="text-right">{{ store.state.payName }}</div>
				<div class="h-1"></div>
				<div class="h-px g-line"></div>
				<div class="h-5"></div>
				<div class="text-sm">{{ $t('word.purchaseInfomation') }}</div>
				<div class="h-3"></div>
				<div class="flex justify-center items-center text-xs g-gray">
					<div>{{ $t('word.paymentAmount') }} ({{ exchangeList[payData.currency - 1] }})</div>
					<div class="grow"></div>
					<div>{{ payData.price }}</div>
				</div>
				<div class="h-3"></div>
				<div class="flex justify-center items-center text-xs g-gray">
					<div>{{ store.state.payName }}</div>
					<div class="grow"></div>
					<div>{{ payData.payValue }}</div>
				</div>
				<div class="h-1"></div>
				<div class="flex justify-center items-center text-xs g-gray">
					<div>{{ $t('word.paymentStatus') }}</div>
					<div class="grow"></div>
					<template v-if="payData.status >= 10">
						<div>{{ $t('word.refundOrder') }}</div>
						<div class="ml-3"><img src="@/assets/images/icon_refund.svg" /></div>
					</template>
					<template v-else>
						<div>{{ $t('word.complete') }}</div>
						<div class="ml-3"><img src="@/assets/images/icon_complete.svg" /></div>
					</template>
				</div>
				<div class="h-1"></div>
				<div class="flex justify-center items-start text-xs g-gray">
					<div class="w-5">ID</div>
					<div class="w-5"></div>
					<div class="grow break-all">{{ payData.txId }}</div>
				</div>
				<template v-if="store.state.shopType != 'info'">
					<div class="h-5"></div>
					<div class="h-px receipt-line"></div>
					<div class="h-5"></div>
					<div class="text-sm">{{ $t('word.sellerInformation') }}</div>
					<div class="h-3"></div>
					<div class="flex justify-center items-center text-xs g-gray">
						<div>{{ $t('word.storeName') }}</div>
						<div class="grow"></div>
						<div>{{ payData.sid_store.name }}</div>
					</div>
					<div class="h-3"></div>
					<div class="flex justify-center items-center text-xs g-gray">
						<div class="w-20">{{ $t('word.orderNumber') }}</div>
						<div class="w-5"></div>
						<div class="grow break-all">{{ payData.idx }}</div>
					</div>
					<div class="h-5"></div>
					<div class="h-px g-line"></div>
					<div class="h-5"></div>
					<div v-if="payData.status < 10" class="w-full flex justify-center items-center">
						<div v-if="payData.type == 1" class="p-3 text-center">{{ $t('message.onlineRefundError') }}</div>
						<div v-else-if="cancelData != ''" class="p-3 flex justify-center items-center qrcode">
							<div class="p-2 qrcode-bg">
								<QRCodeVue3
									:dotsOptions="{ type: 'square', color: '#000000' }"
									:cornersSquareOptions="{ type: 'square', color: '#000000' }"
									:cornersDotOptions="{ type: 'square', color: '#000000' }"
									:value="cancelData"
								/>
							</div>
						</div>
					</div>
				</template>
				<div class="h-5"></div>
			</div>
			<div v-if="refundError == true" class="p-5 w-full receipt-box">
				<div class="text-center">{{ $t('message.refundError') }}</div>
			</div>
			<div class="h-10"></div>
			<div v-if="store.state.shopType == 'info'" class="w-full flex justify-around items-center">
				<div class="w-32 h-10 flex justify-center items-center text-sm g-btn-color" @click="goBack">
					{{ $t('word.check') }}
				</div>
				<div class="w-32 h-10 flex justify-center items-center text-sm refund-btn" @click="showModal">
					{{ $t('word.refundOrder') }}
				</div>
			</div>
			<div v-else class="w-full flex justify-center items-center">
				<div class="w-64 h-10 flex justify-center items-center text-sm g-btn-color" @click="goBack">
					{{ $t('word.check') }}
				</div>
			</div>
			<div class="h-3"></div>
			<div class="text-[#9C9C9C] text-xs text-center">© {{ store.state.payName }}</div>
		</div>
		<div class="h-10"></div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
		<div class="h-6"></div>
		<div class="text-center font-normal">{{ $t('message.checkRefund') }}</div>
		<div class="h-8"></div>
		<div class="w-full flex justify-center items-center">
			<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-none-s" @click="hideModal">{{ $t('word.cancel') }}</div>
			<div class="w-10"></div>
			<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="startRefund">{{ $t('word.check') }}</div>
		</div>
		<div class="h-6"></div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import QRCodeVue3 from 'qrcode-vue3';
import MainModal from '@/components/MainModal.vue';
import { getShowDate, showToast, checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const payData = ref();
const cancelData = ref('');
const refundError = ref(false);

const exchangeInfos = store.getters['getExchangeInfos'];
const exchangeList = ref([]);

onMounted(() => {
	if (store.state.refundId == '') {
		router.push('/detail');
	}

	for (let key in exchangeInfos) {
		exchangeList.value.push(key);
	}

	getReceiptDetail();
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
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ====================

const goBack = () => {
	if (store.state.mySymbol == '') {
		router.push('play');
	} else {
		router.push('/detail');
	}
};

const getReceiptDetail = () => {
	let url = '';
	let params = {};

	if (store.state.shopType == 'info') {
		url = '/pay/saleDetail';

		params = {
			storeId: store.state.storeOwnerId,
			rid: store.state.refundId
		};
	} else {
		url = '/pay/receiptDetail';

		params = {
			rid: store.state.refundId
		};
	}

	http
		.get(url, {
			params
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 0) {
				store.state.shopType = '';

				refundError.value = true;
			} else {
				payData.value = response.data.data;
				cancelData.value = '{"type": "info", "paymentId": "' + response.data.data.idx + '", "storeId": ' + response.data.data.sid + '}';
			}
		})
		.catch(error => {
			console.log(error);
		});
};

const startRefund = () => {
	let url = '';
	let params = {};

	if (payData.value.type == 1) {
		url = '/pay/online/cancel';

		params = {
			sid: payData.value.sid,
			tid: payData.value.orderId,
			currency: exchangeList[payData.value.currency - 1],
			cancel_amount: payData.value.price
		};
	} else {
		url = '/pay/sale/cancel';

		params = {
			sid: payData.value.sid,
			rid: payData.value.idx,
			memo: ''
		};
	}

	http
		.post(url, params)
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				store.state.isBalanceUpdate = true;

				showToast(t('message.refundSuccess'));

				router.push('/play');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.receipt-line {
	border: 1px dashed #000000;
}

.refund-btn {
	border-radius: 30px;
	background: #f93968;
	color: #ffffff;
}

.qrcode {
	max-width: 150px;
	border-radius: 6px;
	border: 2px solid #f93968;
	background: #f93968;
}

.qrcode-bg {
	background: #ffffff;
}
</style>
