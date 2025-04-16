<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'detail'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">Swap</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="px-8">
			<div>{{ $t('word.ownQuantity') }}</div>
			<div class="h-1"></div>
			<div class="px-5 py-3 w-full top-box flex justify-center items-center font-normal text-white">
				<div class="flex justify-center items-center g-wallet-border"><img class="g-wallet-icon" :src="detailInfo.icon" /></div>
				<div class="ml-2 flex flex-col">
					<div>{{ detailInfo.name }}</div>
					<div v-if="detailInfo.type == 'P'" class="text-xs g-gray">$</div>
					<div v-else class="text-xs">{{ detailInfo.chainId }}</div>
				</div>
				<div class="grow text-right">{{ setDecimals(balance, detailInfo.decimals) }}</div>
			</div>
			<div class="h-5"></div>
			<div>{{ $t('word.swap') }}</div>
			<div class="h-1"></div>
			<div class="px-3 text-sm">
				<div class="flex">
					<div class="g-gray">{{ $t('word.swapAmount') }}</div>
					<div class="grow text-right">
						<span class="font-normal">{{ balance }}</span>
						<span class="ml-2 g-gray">{{ mySymbol }}</span>
					</div>
				</div>
				<div class="h-1"></div>
				<div class="flex">
					<div class="g-gray">1 {{ mySymbol }}</div>
					<div class="grow text-right g-gray">
						{{ store.state.currency }}
						<span class="ml-2 g-gray">{{
							setDecimals(detailInfo.price * exchangeInfos[store.state.currency].price, detailInfo.decimals)
						}}</span>
					</div>
				</div>
				<div class="h-1"></div>
				<div class="flex">
					<div class="g-gray">{{ $t('word.swapMinAmount') }}</div>
					<div class="grow text-right">
						<span class="font-normal g-gray">{{ minSwapCount }}</span>
						<span class="ml-2 g-gray">{{ mySymbol }}</span>
					</div>
				</div>
				<div class="h-1"></div>
				<div class="flex">
					<div class="g-gray">{{ $t('word.swapMaxAmount') }}</div>
					<div class="grow text-right">
						<span class="font-normal g-gray">{{ maxSwapCount }}</span>
						<span class="ml-2 g-gray">{{ mySymbol }}</span>
					</div>
				</div>
			</div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div class="h-6"></div>
			<div class="px-8">
				<input
					type="number"
					v-model.number="showPrice"
					@input="updatePrice(-1)"
					class="w-full h-12 text-right text-black pr-3"
					:placeholder="$t('word.amountInput')"
				/>
				<div class="h-2"></div>
				<div class="flex justify-between items-center font-normal">
					<div
						@click="updatePrice(0)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[priceType == 0 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						{{ $t('word.init') }}
					</div>
					<div
						@click="updatePrice(30)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[priceType == 30 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						30%
					</div>
					<div
						@click="updatePrice(50)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[priceType == 50 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						50%
					</div>
					<div
						@click="updatePrice(100)"
						class="w-[24%] pt-1 h-8 flex justify-center items-center text-xs"
						:class="[priceType == 100 ? 'g-btn-color-m' : 'g-btn-gray-m']"
					>
						{{ $t('word.max') }}
					</div>
				</div>
				<div class="h-10"></div>
				<div class="w-full flex justify-center items-center">
					<div
						@click="getSwapInfo"
						v-if="showPrice > 0 && showPrice >= minSwapCount && showPrice <= maxSwapCount"
						class="w-64 h-10 flex justify-center items-center text-sm g-btn-color2"
					>
						{{ $t('word.swapPercent') }}
					</div>
					<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.swapPercent') }}</div>
				</div>
				<div class="h-10"></div>
				<div class="px-2 flex text-sm">
					<div class="text-sm g-gray">1 {{ toSymbol }}</div>
					<div v-if="toSymbol != ''" class="grow text-sm text-right g-gray">
						<span>{{ store.state.currency }}</span>
						<span class="ml-2 font-normal">{{ tokenInfos[toSymbol].price * exchangeInfos[store.state.currency].price }}</span>
					</div>
				</div>
				<div class="h-1"></div>
				<div class="relative">
					<input type="text" v-model="recvPrice" class="w-full h-12 text-sm text-right text-black" readonly />
					<div class="px-3 flex absolute inset-y-0 left-0 items-center">
						<div @click="showModal"><img src="@/assets/images/swap_select.svg" /></div>
						<div v-if="toSymbol != ''" class="ml-2 flex justify-center items-center wallet-border">
							<img class="wallet-icon" :src="tokenInfos[toSymbol].icon" />
						</div>
					</div>
				</div>
				<div class="h-2"></div>
				<div class="px-2 text-xs text-right g-gray">Fee {{ amountFee }} {{ mySymbol }}</div>
				<div class="h-1"></div>
				<div class="h-10"></div>
				<div class="w-full flex justify-center items-center">
					<div
						v-if="showPrice > 0 && recvPrice > 0 && swapEnable == true"
						@click="checkAuth"
						class="w-64 h-10 flex justify-center items-center text-sm g-btn-color"
					>
						{{ $t('word.swapRequest') }}
					</div>
					<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.swapRequest') }}</div>
				</div>
				<div class="h-5"></div>
			</div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div class="h-3"></div>
		<div class="text-center g-dark-blue">{{ $t('word.coinSelect') }}</div>
		<div class="h-8"></div>
		<div v-for="(coin, index) in swapList[mySymbol]" :key="index" class="w-full flex flex-col justify-center items-center">
			<div class="flex justify-center items-center">
				<div class="flex justify-center items-center wallet-border"><img class="wallet-icon" :src="tokenInfos[coin].icon" /></div>
				<div class="w-5"></div>
				<div
					@click="changeSwapPos(coin)"
					class="w-32 h-8 flex justify-center items-center text-sm"
					:class="[toSymbol == coin ? 'swap-select' : '']"
				>
					{{ coin }}
				</div>
			</div>
			<div class="h-5"></div>
		</div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { setDecimals, checkError } from '@/utils/util';
