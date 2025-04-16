<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full">
			<div class="flex justify-center items-center"><img src="@/assets/images/logo_s.svg" /></div>
			<div class="h-5"></div>
			<div class="p-4 flex font-normal play-top1">
				<RouterLink to="myInfo" class="pt-1 ml-2"><img src="@/assets/images/play_icon.svg" /></RouterLink>
				<RouterLink to="myInfo" class="pt-1 ml-2 text-white">{{ showName }}</RouterLink>
				<div class="grow"></div>
			</div>
			<div class="h-2"></div>
			<div class="play-top2">
				<div class="h-3"></div>
				<div class="flex justify-center items-center text-white font-normal">{{ $t('word.totalAmount') }}</div>
				<div class="h-1"></div>
				<template v-if="isNullOrEmpty(exchangeInfos) == false">
					<div class="px-5 ml-2 flex justify-center items-center text-white">
						<div class="font-normal text-sm">USD</div>
						<div class="grow text-[22px] text-right">{{ setDecimalsBall(totalPrice * exchangeInfos['USD'].price) }}</div>
					</div>
					<div class="px-5 ml-2 flex justify-center items-center text-white">
						<div class="font-normal text-sm">KRW</div>
						<div class="grow text-[22px] text-right">{{ setDecimalsBall(totalPrice * exchangeInfos['KRW'].price) }}</div>
					</div>
				</template>
				<div class="h-3"></div>
				<div class="px-6 py-3 flex justify-center items-center bedr-pay" @click="goDetailInfo(store.state.payName)">
					<div><img src="@/assets/images/bedr_top_icon.png" /></div>
					<div class="ml-2">BEDR Pay</div>
					<div class="pt-3 grow text-xl text-right flex flex-col">
						<div>{{ setDecimals(bedrPoint, bedrPointDecimals) }}</div>
						<div class="text-xs g-gray flex justify-end items-center">
							<template v-for="ex in exchangeInfos" :key="ex.currency">
								<div v-if="store.state.currency == ex.currency">{{ ex.currency }}</div>
							</template>
							<div class="ml-2">
								{{ setDecimals(bedrPointPrice, bedrPointDecimals) }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-2"></div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div class="px-8 w-full">
				<PullRefresh
					v-model="isRefresh"
					@refresh="forceGetBalanceAll"
					successText=""
					pullingText="Pull To Refresh"
					loosingText="Pull To Refresh"
					loadingText="Pull To Refresh"
				>
					<div class="h-2"></div>
					<div v-for="token in showTokenInfos" :key="token.idx" @click="goDetailInfo(token.symbol)">
						<div v-if="token.type != 'P'">
							<div class="px-5 py-2 flex font-normal g-list-box">
								<div class="flex justify-center items-center g-wallet-border"><img class="g-wallet-icon" :src="token.icon" /></div>
								<div class="pt-1 ml-2 mt-px flex flex-col">
									<div class="">{{ token.name }}</div>
									<div class="text-xs g-dark-gray">{{ token.chainId }}</div>
								</div>
								<div class="grow"></div>
								<div class="ml-2 mt-px flex flex-col items-end text-lg">
									<div v-if="myData[token.symbol] != undefined">
										{{ setDecimals(myData[token.symbol], token.decimals) }}
									</div>
									<div v-else>0</div>
									<div v-if="myData[token.symbol] != undefined" class="text-xs g-dark-gray">
										{{ store.state.currency }}
										<template v-for="exchange in showExchangeInfos" :key="exchange.currency">
											<template v-if="exchange.currency == store.state.currency">
												{{ setDecimals(myData[token.symbol] * token.price * exchange.price, token.priceDecimals) }}
											</template>
										</template>
									</div>
									<div v-else class="text-xs g-dark-gray">0</div>
								</div>
							</div>
							<div class="h-2"></div>
						</div>
					</div>
				</PullRefresh>
				<div class="h-5"></div>
			</div>
		</div>
	</main>
	<footer class="w-full">
		<div class="h-1"></div>
		<div class="w-full g-footer">
			<div class="px-5 flex justify-around items-center" style="position: relative">
				<!--
				<div style="position: absolute; left: 50%; transform: translate(-31px, -70px)">
					<router-link :to="'qrcode'"><img src="@/assets/images/play_address.png" /></router-link>
				</div>
				-->
				<div><img src="@/assets/images/menu_wallet_select.svg" /></div>
				<router-link :to="'wwpworld'"><img src="@/assets/images/menu_nft.svg" /></router-link>
				<router-link :to="'setting'"><img src="@/assets/images/menu_setting.svg" /></router-link>
			</div>
		</div>
	</footer>
	<Teleport to="body">
		<div id="container" class="hidden particle-area"></div>
	</Teleport>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
	<NoticeModal
		v-if="noticePopupPos >= 0"
		:visible="noticeVisible"
		@hide="hideNoticeModal"
		:title="noticeList[noticePopupPos].title"
		:createdAt="getShowTime(noticeList[noticePopupPos].createdAt)"
		:desc="noticeList[noticePopupPos].desc"
		:descImage="noticeList[noticePopupPos].descImage"
	></NoticeModal>
</template>

<script setup>
import { onMounted, ref, watch, reactive, h } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import PullRefresh from 'pull-refresh-vue3';
import MainModal from '@/components/MainModal.vue';
import NoticeModal from '@/components/NoticeModal.vue';
import { setDecimals, setDecimalsBall, getShowTime, checkError, isNullOrEmpty, sleep } from '@/utils/util';
import { isEmpty } from '@/utils/openCrypto';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { getNetwork } from '@/utils/NetworkUtil';
import BigNumber from 'bignumber.js';
import { tronFromWei } from '@/utils/TronNetwork';

const { t } = useI18n();

const tokenInfos = reactive(store.getters['getTokenInfos']);
const exchangeInfos = ref(store.getters['getExchangeInfos']);
const showTokenInfos = ref();
const showExchangeInfos = ref();
const myData = reactive(store.getters['getMyData']);
const miningInfo = store.getters['getMiningInfo'];

const noticeList = store.getters['getNoticeInfos'].filter(v => v.popup == 1);
const noticePopupPos = ref(store.state.noticePopupPos);

const totalPrice = ref(0);
const bedrPoint = ref(0);
const bedrPointPrice = ref(0);
const bedrPointDecimals = ref(4);
const pointSymbol = ref('');
const showName = ref(store.getters['getMyData'].name);

const isRefresh = ref(false);

let powerTimer = null;
const powerBallMax = ref(0);
const powerBall = ref(0);
const powerBallDelay = ref(100);

const mCard = ref(null);

let child = null;
let childTimer = null;
let checkChild = null;

var balanceTimer = null;

onMounted(() => {
	store.state.mainPage = 'play';

	store.commit('setMySymbol', {
		symbol: ''
	});

	if (noticePopupPos.value >= 0) {
		showNoticeModal();
	} else if (store.state.saveShowPopup != '') {
		popupMsg.value = t(store.state.saveShowPopup);
	}

	if (showName.value == '') {
		showName.value = 'Hello';
	}

	getTokenInfos();
	// getPowerBallInfo();

	// showParticle();
});

// Popup Start ====================
const visible = ref(false);
const noticeVisible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const showNoticeModal = () => {
	noticeVisible.value = true;
};

const hideModal = () => {
	popupMsg.value = '';
	visible.value = false;
	noticeVisible.value = false;

	store.state.saveShowPopup = '';
};

const hideNoticeModal = () => {
	popupMsg.value = '';
	visible.value = false;
	noticeVisible.value = false;

	if (noticeList.length - 1 > noticePopupPos.value) {
		store.state.noticePopupPos += 1;
		noticePopupPos.value += 1;

		setTimeout(() => {
			showNoticeModal();
		}, 100);
	} else {
		store.state.noticePopupPos = -1;
		noticePopupPos.value = -1;
	}
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const showParticle = () => {
	let container = document.getElementById('container');
	console.log(container);
	let colors = ['#f6e58d', '#ffbe76', '#ff7979', '#badc58'];
	let w = window.screen.width;
	let h = window.screen.height;

	for (let i = 0; i < 100; i++) {
		let elem = document.createElement('div');
		elem.className = 'g-particle';
		console.log(elem);
		container.appendChild(elem);

		gsap.set(elem, {
			x: gsap.utils.random(0, w),
			y: gsap.utils.random(0, h) - h * 0.5,
			scale: gsap.utils.random(0.5, 1),
			backgroundColor: gsap.utils.random(colors)
		});

		anime(elem);
	}
};

const anime = elem => {
	let w = window.screen.width;
	let h = window.screen.height;

	gsap.to(elem, gsap.utils.random(5, 10), {
		y: h,
		ease: 'none',
		repeat: -1,
		delay: -10
	});
	gsap.to(elem, gsap.utils.random(1, 6), {
		x: '+=50',
		ease: 'power1.inOut',
		repeat: -1,
		yoyo: true
	});
	gsap.to(elem, gsap.utils.random(1, 2), {
		opacity: 0,
		ease: 'power1.inOut',
		repeat: -1,
		yoyo: true
	});
};

const updatePowerBall = () => {
	powerTimer = setInterval(() => {
		if (powerBall.value < powerBallMax.value) {
			powerBall.value += 0.01;
		} else {
			clearInterval(powerTimer);
		}
	}, powerBallDelay.value);
};

const getPowerBallInfo = () => {
	http
		.get('/play/powerInfo', {
			params: {}
		})
		.then(response => {
			console.log(response);

			powerBallMax.value = response.data.data.total;
			powerBall.value = response.data.data.total - response.data.data.aniCount;
			powerBallDelay.value = response.data.data.delay;

			if (powerBall.value < 0) powerBall.value = 0;

			updatePowerBall();
		});
};

const showInReady = () => {
	popupMsg.value = t('message.inReady');
};

const getTokenInfos = () => {
	http
		.get('/api/tokenInfos', {
			params: {}
		})
		.then(response => {
			console.log(response);

			store.state.isLoading = true;

			const resData = response.data.data;
			let scannerInfos = {};
			let tmpExchangeInfos = {};

			showExchangeInfos.value = response.data.data.exchange;
			showTokenInfos.value = response.data.data.tokenInfos;

			resData.exchange.forEach(res => {
				tmpExchangeInfos[res.currency] = res;
			});

			resData.tokenInfos.forEach(res => {
				tokenInfos[res.symbol] = res;

				if (res.type == 'P') {
					pointSymbol.value = res.symbol;
				}
			});

			resData.scanner.forEach(res => {
				scannerInfos[res.chainId] = res;
			});

			store.commit('setExchangeInfos', {
				data: tmpExchangeInfos
			});
			exchangeInfos.value = tmpExchangeInfos;

			store.commit('setTokenInfos', {
				data: tokenInfos
			});

			store.commit('setScannerInfos', {
				data: scannerInfos
			});

			getBalanceAll();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const forceGetBalanceAll = () => {
	store.state.isBalanceUpdate = true;

	isRefresh.value = false;

	getBalanceAll();
};

const getBalanceAll = async () => {
	balanceTimer = setTimeout(() => {
		store.state.isLoading = false;
	}, 5000);

	const today = new Date();
	let seconds = '';

	if (store.state.refreshTime > 0) {
		seconds = parseInt(Math.abs(store.state.refreshTime.getTime() - today.getTime()) / 1000);
	}

	if (store.state.isBalanceUpdate == true || seconds > 60) {
		for (let key in tokenInfos) {
			let token = tokenInfos[key];

			let network = ''; // 유저의 네트워크
			let address = ''; // 유저의 지갑주소
			let contract = token.contractAddress; // TRCOIN 컨트렉트 주소

			network = getNetwork(token.chainId);

			if (token.chainId == 'TRON') {
				address = myData.wallet.tronAddress;

				if (token.type == 'T') {
					const decimals = await network.getDecimalsSmartContract(contract);
					const balanceOf = await network.getBalanceSmartContract(contract, address);
					const balanceTRC20Wei = new BigNumber(balanceOf.toString());
					const balanceTRC20 = tronFromWei(balanceTRC20Wei.toString(), decimals);
					// console.log('balance TRC20:', balanceTRC20.toString());
					myData[token.symbol] = balanceTRC20.toString();
				} else if (token.type == '') {
					const balanceOf = await network.getBalance(address);
					const balanceWei = new BigNumber(balanceOf.toString());
					const balanceTron = tronFromWei(balanceWei.toString());
					// console.log('balance TRX:', balanceTron.toString());
					myData[token.symbol] = balanceTron.toString();
				}
			} else {
				address = myData.wallet.address;

				if (token.type == 'T') {
					const decimals = await network.getDecimalsSmartContract(contract);
					const balance = await network.getBalanceSmartContract(contract, address);
					const balanceBig = new BigNumber(balance);
					const balanceOf = balanceBig.dividedBy(10 ** decimals);
					console.log('balance Token:', balanceOf.toString());
					myData[token.symbol] = balanceOf.toString();
				} else if (token.type == '') {
					const decimals = 18; // eth 네트워크는 자리수가 18자리
					const balance = await network.getBalance(address);
					const balanceBig = new BigNumber(balance);
					const balanceOf = balanceBig.dividedBy(10 ** decimals);
					console.log('balance :', balanceOf.toString());
					myData[token.symbol] = balanceOf.toString();
				}
			}
		}
	}

	updatePoint();
};

const updatePoint = () => {
	clearTimeout(balanceTimer);

	http
		.get('/token/balancePoint', {
			params: {}
		})
		.then(response => {
			console.log(response);

			store.state.isBalanceUpdate = false;
			store.state.refreshTime = new Date();

			let res = response.data.data.balances;
			let reward = response.data.data.rewards;

			for (let key in res) {
				let curSymbol = res[key].symbol;

				myData[curSymbol] = res[key].balance;
			}

			/* 현재는 미사용
			myData['rollup'] = {};
			myData['rollup']['period'] = reward.rollup.period;
			myData['rollup']['amount'] = reward.rollup.amount;

			myData['payback'] = {};
			myData['payback']['amount'] = reward.payback.total - reward.payback.receive;
			myData['payback']['day'] = reward.payback.day;
			*/

			store.commit('setMyData', {
				data: myData
			});

			updatePrice();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const updatePrice = () => {
	clearTimeout(balanceTimer);

	totalPrice.value = 0;

	for (let key in tokenInfos) {
		if (isEmpty(myData[key])) continue;

		totalPrice.value += myData[key] * tokenInfos[key].price;

		if (tokenInfos[key].type == 'P') {
			bedrPoint.value = myData[key];
			bedrPointPrice.value = myData[key] * tokenInfos[key].price * exchangeInfos.value[store.state.currency].price;
			bedrPointDecimals.value = tokenInfos[key].decimals;
		}
	}

	/* Lockup 제외
	let myToken = myData.mytoken;

	for (let key in myToken) {
		let tokenSymbol = myToken[key].symbol;
		let tokenList = myToken[key].list;

		for (let subKey in tokenList) {
			console.log(tokenList[subKey]);
			totalPrice.value +=
				Number(tokenList[subKey].totalQty - tokenList[subKey].totalWithdrawQty) *
				tokenInfos[tokenSymbol].price *
				exchangeInfos.value[store.state.currency].price;
		}
	}
	*/

	store.state.isLoading = false;
};

const goDetailInfo = symbol => {
	store.commit('setMySymbol', {
		symbol
	});

	router.push('/detail');
};

const moveBedr = () => {
	child = window.open('https://bedr-foundation.com', '_blank', 'fullscreen=yes,location=no');

	if (child == null || child == undefined) {
		//popupMsg.value = t('message.NotAllowPopup');
	} else {
		//childTimer = setInterval(checkChild, 500);
	}
};

const showPopupMsg = res => {
	popupMsg.value = res;
};
</script>

<style scoped>
.play-top1 {
	background-image: url('@/assets/images/bedr_top1_bg.png');
	background-size: cover;
	border-radius: 30px;
}

.play-top2 {
	border-radius: 30px;
	background: #0b0f27;
	border: 1px solid #0b0f27;
}

.bedr-pay {
	border-radius: 30px;
	background: #ebf0f5;
}

.particle-area {
	position: fixed;
	z-index: 90;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.play-top3 {
	background-image: url('@/assets/images/bedr_top3_bg.png');
	background-size: cover;
	border-radius: 6px;
}

.play-box {
	border-radius: 38px;
	background: #ebf0f5;
	border: 1px solid #d1ddef;
}
</style>
