<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'play'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div v-if="detailInfo.symbol == store.state.payName" class="grow text-center">{{ detailInfo.name }}</div>
			<div v-else class="grow text-center">Detail</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-7"></div>
		<div class="px-8 font-normal">
			<div class="w-full text-white top1">
				<div class="h-5"></div>
				<div class="px-8 flex justify-center items-center">
					<div class="text-sm">{{ $t('word.evaluationAmount') }} ({{ store.state.currency }})</div>
					<div class="grow text-right">
						{{
							setDecimals((balance + lockUpCount) * detailInfo.price * exchangeInfos[store.state.currency].price, detailInfo.priceDecimals)
						}}
					</div>
				</div>
				<div class="h-3"></div>
				<div class="px-8 flex justify-center items-center">
					<div class="text-sm">{{ $t('word.ownQuantity') }}</div>
					<div class="grow text-xl text-right">{{ setDecimals(balance, detailInfo.decimals) }}</div>
				</div>
				<template v-if="isblockUser == false && lockupCheck == true">
					<div class="h-3"></div>
					<div class="px-8 flex justify-center items-center">
						<div class="text-sm">{{ $t('word.lockUpCount') }}</div>
						<div class="grow text-xl text-right">{{ setDecimals(lockUpCount, detailInfo.decimals) }}</div>
					</div>
				</template>
				<div class="h-3"></div>
				<div class="w-full text-black font-medium top2">
					<div class="h-5"></div>
					<div class="px-5 flex justify-around items-center">
						<div v-if="isblockUser == false && !isEmpty(swapList[mySymbol])" class="w-42 flex flex-col justify-center items-center">
							<router-link :to="'swap'"><img src="@/assets/images/btn_swap.svg" /></router-link>
							<div class="pt-2 text-sm">Swap</div>
						</div>
						<div v-if="detailInfo.hideSend == false" class="w-42 flex flex-col justify-center items-center">
							<router-link :to="'send'"><img src="@/assets/images/btn_send.svg" /></router-link>
							<div class="pt-2 text-sm">Send</div>
						</div>
						<div v-if="detailInfo.hideReceive == false" class="w-42 flex flex-col justify-center items-center">
							<router-link :to="'address'"><img src="@/assets/images/btn_receive.svg" /></router-link>
							<div class="pt-2 text-sm">Receive</div>
						</div>
						<div v-if="isblockUser == false && lockupCheck == true" class="w-42 flex flex-col justify-center items-center">
							<router-link :to="'lockup'"><img src="@/assets/images/btn_lockup.svg" /></router-link>
							<div class="pt-2 text-sm">Lock-up</div>
						</div>
					</div>
					<div class="h-3"></div>
				</div>
				<div v-if="detailInfo.symbol == '_PAY'" class="px-8 py-3 w-full flex flex-col justify-center items-center">
					<div class="w-full text-sm font-normal">{{ $t('word.memberProfit') }}</div>
					<div class="h-3"></div>
					<div class="w-full flex justify-around items-center">
						<div class="text-sm">
							{{ myData['rollup']['period'].toString().substring(0, 4) }}.{{ myData['rollup']['period'].toString().substring(4, 6) }}
						</div>
						<div class="grow text-xl text-right">{{ setDecimals(myData['rollup']['amount']) }}</div>
					</div>
				</div>
			</div>
			<div class="h-3"></div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div v-if="detailInfo.type != 'P'" class="px-8">
				<div class="w-full top3">
					<div class="h-5"></div>
					<div class="flex justify-center items-center">
						<div class="flex justify-center items-center g-wallet-border"><img class="g-wallet-icon" :src="detailInfo.icon" /></div>
						<div class="ml-2">{{ detailInfo.name }}</div>
						<div class="pt-1 ml-1 text-xs font-normal g-gray">({{ detailInfo.chainId }})</div>
					</div>
					<div class="h-3"></div>
					<div class="text-center text-xs font-normal">
						<div v-if="rate >= 0">
							<div>
								<span>${{ setDecimals(price) }}</span>
								<span class="g-red"> (+{{ setDecimals(rate, detailInfo.priceDecimals) }}%)</span>
							</div>
							<div>
								<span>￦{{ setDecimals(price * exchangeInfos['KRW'].price, 2) }}</span>
								<span class="g-red"> (+{{ setDecimals(rate, detailInfo.priceDecimals) }}%)</span>
							</div>
						</div>
						<div v-else>
							<div>
								<span>${{ setDecimals(price) }}</span>
								<span class="g-blue"> ({{ setDecimals(rate, detailInfo.priceDecimals) }}%)</span>
							</div>
							<div>
								<span>￦{{ setDecimals(price * exchangeInfos['KRW'].price, 2) }}</span>
								<span class="g-blue"> ({{ setDecimals(rate, detailInfo.priceDecimals) }}%)</span>
							</div>
						</div>
					</div>
					<apexCharts :options="chartOptions" :series="series" class="w-full text-black"></apexCharts>
					<div class="h-5"></div>
				</div>
				<div class="h-3"></div>
				<div class="px-2 flex justify-around items-center font-normal">
					<div
						@click="getChartData(1)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[chartType == 1 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						1Day
					</div>
					<div
						@click="getChartData(2)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[chartType == 2 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						1Month
					</div>
					<div
						@click="getChartData(3)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[chartType == 3 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						6Month
					</div>
					<div
						@click="getChartData(4)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[chartType == 4 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						1Year
					</div>
				</div>
			</div>
			<div class="h-10"></div>
			<div v-if="mySymbol == store.state.payName" class="px-5 w-full flex justify-around items-center">
				<div
					class="w-40 h-10 flex justify-center items-center"
					:class="[historyMode == 'TR' ? 'on-list' : 'off-list']"
					@click="changeHistoryMode('TR')"
				>
					{{ $t('word.transactionList') }}
				</div>
				<div
					class="w-40 h-10 flex justify-center items-center"
					:class="[historyMode == 'PM' ? 'on-list' : 'off-list']"
					@click="changeHistoryMode('PM')"
				>
					{{ $t('word.paymentList') }}
				</div>
			</div>
			<div v-else class="px-5 w-full">
				<div class="text-center">{{ $t('word.transactionList') }}</div>
			</div>
			<div class="h-5"></div>
			<div class="px-8">
				<div class="h-0.5 g-line"></div>
			</div>
			<template v-if="mySymbol != store.state.payName || historyMode == 'TR'">
				<div v-for="history in historyData" :key="history.idx">
					<div class="px-8 py-2 flex flex-col justify-center items-center font-normal">
						<div class="w-full flex justify-center items-center">
							<div v-if="history.from == myAddress" class="g-red font-medium">
								<div v-if="history.method == 10">{{ $t('word.swapWithdraw') }}</div>
								<div v-else>{{ $t('word.withdraw') }}</div>
							</div>
							<div v-else-if="history.to == myAddress" class="g-blue font-medium">
								<div v-if="history.method == 10">{{ $t('word.swapDeposit') }}</div>
								<div v-else>{{ $t('word.deposit') }}</div>
							</div>
							<div v-if="history.status == 99" class="grow text-right text-sm">{{ $t('word.requestCancel') }}</div>
							<div v-else-if="history.status >= 10" class="grow text-right text-sm">{{ $t('word.transmissionError') }}</div>
							<div v-else-if="history.status >= 5" class="grow text-right text-sm">{{ $t('word.complete') }}</div>
							<div v-else-if="history.status >= 2" class="grow text-right text-sm">{{ $t('word.withdrawProcessing') }}</div>
							<div v-else class="grow text-right text-sm">{{ $t('word.withdrawRequest') }}</div>
						</div>
						<div class="h-1"></div>
						<div class="w-full flex justify-center items-center">
							<div class="text-sm">{{ getShowTime(history.createdAt) }}</div>
							<div class="grow text-right">
								<span class="g-red">{{ history.value }}</span>
								<span class="ml-2">{{ history.symbol }}</span>
							</div>
						</div>
						<div class="w-full" v-if="history.txId != '0'">
							<div class="h-2"></div>
							<div class="h-px g-line"></div>
							<div class="h-2"></div>
							<div class="w-full flex justify-center items-start">
								<div v-if="history.method == 10" class="w-20 text-sm">SWAP</div>
								<div v-else class="w-20 text-sm">{{ $t('word.txId') }}</div>
								<div v-if="history.method == 10" class="grow break-all text-xs underline text-right">
									<template v-if="history.txId.substring(0, 5) == 'POINT'">
										<div @click="openSwapInfo(!isEmpty(history.txIdSend) ? history.txIdSend : history.txId)">{{ history.txId }}</div>
									</template>
									<template v-else>
										<div @click="openTxScanner(history.txId)">{{ history.txId }}</div>
									</template>
								</div>
								<div
									v-else-if="history.txId.substring(0, 8) == 'PAYSEND_' || history.txId.substring(0, 10) == 'POINTSEND_'"
									class="grow break-all text-xs underline text-right"
									@click="openPaySendInfo(history)"
								>
									{{ history.txId }}
								</div>
								<div v-else class="grow break-all text-xs underline text-right" @click="openTxScanner(history.txId)">
									{{ history.txId }}
								</div>
							</div>
							<div v-if="history.from == myAddress && history.memo != null && history.memo != ''" class="text-sm">
								<div class="h-5"></div>
								<div class="w-full flex justify-start items-center">
									<div class="w-16">{{ $t('word.memo') }}</div>
									<div class="text-xs">{{ history.memo }}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="px-8">
						<div class="h-0.5 g-line"></div>
					</div>
				</div>
				<div v-if="showMore == true">
					<div class="h-5"></div>
					<div class="flex justify-center items-center">
						<div class="w-20 h-10 flex justify-center items-center g-btn-color" @click="getHistoryData(3)">More</div>
					</div>
				</div>
				<div v-if="historyData == null || Object.keys(historyData).length == 0">
					<div class="px-8 py-2 flex flex-col justify-center items-center font-normal">
						<div class="h-3"></div>
						<div class="w-full flex justify-center items-center">
							{{ $t('message.notFoundTransactionList') }}
						</div>
					</div>
				</div>
			</template>
			<template v-if="mySymbol == store.state.payName && historyMode == 'PM'">
				<div v-for="history in paymentData" :key="history.idx">
					<div class="px-8 py-2 flex flex-col justify-center items-center font-normal" @click="goRefund(history.idx)">
						<div class="w-full flex justify-center items-center">
							<div class="flex flex-col">
								<div>{{ history.sid_store.name }}</div>
								<div class="text-sm g-gray">{{ getShowTime(history.createdAt) }}</div>
							</div>
							<div class="grow"></div>
							<div class="flex flex-col justify-center items-end">
								<div>{{ history.price }} {{ exchangeList[history.currency - 1] }} ></div>
								<div v-if="history.status >= 10"><img src="@/assets/images/icon_refund.svg" /></div>
								<div v-else><img src="@/assets/images/icon_complete.svg" /></div>
							</div>
						</div>
					</div>
					<div class="px-8">
						<div class="h-0.5 g-line"></div>
					</div>
				</div>
				<div v-if="paymentData == null || Object.keys(paymentData).length == 0">
					<div class="px-8 py-2 flex flex-col justify-center items-center font-normal">
						<div class="h-3"></div>
						<div class="w-full flex justify-center items-center">
							{{ $t('message.notFoundPayList') }}
						</div>
					</div>
				</div>
			</template>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div v-if="popupParam == 'swapInfo'" class="w-full">
			<div class="h-3"></div>
			<div class="text-center g-dark-blue">{{ $t('word.swapInfo') }}</div>
			<div class="h-8"></div>
			<div class="w-full flex flex-col justify-center items-center">
				<div class="flex flex-col justify-center items-center">
					<div>{{ swapHistoryData.fromSymbol }} : {{ swapHistoryData.fromValue }}</div>
					<div class="h-3"></div>
					<div>↓</div>
					<div class="h-3"></div>
					<div>{{ swapHistoryData.toSymbol }} : {{ swapHistoryData.toValue }}</div>
				</div>
				<div class="h-10"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="hideModal">{{ $t('word.check') }}</div>
				<div class="h-5"></div>
			</div>
		</div>
		<div v-else-if="popupParam == 'payInfo'" class="w-full">
			<div class="h-3"></div>
			<div class="text-center g-dark-blue">{{ $t('word.transInfo') }}</div>
			<div class="h-8"></div>
			<div class="w-full flex flex-col justify-center items-center">
				<div class="flex flex-col justify-center items-center">
					<div class="break-all">To : {{ paySendData.to }}</div>
					<div class="h-3"></div>
					<div>{{ $t('word.sendAmount') }} : {{ paySendData.value }}</div>
				</div>
				<div class="h-10"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="hideModal">{{ $t('word.check') }}</div>
				<div class="h-5"></div>
			</div>
		</div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { setDecimals, getShowTime, checkError } from '@/utils/util';
