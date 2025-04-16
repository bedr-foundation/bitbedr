<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div @click="goBack" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">{{ $t('word.passwordReset') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
		<div class="px-8 w-full">
			<div class="pb-1 text-sm">{{ $t('word.countrySelect') }}</div>
			<SmsVerify @updateVerify="updateVerify" @showPopupMsg="showPopupMsg" />
			<div class="h-8"></div>
		</div>
	</header>
	<main v-if="verifyId && verifyCode" class="w-full grow overflow-hidden flex flex-col items-center g-login-box">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-8"></div>
			<div class="text-center">{{ $t('word.accountReset') }}</div>
			<div class="h-8"></div>
			<div class="text-sm">{{ $t('word.password') }}</div>
			<div class="h-1"></div>
			<div><input v-model="passwd1" type="password" class="w-full h-11 text-sm text-black" :placeholder="$t('word.password')" /></div>
			<div class="h-3"></div>
			<div class="text-sm">{{ $t('word.passwordVerify') }}</div>
			<div class="h-1"></div>
			<div><input v-model="passwd2" type="password" class="w-full h-11 text-sm text-black" :placeholder="$t('word.passwordVerify')" /></div>
			<div class="h-8"></div>
			<div @click="checkSignUp" class="mx-10 h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.complete') }}</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import SmsVerify from '@/components/SmsVerify.vue';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError } from '@/utils/util';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const phoneNumber = ref('');
const passwd1 = ref('');
const passwd2 = ref('');

const verifyId = ref('');
const verifyCode = ref('');

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

const goBack = () => {
	if (store.getters['getMyData'] == '') {
		router.push('/login');
	} else {
		router.push('/setting');
	}
};

const updateVerify = res => {
	phoneNumber.value = res.phoneNumber;
	verifyId.value = res.verifyId;
	verifyCode.value = res.verifyCode;
};

const showPopupMsg = res => {
	popupMsg.value = res;
};

const checkSignUp = () => {
	if (phoneNumber.value == '') {
		popupMsg.value = t('message.inputPhoneNumber');
	} else if (passwd1.value == '' || passwd2.value == '') {
		popupMsg.value = t('message.inputPassword');
	} else if (passwd1.value != passwd2.value) {
		popupMsg.value = t('message.notMatchPassword');
	} else if (passwd1.value.length < 4) {
		popupMsg.value = t('message.enterLeastPassword');
	} else if (name.value == '') {
		popupMsg.value = t('message.inputName');
	} else {
		requestReset();
	}
};

const requestReset = () => {
	http
		.post('/auth/resetpw', {
			account: makePhoneNumber(phoneNumber.value),
			password: passwd1.value,
			verifyId: verifyId.value,
			verifyCode: verifyCode.value
		})
		.then(response => {
			console.log(response);

			// showToast(t('message.accountUpdate'));

			goBack();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped></style>
