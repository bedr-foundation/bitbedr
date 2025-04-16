<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'myInfo'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">Sales</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-6"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div v-for="sales in salesList" :key="sales.idx" class="g-list-box">
				<div class="px-5 py-2 flex flex-col justify-center items-center font-normal" @click="goSalesDetail(sales.idx)">
					<div class="w-full flex justify-center items-center">
						<div class="flex flex-col">
							<div>{{ storeInfo.name }}</div>
							<div class="text-sm g-gray">{{ getShowTime(sales.createdAt) }}</div>
						</div>
						<div class="grow"></div>
						<div class="flex flex-col justify-center items-end">
							<div>{{ sales.price }} {{ exchangeList[sales.currency - 1] }} ></div>
							<div v-if="sales.status >= 10"><img src="@/assets/images/icon_refund.svg" /></div>
							<div v-else><img src="@/assets/images/icon_complete.svg" /></div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="salesList == null || Object.keys(salesList) == 0">
				<div class="px-8 py-2 flex flex-col justify-center items-center font-normal">
					<div class="h-3"></div>
					<div class="w-full flex justify-center items-center">
						{{ $t('message.notFoundSellList') }}
					</div>
				</div>
			</div>
			<div class="h-5"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full footer-main"></footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import { getShowTime } from '@/utils/util';

const storeInfo = ref();
const salesList = ref();

const exchangeInfos = store.getters['getExchangeInfos'];
const exchangeList = ref([]);

onMounted(() => {
	for (let key in exchangeInfos) {
		exchangeList.value.push(key);
	}

	getSalesList();
});

const getSalesList = () => {
	let url = '';
	let params = {};

	url = '/pay/sales';

	params = {
		storeId: store.state.storeOwnerId
	};

	http
		.get(url, {
			params
		})
		.then(response => {
			console.log(response);

			storeInfo.value = response.data.data.store;
			salesList.value = response.data.data.sales;
			console.log(salesList.value);
		})
		.catch(error => {
			console.log(error);
		});
};

const goSalesDetail = idx => {
	store.commit('setSalesIdx', { idx });

	router.push('/salesDetail');
};
</script>

<style scoped>
.notice-box {
	border-radius: 2px;
	background: #fff;
}
</style>