import store from '@/store';
import apexCharts from 'vue3-apexcharts';
import { isEmpty } from '@/utils/openCrypto';

const mySymbol = store.state.mySymbol;
const detailInfo = store.getters['getTokenInfos'][mySymbol];
const myData = store.getters['getMyData'];
const swapList = store.getters['getSwapList'];
const balance = myData[mySymbol];
const myAddress = ref();

const lockUpCount = ref(0);

const exchangeInfos = store.getters['getExchangeInfos'];
const exchangeList = ref([]);

const historyMode = ref('PM'); // TR : transaction list, PM : payment list

const price = ref();
const rate = ref();
const chartType = ref(0);
const historyType = ref(0);
const historyData = ref(null);
const paymentData = ref(null);
const swapHistoryData = ref();
const lockupCheck = ref(false);

const paySendData = ref();
const popupParam = ref('');

const isblockUser = ref(false);

const lastPage = ref(0);
const pageLimit = 10;
const showMore = ref(true);

onMounted(() => {
	store.commit('setInit');
	store.state.refundId = '';
	store.state.shopType = '';

	if (store.state.phoneNumber.toLowerCase() == 'tester' || store.state.phoneNumber.toLowerCase() == 'tester@gmail.com') {
		isblockUser.value = true;
	}

	if (detailInfo.chainId == 'TRON') {
		myAddress.value = myData.wallet.tronAddress;
	} else {
		myAddress.value = myData.wallet.address;
	}

	for (let key in exchangeInfos) {
		exchangeList.value.push(key);
	}

	getChartData(1);
	getHistoryData(3);

	if (mySymbol == store.state.payName) {
		getPaymentData();
	}

	checkLockup();
});

