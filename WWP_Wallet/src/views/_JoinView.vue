<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'login'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">{{ $t('word.join') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
		<div class="px-8 w-full">
			<div class="pb-1 text-sm">{{ $t('word.countrySelect') }}</div>
			<SmsVerify verifyType="JOIN" @updateVerify="updateVerify" @showPopupMsg="showPopupMsg" />
			<div class="h-8"></div>
		</div>
	</header>
	<main v-if="verifyId && verifyCode" class="w-full grow overflow-hidden flex flex-col items-center g-login-box">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-8"></div>
			<div class="text-center">{{ $t('word.accountInfomation') }}</div>
			<div class="h-8"></div>
			<div class="text-sm">
				{{ $t('word.recommendInfo') }} <span class="text-xs red">({{ $t('word.essential') }} )</span>
			</div>
			<div class="h-1"></div>
			<div>
				<input v-model="recommend" type="text" class="w-full h-11 text-sm text-black" :placeholder="$t('message.inputRecommendId')" />
			</div>
			<div class="h-3"></div>
			<div class="text-sm">
				{{ $t('word.password') }}
				<span class="text-xs red">({{ $t('word.essential') }} )</span>
			</div>
			<div class="h-1"></div>
			<div>
				<input v-model="passwd1" type="password" class="w-full h-11 text-sm text-black" :placeholder="$t('word.password')" />
			</div>
			<div class="h-3"></div>
			<div class="text-sm">
				{{ $t('word.passwordVerify') }}
				<span class="text-xs red">({{ $t('word.essential') }} )</span>
			</div>
			<div class="h-1"></div>
			<div>
				<input v-model="passwd2" type="password" class="w-full h-11 text-sm text-black" :placeholder="$t('word.passwordVerify')" />
			</div>
			<div class="h-3"></div>
			<div class="text-sm">
				{{ $t('word.nameInput') }}
				<span class="text-xs red">({{ $t('word.essential') }} )</span>
			</div>
			<div class="h-1"></div>
			<div><input v-model="name" type="text" class="w-full h-11 text-sm text-black" :placeholder="$t('word.nameInput')" /></div>
			<div class="h-3"></div>
			<div class="text-sm">
				{{ $t('word.emailAddress') }} <span class="text-xs blue">({{ $t('word.choice') }} )</span>
			</div>
			<div class="h-1"></div>
			<div><input v-model="email" type="text" class="w-full h-11 text-sm text-black" :placeholder="$t('word.emailAddress')" /></div>
			<div class="h-8"></div>
			<div @click="checkSignUp" class="mx-10 h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.join') }}</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import http from '@/api/http';
import SmsVerify from '@/components/SmsVerify.vue';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError } from '@/utils/util';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const phoneNumber = ref('');
const recommend = ref('');
const passwd1 = ref('');
const passwd2 = ref('');
const name = ref('');
const email = ref('');

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
	} else if (recommend.value == '') {
		popupMsg.value = t('message.inputRecommendCode');
	} else if (passwd1.value == '' || passwd2.value == '') {
		popupMsg.value = t('message.inputPassword');
	} else if (passwd1.value != passwd2.value) {
		popupMsg.value = t('message.notMatchPassword');
	} else if (passwd1.value.length < 4) {
		popupMsg.value = t('message.enterLeastPassword');
	} else if (name.value == '') {
		popupMsg.value = t('message.inputName');
	} else {
		requestSignUp();
	}
};

const requestSignUp = () => {
	http
		.post('/auth/signup', {
			account: makePhoneNumber(phoneNumber.value),
			password: passwd1.value,
			verifyId: verifyId.value,
			verifyCode: verifyCode.value,
			name: name.value,
			email: email.value,
			referral: recommend.value
		})
		.then(response => {
			console.log(response);

			// showToast(t('message.joinComplete'));

			router.push('/login');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.red {
	color: #ff0000;
}

.blue {
	color: #1b56f3;
}
</style>
