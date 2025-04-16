<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'play'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
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
							{{ store.state.currency }}
							<template v-for="exchange in exchangeInfos" :key="exchange.currency">
								<template v-if="exchange.currency == store.state.currency">
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
			<div class="g-list-box">
				<div class="p-5">Store Name : {{ store.state.shopName }}</div>
			</div>
		</div>
	</header>
	<main class="w-full h-full grow overflow-hidden flex flex-col items-center">
		<div class="w-full overflow-y-auto">
			<div class="h-6"></div>
			<div class="px-8">
				<div class="h-2"></div>
				<div>{{ $t('word.amountOfPayment') }}</div>
				<div class="h-1"></div>
				<div class="flex">
					<div class="grow">
						<input type="number" v-model.number="amount" @input="updateAmount" class="w-full h-11 text-right text-black" />
					</div>
					<div class="pl-2 w-28">
						<div @click="showPopup('currency')" class="h-11 flex justify-center items-center text-sm g-btn-color">
							<div>{{ store.state.currency }}</div>
							<div class="ml-3"><img src="@/assets/images/currency_arrow.svg" /></div>
						</div>
					</div>
				</div>
				<div class="h-5"></div>
				<div>{{ mySymbol }}</div>
				<div class="h-1"></div>
				<input v-model="tkpay" type="text" class="w-full h-11 text-right g-gray" readOnly />
				<div class="hidden">
					<div class="h-5"></div>
					<div>BEDR-POINT ({{ $t('word.payback') }})</div>
					<div class="h-1"></div>
					<input v-model="tkpoint" type="text" class="w-full h-11 text-right g-gray" readOnly />
				</div>
				<div class="h-10"></div>
				<div class="h-5"></div>
				<div class="w-full flex justify-center items-center">
					<div
						v-if="amount > 0 && tkpay > 0 && balance >= parseFloat(tkpay.replace(/,/g, ''))"
						@click="startPayment"
						class="w-64 h-10 flex justify-center items-center text-sm g-btn-color"
					>
						{{ $t('word.purchase') }}
					</div>
					<div v-else class="w-64 h-10 flex justify-center items-center text-sm g-btn-light-gray">{{ $t('word.purchase') }}</div>
				</div>
				<div class="h-3"></div>
				<div class="text-[#9C9C9C] text-xs text-center">© {{ store.state.payName }}</div>
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
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import SelectCurrency from '@/components/SelectCurrency.vue';
import { setDecimals, checkError, showToast } from '@/utils/util';
import store from '@/store';
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

const shopName = ref('');
const shopId = ref('');
const shopCountry = ref('');
const shopAddress = ref('');

onMounted(() => {
	if (store.state.shopId == '') {
		router.push('/play');
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

	updateAmount();
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const showPopup = type => {
	popupParam.value = type;

	showModal();
};

const updateAmount = () => {
	if (amount.value > 0) {
		tkpay.value = setDecimals(amount.value / exchangeInfos[store.state.currency].price, detailInfo.decimals);
		tkpoint.value = setDecimals((amount.value / exchangeInfos[store.state.currency].price) * 0.3, tokenInfos['BEDR'].decimals);

		if (parseFloat(tkpay.value.replace(/,/g, '')) > balance) {
			tkpay.value = 0;
			tkpoint.value = 0;
		}
	}
};

const startPayment = () => {
	http
		.post('/pay/payment', {
			sid: parseInt(store.state.shopId),
			currency: store.state.currency,
			amount: amount.value.toString(),
			memo: ''
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				store.state.isBalanceUpdate = true;

				showToast(t('message.paymentSuccess'));

				store.commit('setMySymbol', { symbol: store.state.payName });

				router.push('/play');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.tkpay-box {
	background-color: #152481;
	background-size: cover;
	border-radius: 12px;
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
