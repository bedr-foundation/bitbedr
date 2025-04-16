<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-10 w-full flex items-center">
			<div class="w-[15%]">
				<RouterLink to="login"><img src="@/assets/images/btn_back_white.svg" /></RouterLink>
			</div>
			<div class="grow text-white text-center">{{ $t('word.join') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-10"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-login-box">
		<div class="h-5"></div>
		<div class="px-10 w-full overflow-y-auto">
			<div class="h-3"></div>
			<div class="text-center">{{ $t('word.accountInfomation') }}</div>
			<div class="h-8"></div>
			<div class="text-base">{{ $t('word.loginId') }}</div>
			<div class="h-1"></div>
			<div class="flex">
				<div class="grow">
					<input
						v-model.trim="account"
						type="text"
						class="px-5 w-full h-11 text-sm text-black g-input-white"
						:placeholder="$t('word.loginId')"
						@keyup.enter="checkLogin"
					/>
				</div>
				<div class="pl-2 w-36">
					<div @click="checkAccount" class="h-11 flex justify-center items-center text-sm g-btn-color2">{{ $t('word.checkAccount') }}</div>
				</div>
			</div>
			<div class="h-6"></div>
			<div class="text-base">{{ $t('word.password') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="pass1"
					v-bind:type="[showPassword1 ? 'text' : 'password']"
					class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
					:placeholder="$t('word.password')"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="showPassword1 = !showPassword1">
						<div v-if="showPassword1 == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
						<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
					</div>
				</div>
			</div>
			<div class="h-6"></div>
			<div class="text-base">{{ $t('word.passwordVerify') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="pass2"
					v-bind:type="[showPassword2 ? 'text' : 'password']"
					class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
					:placeholder="$t('word.passwordVerify')"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="showPassword2 = !showPassword2">
						<div v-if="showPassword2 == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
						<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
					</div>
				</div>
			</div>
			<div class="h-6"></div>
			<div class="text-base">{{ $t('word.nameInput') }}</div>
			<div class="h-1"></div>
			<div class="flex">
				<input
					v-model.trim="name"
					type="text"
					class="px-5 w-full h-11 text-sm text-black g-input-white"
					:placeholder="$t('word.nameInput')"
					@keyup.enter="checkLogin"
				/>
			</div>
			<div class="h-6"></div>
			<div class="text-base">{{ $t('word.emailAuthTitle') }}</div>
			<div class="h-1"></div>
			<div class="flex justify-start items-center">
				<div class="w-[54%] flex">
					<input
						v-model.trim="email1"
						@input="resetTimer"
						type="text"
						class="px-5 w-full h-11 text-black text-xs g-input-white"
						:placeholder="$t('word.emailAddress')"
					/>
				</div>
				<div class="mx-1 text-xs">@</div>
				<div class="w-[54%] flex">
					<input
						v-model.trim="email2"
						@input="resetTimer"
						type="text"
						class="px-5 w-full h-11 text-black text-xs g-input-white"
						:readonly="inputMode"
					/>
				</div>
			</div>
			<div class="h-2"></div>
			<div class="flex justify-start items-center">
				<div class="w-[54%] flex"></div>
				<div class="mx-1 text-xs text-[#EBF0F5]">@</div>
				<div class="w-[54%] flex">
					<select v-model="emailType" @change="changeMailType" class="px-5 w-full h-11 text-black text-xs">
						<option value="" selected>{{ $t('word.choice') }}</option>
						<option value="input">{{ $t('word.mailInputType') }}</option>
						<option value="naver.com">naver.com</option>
						<option value="gmail.com">gmail.com</option>
						<option value="hanmail.net">hanmail.net</option>
						<option value="nate.com">nate.com</option>
						<option value="kakao.com">kakao.com</option>
					</select>
				</div>
			</div>
			<div class="h-6"></div>
			<div class="flex justify-between items-center">
				<div class="text-sm font-normal g-dark-gray">{{ $t('word.emailAuthText') }}</div>
				<div class="text-sm font-normal g-red">
					<div v-if="authStatus == true">{{ t('word.authComplete') }}</div>
					<div v-else-if="authSec > 0">{{ showTimer }}</div>
				</div>
			</div>
			<div class="h-1"></div>
			<div class="flex">
				<div class="grow">
					<input
						v-model.number="authCode"
						type="number"
						class="px-5 w-full h-11 text-sm text-black g-input-white"
						:placeholder="$t('word.emailAuthGuide')"
						@keyup.enter="checkLogin"
					/>
				</div>
				<div class="pl-2 w-48">
					<div
						v-if="email1 != '' && email2 != '' && authSec == 0 && authStatus == false"
						@click="requestAuthCode"
						class="h-11 flex justify-center items-center text-sm g-btn-color2"
					>
						{{ $t('word.emailAuthRequest') }}
					</div>
					<div v-else class="h-11 flex justify-center items-center text-sm g-btn-gray">
						{{ $t('word.emailAuthRequest') }}
					</div>
				</div>
			</div>
			<div class="h-3"></div>
			<div
				v-if="authStatus == false && authSec > 0 && authCode != ''"
				@click="checkAuthCode"
				class="h-12 flex justify-center items-center text-sm g-btn-color2"
			>
				{{ $t('word.emailAuthVerify') }}
			</div>
			<div v-else class="h-12 flex justify-center items-center text-sm g-btn-gray">
				{{ $t('word.emailAuthVerify') }}
			</div>
			<div class="h-10"></div>
			<div class="w-full flex justify-center items-center" @click="toggleAgree">
				<div class="text-sm g-dark-gray">{{ $t('word.termsAndPrivacyAgree') }}</div>
				<div v-if="agree === false" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
				<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
			</div>
			<div class="h-2"></div>
			<div class="text-center text-sm g-dark-gray" @click="$router.push('/privacy')">{{ $t('word.viewTerms') }} ></div>
			<div class="h-6"></div>
			<div @click="requestSignUp" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.join') }}</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError, checkEmail, pad } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const account = ref('');
const pass1 = ref('');
const pass2 = ref('');
const name = ref('');
const email1 = ref('');
const email2 = ref('');
const emailType = ref('');
const inputMode = ref(true);
const agree = ref(false);
const authCode = ref('');
const authToken = ref('');
const verifyId = ref('');

const movePage = ref(false);

const showPassword1 = ref(false);
const showPassword2 = ref(false);

const authStatus = ref(false);
const showTimer = ref('');
const authSec = ref(0);

var authTimer = null;

onMounted(() => {});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	visible.value = false;
	popupMsg.value = '';

	if (movePage.value == true) {
		movePage.value = false;

		router.push('/login');
	}
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const toggleAgree = () => {
	agree.value = !agree.value;
};

const changeMailType = () => {
	resetTimer();

	if (emailType.value == 'input') {
		email2.value = '';
		inputMode.value = false;
	} else {
		email2.value = emailType.value;
		inputMode.value = true;
	}
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

		sendAuthCode();

		authTimer = setTimeout(() => {
			updateTimer();
		}, 1000);
	}
};

const checkAccount = () => {
	if (account.value == '') {
		popupMsg.value = t('message.inputLoginId');
		return false;
	} else if (account.value.length < 4) {
		popupMsg.value = t('message.enterLeastLoginId');
		return false;
	}

	http
		.get('/auth/checkaccount', {
			params: {
				account: account.value
			}
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				popupMsg.value = t('message.checkSuccessLoginId');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const sendAuthCode = () => {
	if (email1.value == '') {
		popupMsg.value = t('message.inputEmail');
		return false;
	} else if (email2.value == '') {
		popupMsg.value = t('message.inputEmail');
		return false;
	} else if (checkEmail(email1.value + '@' + email2.value) == true) {
		popupMsg.value = t('message.emailFormatError');
		return false;
	}

	http
		.post('/auth/requestCode', {
			type: 'signup',
			email: email1.value + '@' + email2.value
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				authToken.value = response.data.data.token;
			} else {
				authToken.value = '';
			}
		})
		.catch(error => {
			resetTimer();

			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const checkAuthCode = () => {
	http
		.post('/auth/verifyCode', {
			token: authToken.value,
			code: pad(authCode.value, 6)
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				authStatus.value = true;

				clearTimeout(authTimer);

				authSec.value = 0;

				updateShowTimer();

				verifyId.value = response.data.data.verifyId;
			} else {
				verifyId.value = '';
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const requestSignUp = () => {
	if (account.value == '') {
		popupMsg.value = t('message.inputLoginId');
		return false;
	} else if (account.value.length < 4) {
		popupMsg.value = t('message.enterLeastLoginId');
		return false;
	} else if (pass1.value == '') {
		popupMsg.value = t('message.inputPassword');
		return false;
	} else if (pass1.value.length < 8) {
		popupMsg.value = t('message.enterLeastPassword');
		return false;
	} else if (pass2.value == '') {
		popupMsg.value = t('message.checkPassword');
		return false;
	} else if (pass1.value != pass2.value) {
		popupMsg.value = t('message.notMatchPassword');
		return false;
	} else if (name.value == '') {
		popupMsg.value = t('message.inputName');
		return false;
	} else if (email1.value == '') {
		popupMsg.value = t('message.inputEmail');
		return false;
	} else if (email2.value == '') {
		popupMsg.value = t('message.inputEmail');
		return false;
	} else if (agree.value === false) {
		popupMsg.value = t('message.termsAndPrivacyAgree');
		return false;
	} else if (checkEmail(email1.value + '@' + email2.value) == true) {
		popupMsg.value = t('message.emailFormatError');
		return false;
	} else if (authStatus.value == false) {
		popupMsg.value = t('message.emailAuthRequire');
		return false;
	}

	http
		.post('/auth/signup', {
			account: account.value,
			password: pass1.value,
			type: 1,
			verifyId: verifyId.value,
			verifyCode: pad(authCode.value, 6),
			name: name.value,
			email: email1.value + '@' + email2.value
		})
		.then(response => {
			console.log(response);

			router.push('/login');
			//movePage.value = true;
			//popupMsg.value = t('message.checkActivityEmail');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.line {
	background: #c9d8f5;
}
</style>
