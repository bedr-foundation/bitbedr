<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="router.push('/sales')"><img src="@/assets/images/btn_close.svg" /></div>
			<div class="grow text-center">Sale</div>
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
				<div class="h-5"></div>
				<div v-if="payData.memo != ''">
					<div class="text-center">{{ payData.memo }}</div>
					<div class="h-5"></div>
				</div>
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
				<div class="h-5"></div>
			</div>
			<div class="h-10"></div>
			<div class="w-full flex justify-center items-center">
				<div class="w-64 h-10 flex justify-center items-center text-sm g-btn-color" @click="router.push('/sales')">
					{{ $t('word.check') }}
				</div>
			</div>
			<div class="h-3"></div>
			<div class="text-[#9C9C9C] text-xs text-center">© {{ store.state.payName }}</div>
		</div>
		<div class="h-10"></div>
	</main>
	<footer></footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import { getShowDate, checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const payData = ref();

const exchangeInfos = store.getters['getExchangeInfos'];
const exchangeList = ref([]);

onMounted(() => {
	for (let key in exchangeInfos) {
		exchangeList.value.push(key);
	}

	getReceiptDetail();
});

const getReceiptDetail = () => {
	let url = '';
	let params = {};

	url = '/pay/saleDetail';

	params = {
		storeId: store.state.storeOwnerId,
		rid: store.state.salesIdx
	};

	http
		.get(url, {
			params
		})
		.then(response => {
			console.log(response);

			payData.value = response.data.data;
		})
		.catch(error => {
			console.log(error);
		});
};
</script>

<style scoped>
.receipt-line {
	border: 1px dashed #000000;
}
</style>
