<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="goBack"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">Delete OTP</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-6"></div>
			<div>{{ $t('word.otpRemove') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray auth">
				<li>{{ $t('message.sendVerifyCode') }}</li>
			</ul>
			<div class="h-10"></div>
			<div>
				<div class="flex">
					<div class="grow">
						<input type="text" :value="myData.email" class="g-input-white" readOnly />
					</div>
					<div class="pl-2 w-48">
						<div
							v-if="authSec == 0 && authStatus == false"
							@click="requestAuthCode"
							class="h-11 flex justify-center items-center text-sm g-btn-color"
						>
							{{ $t('word.emailAuthRequest') }}
						</div>
						<div v-else class="h-11 flex justify-center items-center text-sm g-btn-gray">
							{{ $t('word.emailAuthRequest') }}
						</div>
					</div>
				</div>
				<div class="h-8"></div>
				<div class="flex justify-end items-center">
					<div class="text-sm font-normal g-red">
						<div v-if="authStatus == true">{{ t('word.authComplete') }}</div>
						<div v-else-if="authSec > 0">{{ showTimer }}</div>
					</div>
				</div>
				<div class="h-2"></div>
				<input
					v-model="authCode"
					type="tel"
					maxlength="6"
					class="px-5 w-full h-11 text-sm text-black g-input-white"
					:placeholder="$t('word.emailAuthGuide')"
				/>
				<div class="h-10"></div>
				<div
					v-if="authStatus == false && authSec > 0 && authCode.length == 6"
					@click="verifyEmail"
					class="h-12 flex justify-center items-center text-sm g-btn-color"
				>
					{{ $t('word.emailAuthVerify') }}
				</div>
				<div v-else class="h-12 flex justify-center items-center text-sm g-btn-gray">
					{{ $t('word.emailAuthVerify') }}
				</div>
				<div class="h-5"></div>
			</div>
			<div class="h-5"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full footer-main"></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { checkError, pad } from '@/utils/util';
import store from '@/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const myData = reactive(store.getters['getMyData']);

const verifyId = ref('');
const verifyCode = ref('');

const popupType = ref('');

const authStatus = ref(false);
const showTimer = ref('');
const authSec = ref(0);
const token = ref('');
const authCode = ref('');

var authTimer = null;

onMounted(() => {});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	popupMsg.value = '';
	visible.value = false;

	if (popupType.value == 'OTP_REMOVE') {
		popupType.value = '';

		router.push('/setting');
	}
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End =====================

const goBack = () => {
	router.push('/setting');
};

const requestEmail = () => {
	http
		.post('/auth/emailverify', {})
		.then(response => {
			console.log(response);

			token.value = response.data.data.token;
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const verifyEmail = () => {
	if (authStatus.value == true || authSec.value <= 0 || authCode.value.length != 6) return false;

	http
		.post('/auth/verifyCode', {
			token: token.value,
			code: pad(authCode.value, 6)
		})
		.then(response => {
			console.log(response);

			verifyId.value = response.data.data.verifyId;
			verifyCode.value = authCode.value;

			if (response.data.status == 1) {
				authStatus.value = true;

				clearTimeout(authTimer);

				authSec.value = 0;

				updateShowTimer();

				verifyId.value = response.data.data.verifyId;

				otpRemove();
			} else {
				verifyId.value = '';
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const updateTimer = () => {
	clearTimeout(authTimer);

	if (authSec.value > 0) {
		authSec.value -= 1;

		updateShowTimer();

		authTimer = setTimeout(() => {
			updateTimer();
		}, 1000);
	} else {
		resetTimer();
	}
};

const updateShowTimer = () => {
	if (authSec.value > 0) {
		let min = parseInt(authSec.value / 60);
		let sec = authSec.value - 60 * min;

		showTimer.value = pad(min, 2) + ':' + pad(sec, 2);
	} else {
		showTimer.value = '';
	}
};

const resetTimer = () => {
	clearTimeout(authTimer);

	authCode.value = '';
	authStatus.value = false;
	authSec.value = 0;

	updateShowTimer();
};

const requestAuthCode = () => {
	if (authSec.value == 0) {
		authSec.value = 360;
		updateShowTimer();

		requestEmail();

		authTimer = setTimeout(() => {
			updateTimer();
		}, 1000);
	}
};

const otpRemove = () => {
	http
		.post('/auth/otp/del', {
			verifyId: verifyId.value,
			verifyCode: verifyCode.value
		})
		.then(response => {
			console.log(response);

			if (response.data.data.deleted == true) {
				myData.useOTP = false;

				store.commit('setMyData', { data: myData });

				popupType.value = 'OTP_REMOVE';
				popupMsg.value = t('message.otpRemove');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.auth {
	line-height: 24px;
}
</style>
