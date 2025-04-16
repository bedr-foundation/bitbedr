<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'detail'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">Send</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="px-8">
			<div>{{ $t('word.ownQuantity') }}</div>
			<div class="h-1"></div>
			<div class="px-5 py-3 w-full top-box flex justify-center items-center text-white font-normal">
				<div class="flex justify-center items-center g-wallet-border"><img class="g-wallet-icon" :src="detailInfo.icon" /></div>
				<div class="ml-2 flex flex-col">
					<div>{{ detailInfo.name }}</div>
					<div v-if="detailInfo.type == 'P'" class="text-xs">$</div>
					<div v-else class="text-xs">{{ detailInfo.chainId }}</div>
				</div>
				<div class="grow text-right">{{ setDecimals(balance, detailInfo.decimals) }}</div>
			</div>
			<div class="h-5"></div>
			<div>{{ $t('word.withdrawAddress') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input type="text" v-model.trim="sendAddress" class="w-full h-12 text-sm text-black pr-12" :placeholder="$t('word.addressInput')" />
				<div v-if="store.state.device == 'Mobile'" class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="qrcodeStart"><img src="@/assets/images/scan_icon.svg" /></div>
				</div>
			</div>
			<div class="h-5"></div>
			<div class="flex justify-center items-center" @click="getClipboardData"><img src="@/assets/images/btn_paste.svg" /></div>
			<div class="h-8"></div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div class="h-6"></div>
			<div class="px-8">
				<div class="h-5">{{ $t('word.withdrawAmount') }}</div>
				<div class="h-2"></div>
				<input
					type="number"
					v-model.number="showPrice"
					@input="updatePrice(-1)"
					class="w-full h-12 text-right text-black pr-3"
					:placeholder="$t('word.amountInput')"
				/>
				<div class="h-2"></div>
				<div v-if="parseFloat(detailInfo.minSendQty) > 0">
					<div class="px-3">
						<div class="flex text-sm">
							<div class="g-gray">{{ $t('word.sendMinAmount') }}</div>
							<div class="grow text-right">
								<div>
									<span class="font-normal fee-price">{{ detailInfo.minSendQty }}</span>
									<span class="ml-2 g-gray">{{ mySymbol }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="h-3"></div>
				</div>
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
				<div class="h-6"></div>
				<div class="h-px g-line"></div>
				<div class="h-6"></div>
				<div>{{ $t('word.total') }}</div>
				<div class="h-2"></div>
				<div class="px-3">
					<div v-if="detailInfo.type != 'P'" class="flex text-sm">
						<div class="g-gray">{{ $t('word.estimateFee') }}</div>
						<div class="grow text-right">
							<div>
								<span class="font-normal fee-price">{{ feePrice }}</span>
								<span class="ml-2 g-gray">{{ feeSymbol }}</span>
							</div>
						</div>
					</div>
					<div class="h-1"></div>
					<div class="flex text-sm">
						<div class="g-gray">{{ $t('word.sendAmount') }}</div>
						<div class="grow text-right">
							<div>
								<span class="font-normal fee-price">{{ isEmpty(showPrice) ? '0' : showPrice }}</span>
								<span class="ml-2 g-gray">{{ mySymbol }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="h-10"></div>
				<div>{{ $t('word.memo') }}</div>
				<div class="h-2"></div>
				<input
					type="text"
					v-model="sendMemo"
					maxlength="20"
					class="w-full h-12 text-black pr-3"
					:placeholder="$t('message.maxMemoLength')"
				/>
				<div class="h-10"></div>
				<div class="w-full flex justify-center items-center">
					<div
						v-if="
							sendAddress != '' &&
							parseFloat(showPrice) > 0 &&
							parseFloat(showPrice) >= parseFloat(detailInfo.minSendQty) &&
							calPrice <= parseFloat(balance)
						"
						@click="checkAuth"
						class="w-64 h-10 flex justify-center items-center text-sm g-btn-color"
					>
						{{ $t('word.requestWithdraw') }}
					</div>
					<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.requestWithdraw') }}</div>
				</div>
				<div class="h-5"></div>
			</div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { setDecimals, checkError, toPlainString } from '@/utils/util';
import store from '@/store';
import { isEmpty } from '@/utils/openCrypto';

const mySymbol = store.state.mySymbol;
const tokenInfos = store.getters['getTokenInfos'];
const detailInfo = tokenInfos[mySymbol];
const myData = store.getters['getMyData'];
const balance = myData[mySymbol];

const sendAddress = ref('');
const priceType = ref(0);
const showPrice = ref('');
const feePrice = ref(0);
const feeSymbol = ref('');
const calPrice = ref(0);

const sendMemo = ref('');

onMounted(() => {
	sendAddress.value = store.state.qrcodeInfo;
	store.state.qrcodeInfo = '';

	getFeeSymbol();
	if (detailInfo.type != 'P') {
		getGasFee();
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

const getFeeSymbol = () => {
	for (let key in tokenInfos) {
		if (tokenInfos[key].chainId == detailInfo.chainId && tokenInfos[key].type == '') {
			feeSymbol.value = tokenInfos[key].symbol;
		}
	}
};

const getGasFee = () => {
	http
		.get('/token/gasfee', {
			params: {
				symbol: mySymbol
			}
		})
		.then(response => {
			console.log(response);

			feePrice.value = response.data.data.fee;
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const qrcodeStart = () => {
	if (store.state.device == 'Mobile') {
		router.push('/qrcode');
	}
};

const updatePrice = type => {
	if (type != -1 && type == priceType.value) return false;

	if (type == 0) {
		showPrice.value = '';
		calPrice.value = 0;
	} else if (type == 30) {
		showPrice.value = balance * 0.3;
	} else if (type == 50) {
		showPrice.value = balance * 0.5;
	} else if (type == 100) {
		showPrice.value = balance * 1;
	} else {
		// 합이 max를 넘을때 값 제한하기
		let v = parseFloat(showPrice.value);
		if (mySymbol === feeSymbol.value) v = parseFloat(showPrice.value) + parseFloat(feePrice.value);
		if (v > balance) {
			type = 100;
			priceType.value = type;
			showPrice.value = balance * 1;
		}

		// 최종입력값에서 소수점 체크해 제한하기. 소수점 6자리 이하는 e-16같은 지수값으로 나와서 plainString 함수를 이용해 정상적인 문자열로 변경.
		let parts = toPlainString(showPrice.value).split('.');

		// 수소점에서 버림처리
		// 버림처리하는 이유는 USDT의 경우 자리수2자리 사용하는데 어떤이유로
		// 자리수가 2자리 이하로 내려가면 max전송을 위해 자리수 2자리 이하를 버림
		// 월렛에서 자리수 체크를 하기 때문에 자리수 이하로 버림처리함.
		if (parts.length == 2 && parts[1].length > detailInfo.decimals) {
			let pow = Math.pow(10, detailInfo.decimals);
			showPrice.value = Math.floor(parseFloat(showPrice.value) * pow) / pow;
		}
	}

	priceType.value = type;

	if (isNaN(showPrice.value)) {
		showPrice.value = '0';
	}

	// 직접입력이 아닐때  소지량이 10 이상이면 정수처리
	if (showPrice.value > 10 && type != -1 && type != 100) {
		showPrice.value = parseInt(showPrice.value);
	} else if (type == 100 && balance > 0 && mySymbol === feeSymbol.value) {
		// max로 설정되어있고 feeSymbol과 같으면 showPirce 값을 수정한다.
		showPrice.value = parseFloat(balance) - parseFloat(feePrice.value);
	}

	if (mySymbol === feeSymbol.value) {
		calPrice.value = parseFloat(showPrice.value) + parseFloat(feePrice.value);
	} else {
		calPrice.value = parseFloat(showPrice.value);
	}
};

const getClipboardData = target => {
	if (store.state.device == 'Mobile') {
		window.plugins.clipboard.paste(res => {
			if (res.type == 'text') {
				sendAddress.value = res.data;
			}
		});
	} else {
		navigator.clipboard.readText().then(text => {
			sendAddress.value = text;
		});
	}
};

const checkAuth = () => {
	if (sendAddress.value != '') {
		store.state.sendAddress = sendAddress.value;
		store.state.sendPrice = showPrice.value;
		store.state.sendMemo = sendMemo.value;

		router.push('/auth');
	}
};
</script>

<style scoped>
.top-box {
	border-radius: 30px;
	background: #0b0f27;
}

.fee-price {
	color: #000000;
}
</style>
