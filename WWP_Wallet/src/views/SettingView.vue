<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="flex justify-center items-center">Setting</div>
		<div class="h-7"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto font-normal">
			<div class="px-5 py-3 flex g-list-box" @click="$router.push('/notice')">
				<div><img src="@/assets/images/setting_notice.svg" /></div>
				<div class="ml-5">{{ $t('word.notice') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box" @click="$router.push('/myInfo')">
				<div><img src="@/assets/images/setting_myinfo.svg" /></div>
				<div class="ml-5">{{ $t('word.myInfo') }}</div>
			</div>
			<div class="h-2"></div>
			<div v-if="myData.useOTP == false" class="px-5 py-3 flex g-list-box" @click="$router.push('/otpRegister')">
				<div><img src="@/assets/images/setting_otp.svg" /></div>
				<div class="ml-5">OTP</div>
				<div class="grow"></div>
				<div class="ml-2">{{ $t('word.register') }}</div>
			</div>
			<div v-else class="px-5 py-3 flex g-list-box" @click="$router.push('/otpRemove')">
				<div><img src="@/assets/images/setting_otp.svg" /></div>
				<div class="ml-5">OTP</div>
				<div class="grow"></div>
				<div class="ml-2">{{ $t('word.remove') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box" @click="$router.push('/privacy')">
				<div><img src="@/assets/images/setting_privacy.svg" /></div>
				<div class="ml-5">{{ $t('word.termsAndPrivacy') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box" @click="$router.push('/company')">
				<div><img src="@/assets/images/setting_company.svg" /></div>
				<div class="ml-5">{{ $t('word.companyInfomation') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex justify-center items-center g-list-box" @click="showPopup('locale')">
				<div><img src="@/assets/images/setting_locale.svg" /></div>
				<div class="ml-5">{{ $t('word.lang') }}</div>
				<div class="grow"></div>
				<template v-for="lo in locales" :key="lo.name">
					<div v-if="store.state.locale == lo.name">{{ $t('common.' + lo.type) }}</div>
				</template>
				<div class="ml-2"><img src="@/assets/images/change_arrow.svg" /></div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex justify-center items-center g-list-box" @click="showPopup('currency')">
				<div><img src="@/assets/images/setting_currency.svg" /></div>
				<div class="ml-5">{{ $t('word.currency') }}</div>
				<div class="grow"></div>
				<template v-for="ex in exchangeInfos" :key="ex.currency">
					<div v-if="store.state.currency == ex.currency">{{ ex.currency }}</div>
				</template>
				<div class="ml-2"><img src="@/assets/images/change_arrow.svg" /></div>
			</div>
			<!-- 			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box">
				<div><img src="@/assets/images/setting_mycode.svg" /></div>
				<router-link :to="'myCheck'" class="ml-5">{{ $t('word.myCodeView') }} </router-link>
			</div> -->
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box" @click="$router.push('/change')">
				<div><img src="@/assets/images/setting_reset.svg" /></div>
				<div class="ml-5">{{ $t('word.passwordReset') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box">
				<div><img src="@/assets/images/setting_withdraw.svg" /></div>
				<div class="ml-5" @click="$router.push('/secession')">{{ $t('word.secession') }}</div>
			</div>
			<div class="h-2"></div>
			<div class="px-5 py-3 flex g-list-box" @click="showPopup('logout')">
				<div><img src="@/assets/images/setting_logout.svg" /></div>
				<div class="ml-5">{{ $t('word.logout') }}</div>
			</div>
			<div class="h-10"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full">
		<div class="w-full g-footer">
			<div class="px-5 flex justify-around items-center" style="position: relative">
				<router-link :to="'play'"><img src="@/assets/images/menu_wallet.svg" /></router-link>
				<router-link :to="'wwpworld'"><img src="@/assets/images/menu_nft.svg" /></router-link>
				<div><img src="@/assets/images/menu_setting_select.svg" /></div>
			</div>
		</div>
	</footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div v-if="popupParam == 'logout'" class="w-full">
			<div class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
			<div class="h-6"></div>
			<div class="text-center font-normal">{{ $t('message.checkLogout') }}</div>
			<div class="h-8"></div>
			<div class="w-full flex justify-center items-center">
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-none-s" @click="hideModal">{{ $t('word.cancel') }}</div>
				<div class="w-5"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="requestLogout">{{ $t('word.check') }}</div>
			</div>
			<div class="h-6"></div>
		</div>
		<div v-else-if="popupParam == 'withdraw'" class="w-full">
			<div class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
			<div class="h-6"></div>
			<div class="text-center font-normal">{{ $t('message.checkWithdrawal') }}</div>
			<div class="h-8"></div>
			<div class="relative">
				<input v-model="passwd" :type="passwdType" class="w-60 pr-10" />
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType">
						<img v-if="passwdType == 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-8"></div>
			<div class="w-full flex justify-center items-center">
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-none-s" @click="hideModal">{{ $t('word.cancel') }}</div>
				<div class="w-5"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="checkWithdraw">{{ $t('word.check') }}</div>
			</div>
			<div class="h-6"></div>
		</div>
		<div v-else-if="popupParam == 'locale'" class="w-full">
			<SelectLocale @updateLocale="hideModal" />
		</div>
		<div v-else-if="popupParam == 'currency'" class="w-full">
			<SelectCurrency @updateCurrency="hideModal" />
		</div>
	</MainModal>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import SelectLocale from '@/components/SelectLocale.vue';
import SelectCurrency from '@/components/SelectCurrency.vue';
import MainModal from '@/components/MainModal.vue';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';
import { locales } from '@/config/constants/locale';

const { t } = useI18n();

const popupParam = ref('');
const passwd = ref('');
const passwdType = ref('password');

const exchangeInfos = store.getters['getExchangeInfos'];

const myData = reactive(store.getters['getMyData']);

const mCard = ref(null);

onMounted(() => {
	store.state.mainPage = 'setting';
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
// Popup End =====================

const changeInputType = () => {
	passwdType.value = passwdType.value == 'password' ? 'text' : 'password';
};

const showInReady = () => {
	popupMsg.value = t('message.inReady');
};

const showPopup = type => {
	if (type == 'withdraw') {
		passwd.value = '';
	}

	popupParam.value = type;

	showModal();
};

const checkWithdraw = () => {
	if (passwd.value == '') {
		showToast(t('message.inputPassword'));
	} else {
		requestSignout();
	}
};

const requestSignout = () => {
	let myData = store.getters['getMyData'];

	http
		.post('/auth/secession', {
			uid: myData.uid,
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				// showToast(t('message.withdrawalComplete'));

				store.commit('setPhoneNumber', { phoneNumber: '' });

				router.push('/login');
			} else {
				showToast(t('message.errorRetry'));
			}
		})
		.catch(error => {
			// popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			hideModal();
			showToast(error.response.data.message);
		});
};

const requestLogout = () => {
	store.commit('setAccessToken', { accessToken: '' });

	hideModal();

	router.push('/login');
};

const showPopupMsg = res => {
	popupMsg.value = res;
};
</script>

<style scoped></style>