import store from '@/store';
import { isEmpty } from '@/utils/openCrypto';

const mySymbol = store.state.mySymbol;
const tokenInfos = store.getters['getTokenInfos'];
const exchangeInfos = store.getters['getExchangeInfos'];
const detailInfo = tokenInfos[mySymbol];
const myData = store.getters['getMyData'];
const swapList = store.getters['getSwapList'];
const balance = myData[mySymbol];

const address = ref('');
const priceType = ref(0);
const showPrice = ref('');
const feePrice = ref(0);
const recvPrice = ref(0);
const toSymbol = ref('');
const toAddress = ref('');
const minSwapCount = ref(0);
const maxSwapCount = ref(0);
const amountFee = ref(0);

const swapEnable = ref(true);

onMounted(() => {
	toSymbol.value = swapList[mySymbol][0];

	if (detailInfo.chainId == 'TRON') {
		address.value = myData.wallet.tronAddress;
	} else {
		address.value = myData.wallet.address;
	}

	getToAddress(true, swapList[mySymbol][0]);
});

watch(showPrice, val => {
	if (val != '' || val == 0) {
		//
	}
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
// Popup End ======================

const getSwapInfo = amount => {
	http
		.get('/swap/estimate', {
			params: {
				fromAddress: address.value,
				toAddress: toAddress.value,
				fromSymbol: mySymbol,
				toSymbol: toSymbol.value,
				amount: amount == 1 ? amount : showPrice.value,
				currency: store.state.currency
			}
		})
		.then(response => {
			console.log(response);

			const res = response.data.data;

			minSwapCount.value = (parseFloat(res.minSwap) / (parseFloat(res.userSendPrice) / parseFloat(res.userSendAmount))).toFixed(2);
			maxSwapCount.value = (parseFloat(res.maxSwap) / (parseFloat(res.userSendPrice) / parseFloat(res.userSendAmount))).toFixed(2);

			if (amount != 1) {
				amountFee.value = res.swapAmountFee;
				recvPrice.value = res.swapRecvAmount;
			}

			swapEnable.value = true;
		})
		.catch(error => {
			swapEnable.value = false;
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getToAddress = (getMmode, coin) => {
	for (let ch in tokenInfos) {
		if (tokenInfos[ch].symbol == coin) {
			if (tokenInfos[ch].chainId == 'TRON') {
				toAddress.value = myData.wallet.tronAddress;
			} else {
				toAddress.value = myData.wallet.address;
			}

			break;
		}
	}

	if (getMmode == true) {
		getSwapInfo(1);
	}
};

const changeSwapPos = coin => {
	toSymbol.value = coin;

	getToAddress(false, coin);

	updatePrice(0);
	hideModal();
};

const updatePrice = type => {
	if (type != -1 && type == priceType.value) return false;

	priceType.value = type;

	if (type == -1) {
		if (showPrice.value > balance * 1) {
			showPrice.value = balance * 1;
		}
	} else {
		if (type == 0) {
			showPrice.value = '';
		} else if (type == 30) {
			showPrice.value = balance * 0.3;
		} else if (type == 50) {
			showPrice.value = balance * 0.5;
		} else if (type == 100) {
			showPrice.value = balance * 1;
		}

		if (showPrice.value > 10 && type != 100) {
			showPrice.value = parseInt(showPrice.value);
		}

		if (showPrice.value > maxSwapCount.value) {
			showPrice.value = maxSwapCount.value;
		}
	}

	recvPrice.value = 0;
	amountFee.value = 0;
};

const checkAuth = () => {
	if (recvPrice.value > 0) {
		store.state.swapSymbol = toSymbol.value;
		store.state.swapAmount = showPrice.value;

		router.push('/auth');
	}
};
</script>

<style scoped>
.top-box {
	border-radius: 30px;
	background: #0b0f27;
}

.swap-price {
	background: #ffffff;
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

.swap-select {
	border-radius: 2px;
	background: #0b0f27;
	color: #ffffff;
}
</style>
