<template>
	<div>
		<SelectCountry />
	</div>
	<div class="h-5"></div>
	<div class="pb-1 text-sm">{{ $t('word.phoneNumber') }}</div>
	<div class="flex">
		<div class="grow">
			<input v-model="phoneNumber" type="text" class="w-full h-11 text-sm" :placeholder="$t('word.phoneNumber')" />
		</div>
		<div @click="checkPhoneNumber" class="ml-3 p-2 w-[40%] h-11 flex justify-center items-center text-sm g-btn-color">
			{{ $t('word.authCodeRequest') }}
		</div>
	</div>
	<div class="h-5"></div>
	<div class="pb-1 flex text-sm">
		<div>{{ $t('word.authCode') }}</div>
		<div class="ml-3 text-[#F93968]">{{ showRemainTime }}</div>
	</div>
	<div class="flex">
		<div class="grow">
			<input v-model="authCode" type="text" class="w-full h-11 text-sm" :placeholder="$t('word.authCode')" />
		</div>
		<div @click="verifyAuthCode" class="ml-3 p-2 w-[40%] h-11 flex justify-center items-center text-sm g-btn-none">
			{{ $t('word.check') }}
		</div>
	</div>
</template>

<script setup>
import { ref, toRefs, defineEmits, defineProps } from 'vue';
import http from '@/api/http';
import SelectCountry from '@/components/SelectCountry.vue';
import { makePhoneNumber, fillZero, checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['updateVerify', 'showPopupMsg']);

const props = defineProps({
	verifyType: {
		type: String,
		default: () => 'CHECK'
	}
});

const { verifyType } = toRefs(props);

const phoneNumber = ref('');
const authCode = ref('');

const verifyId = ref('');
const verifyCode = ref('');

const authCodeRemainTime = 60 * 5;
const showRemainTime = ref('');
let remainTime = authCodeRemainTime;
let authCodeTimer = null;

const authCodeSec = () => {
	if (remainTime <= 0) {
		clearInterval(authCodeTimer);

		showRemainTime.value = '';
		remainTime = 0;
	} else {
		let min = parseInt(remainTime / 60);
		let sec = remainTime % 60;

		if (min > 0) {
			showRemainTime.value = fillZero(2, min) + ':' + fillZero(2, sec);
		} else {
			showRemainTime.value = '00:' + fillZero(2, sec);
		}

		remainTime -= 1;
	}
};

const checkPhoneNumber = () => {
	if (phoneNumber.value == '' || phoneNumber.value.length != 11) {
		emit('showPopupMsg', t('message.checkPhoneNumber'));
	} else if (verifyType.value != 'JOIN') {
		clearInterval(authCodeTimer);
		remainTime = authCodeRemainTime;
		authCodeTimer = setInterval(() => {
			authCodeSec();
		}, 1000);

		requestAuthCode();
	} else {
		verifyId.value = '';

		http
			.get('auth/checksms', {
				params: {
					phoneNumber: makePhoneNumber(phoneNumber.value)
				}
			})
			.then(response => {
				console.log(response);

				if (response.data.status == 1) {
					clearInterval(authCodeTimer);
					remainTime = authCodeRemainTime;
					authCodeTimer = setInterval(() => {
						authCodeSec();
					}, 1000);

					requestAuthCode();
				}
			})
			.catch(error => {
				let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
				emit('showPopupMsg', errMsg);
			});
	}
};

const requestAuthCode = () => {
	if (phoneNumber.value == '') {
		emit('showPopupMsg', t('message.checkPhoneNumber'));
	} else {
		http
			.post('auth/smssign', {
				phoneNumber: makePhoneNumber(phoneNumber.value)
			})
			.then(response => {
				console.log(response);

				if (response.data.status != 1) {
					emit('showPopupMsg', t('message.checkAuthCode'));
				} else {
					verifyId.value = response.data.verifyId;
				}
			})
			.catch(error => {
				let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
				emit('showPopupMsg', errMsg);
			});
	}
};

const verifyAuthCode = () => {
	if (phoneNumber.value == '') {
		emit('showPopupMsg', t('message.checkPhoneNumber'));
	} else if (authCode.value == '') {
		emit('showPopupMsg', t('message.inputAuthCode'));
		return false;
	} else if (verifyId.value == '') {
		emit('showPopupMsg', t('message.afterRequestAuth'));
		return false;
	} else {
		http
			.post('auth/smsverify', {
				phoneNumber: makePhoneNumber(phoneNumber.value),
				verifyCode: authCode.value
			})
			.then(response => {
				console.log(response);

				if (response.data.status == 1) {
					remainTime = 0;

					verifyId.value = response.data.data.verifyId;
					verifyCode.value = response.data.data.verifyCode;

					emit('updateVerify', { phoneNumber: phoneNumber.value, verifyId: verifyId.value, verifyCode: verifyCode.value });
				} else {
					verifyId.value = '';
					verifyCode.value = '';

					emit('updateVerify', { phoneNumber: '', authCode: '' });
					emit('showPopupMsg', t('message.checkAuthCode'));
				}
			})
			.catch(error => {
				let errMsg = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
				emit('showPopupMsg', errMsg);
			});
	}
};
</script>

<style scoped></style>