const series = ref([
	{
		name: mySymbol,
		data: []
	}
]);

const chartOptions = {
	chart: {
		type: 'line',
		animations: {
			enabled: true
		},
		stacked: false,
		height: 180,
		zoom: {
			type: 'x',
			enabled: false,
			autoScaleYaxis: true
		},
		toolbar: {
			show: false
		}
	},
	stroke: { width: 2 },
	colors: ['#0B0F27', '#0B0F27'],
	dataLabels: {
		enabled: false
	},
	markers: {
		size: 0
	},
	yaxis: {
		show: false,
		max: max => {
			if (detailInfo.fixPrice == true) {
				return max * 2;
			} else {
				return max;
			}
		},
		min: min => {
			if (detailInfo.fixPrice == true) {
				return min * 0.5;
			} else {
				return min;
			}
		}
	},
	xaxis: {
		type: 'datetime',
		labels: {
			show: false
		}
	}
};

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
// Popup End ======================

const showPopup = type => {
	popupParam.value = type;

	showModal();
};

const changeHistoryMode = mode => {
	historyMode.value = mode;
};

const checkLockup = () => {
	let myToken = myData.mytoken;

	for (let key in myToken) {
		if (myToken[key].symbol == mySymbol) {
			lockupCheck.value = true;

			let tokenList = myToken[key].list;

			for (let subKey in tokenList) {
				lockUpCount.value += Number(tokenList[subKey].totalQty - tokenList[subKey].totalWithdrawQty);
			}

			break;
		}
	}
};

