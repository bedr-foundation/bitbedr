<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]"></div>
			<div class="grow text-center">Receipt</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div v-if="payData != undefined" class="px-5 w-full receipt-box">
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
					<div v-if="payData.type == 0 && payData.status < 10" class="w-full flex justify-center items-center">
						<div v-if="cancelData != ''" class="p-3 flex justify-center items-center qrcode">
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
			<div class="w-full flex justify-center items-center">
				<div class="w-64 h-10 flex justify-center items-center text-sm g-btn-color" @click="goClose">
					{{ $t('word.check') }}
				</div>
			</div>
			<div class="h-10"></div>
			<div class="h-10"></div>
			<div class="h-10"></div>
		</div>
		<div class="h-10"></div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"> </MainModal>
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
	if (store.state.paymentRid == '') {
		router.push('/login');
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

const goClose = () => {
	store.commit('setPaymentStatus', { key: 'CLOSE' });
	// window.close();

	window.opener.postMessage('closeWindow', '*');
};

const getReceiptDetail = () => {
	let url = '';
	let params = {};

	url = '/pay/receiptDetail';

	params = {
		rid: store.state.paymentRid
	};

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
</script>

<style scoped>
.receipt-box {
	border-radius: 6px;
	background: #ffffff;
}

.receipt-line {
	border: 1px dashed #000000;
}

.refund-btn {
	border-radius: 6px;
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
