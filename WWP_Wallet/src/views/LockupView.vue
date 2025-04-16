<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'detail'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">Lock-up</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="px-8">
			<div class="h-5"></div>
			<div class="px-5 py-3 py-2 w-full flex flex-col justify-center items-center font-normal text-white top-box">
				<div class="h-1"></div>
				<div class="w-full flex justify-center items-center">
					<div class="text-sm">{{ $t('word.evaluationAmount') }}</div>
					<div class="grow text-right">
						{{ setDecimals(totalQty * detailInfo.price * exchangeInfos[store.state.currency].price, detailInfo.priceDecimals) }}
					</div>
				</div>
				<div class="h-3"></div>
				<div class="w-full flex justify-center items-center">
					<div class="text-sm">{{ $t('word.ownQuantity') }}</div>
					<div class="grow text-xl text-right">{{ setDecimals(totalQty, detailInfo.decimals) }}</div>
				</div>
			</div>
			<div class="h-5"></div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div v-for="token in myToken" :key="token.idx" class="px-8 py-3 text-sm">
				<div class="px-1 py-4 lockup-box">
					<div class="px-4 flex">
						<div>{{ $t('word.totalCount') }}</div>
						<div class="grow text-right">{{ token.totalQty }} {{ mySymbol }}</div>
					</div>
					<div class="h-2"></div>
					<div class="px-4 flex">
						<div>{{ $t('word.lockUpEndDay') }}</div>
						<div class="grow text-right">{{ getShowTime(token.unlockTime) }}</div>
					</div>
					<div class="h-2"></div>
					<div class="px-4 flex">
						<div>{{ $t('word.unLockDay') }}</div>
						<div class="grow text-right g-red">{{ token.unlockDay }} {{ $t('word.day') }}</div>
					</div>
					<div class="h-2"></div>
					<div class="px-4 flex">
						<div>{{ $t('word.unLockPercent') }}</div>
						<div class="grow text-right g-blue">{{ token.unlockRatePer }} %</div>
					</div>
					<div class="h-3"></div>
					<div class="px-5 py-3 lockup-in-box">
						<div class="flex">
							<div>{{ $t('word.ownQuantity') }}</div>
							<div class="grow text-right">{{ token.totalQty - token.totalWithdrawQty }}</div>
						</div>
						<div class="h-2"></div>
						<div class="flex">
							<div>{{ $t('word.withdrawCount') }}</div>
							<div class="grow text-right g-blue">{{ token.totalUnlockQty - token.totalWithdrawQty }}</div>
						</div>
					</div>
					<div class="h-8"></div>
					<div class="w-full flex justify-center items-center">
						<div
							@click="getWithdrawCheck(token.idx, token.totalUnlockQty - token.totalWithdrawQty)"
							v-if="token.totalUnlockQty - token.totalWithdrawQty > 0"
							class="w-64 h-10 flex justify-center items-center text-sm g-btn-color"
						>
							{{ $t('word.requestWithdraw') }}
						</div>
						<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.requestWithdraw') }}</div>
					</div>
					<div class="h-3"></div>
				</div>
				<div class="h-5"></div>
			</div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { setDecimals, checkError, getShowTime } from '@/utils/util';
import store from '@/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mySymbol = store.state.mySymbol;
const detailInfo = store.getters['getTokenInfos'][mySymbol];

const exchangeInfos = store.getters['getExchangeInfos'];

const myData = reactive(store.getters['getMyData']);
const myToken = ref();
const totalQty = ref(0);
const tokenId = ref(0);

onMounted(() => {
	store.state.withdrawTokenId = 0;
	store.state.withdrawIdx = 0;
	store.state.withdrawQty = 0;

	getMyToken();
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

const getMyToken = () => {
	http
		.get('/users/mytokens', {
			params: {}
		})
		.then(response => {
			console.log(response);

			let res = response.data.data;

			for (let key in res) {
				if (res[key].symbol == mySymbol) {
					tokenId.value = res[key].tokenId;
					myToken.value = res[key].list;

					let subRes = res[key].list;

					for (let subKey in subRes) {
						totalQty.value += Number(subRes[subKey].totalQty - subRes[subKey].totalWithdrawQty);
					}
				}
			}

			for (let key in myData.mytoken) {
				let tokenSymbol = myData.mytoken[key].symbol;

				if (tokenSymbol == mySymbol) {
					myData.mytoken[key].list = myToken.value;
				}
			}

			store.commit('setMyData', {
				data: myData
			});
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const getWithdrawCheck = (idx, withdrawQty) => {
	if (idx < 0 || withdrawQty < 0) return false;

	// OTP 등록 체크
	if (myData.useOTP == false) {
		popupMsg.value = t('message.otpWithdrawal');
		return false;
	}

	http
		.get('/users/withdrawCheck', {
			params: {}
		})
		.then(response => {
			console.log(response);

			if (response.data.data.lockWithdraw == 0) {
				store.state.withdrawTokenId = tokenId.value;
				store.state.withdrawIdx = idx;
				store.state.withdrawQty = withdrawQty;

				router.push('/auth');
			} else {
				popupMsg.value = t('message.withdrawProcess');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.top-box {
	border-radius: 30px;
	background: #0b0f27;
}

.lockup-box {
	border-radius: 30px;
	background: #ebf0f5;
	border: 1px solid #d1ddef;
}

.lockup-in-box {
	border-radius: 30px;
	background: #dddddd;
}
</style>