const getChartData = getType => {
	if (chartType.value == getType) return false;

	chartType.value = getType;

	let type = 0;
	let count = 0;

	if (getType == 1) {
		type = '15m';
		count = 100;
	} else if (getType == 2) {
		type = '6h';
		count = 120;
	} else if (getType == 3) {
		type = '1d';
		count = 180;
	} else if (getType == 4) {
		type = '3d';
		count = 120;
	}

	http
		.get('/api/chart', {
			params: {
				symbol: mySymbol,
				type: type,
				count: count
			}
		})
		.then(response => {
			console.log(response);

			series.value[0].data = response.data.data.chart;
			price.value = response.data.data.price;
			rate.value = response.data.data.rate;
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getHistoryData = getType => {
	if (historyType.value != 3 && historyType.value == getType) return false;

	historyType.value = getType;

	let url = '';
	let params = {};

	if (getType == 1) {
		url = '/users/mypowers';
	} else if (getType == 2) {
		url = '/users/mymining';
	} else if (getType == 3) {
		url = '/token/txList';

		let address = '';

		if (detailInfo.chainId == 'TRON') {
			address = myData.wallet.tronAddress;
		} else {
			address = myData.wallet.address;
		}

		lastPage.value += 1;

		params = {
			symbol: mySymbol,
			address: address,
			page: lastPage.value,
			limit: pageLimit
		};
	}

	http
		.get(url, {
			params
		})
		.then(response => {
			console.log(response);

			if (historyType.value == 3) {
				let getData = response.data.data.data;

				if (lastPage.value == 1) {
					historyData.value = getData;
				} else {
					getData.forEach(item => {
						historyData.value.push(item);
					});
				}

				if (getData.length >= pageLimit) {
					showMore.value = true;
				} else {
					showMore.value = false;
				}
			} else {
				historyData.value = response.data.data;
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const openTxScanner = txId => {
	let scannerInfos = store.getters['getScannerInfos'];
	let blockUrl = scannerInfos[detailInfo.chainId].url;

	if (detailInfo.chainId == 'ETH' || detailInfo.chainId == 'BSC') {
		blockUrl = blockUrl + 'tx/' + txId;
	} else if (detailInfo.chainId == 'TRON') {
		blockUrl = blockUrl + '#/transaction/' + txId;
	} else {
		blockUrl = '';
	}

	if (blockUrl != '') {
		if (store.state.device == 'Mobile') {
			if (store.state.platform == 'iOS') {
				window.plugins.InAppBrowser(
					blockUrl,
					'_blank',
					'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=CLOSE,fullscreen=no'
				);
			} else {
				window.plugins.InAppBrowser(blockUrl);
			}
		} else {
			window.open(blockUrl, '_system');
		}
	}
};

const openSwapInfo = txId => {
	http
		.get('/swap/history', {
			params: {
				id: txId
			}
		})
		.then(response => {
			console.log(response);

			swapHistoryData.value = response.data.data;

			showPopup('swapInfo');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const openPaySendInfo = history => {
	paySendData.value = history;

	showPopup('payInfo');
};

const getPaymentData = txId => {
	http
		.get('/pay/receipts', {
			params: {}
		})
		.then(response => {
			console.log(response);

			paymentData.value = response.data.data;
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const goRefund = rid => {
	store.state.refundId = rid;

	router.push('/receipt');
};
</script>

<style scoped>
.top1 {
	border-radius: 30px;
	background: #0b0f27;
	border: 1px solid #0b0f27;
}

.top2 {
	border-radius: 30px;
	background: #ffffff;
}

.top3 {
	border-radius: 30px;
	background: #ebf0f5;
	border: 1px solid #d1ddef;
}

.on-list {
	border-radius: 30px;
	background: #0b0f27;
	color: #ffffff;
}

.off-list {
	border-radius: 30px;
	background: #5e5e5e;
	color: #ffffff;
}
</style>
