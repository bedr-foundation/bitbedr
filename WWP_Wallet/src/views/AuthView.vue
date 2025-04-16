<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="goBack"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">{{ $t('word.auth') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-6"></div>
			<div>{{ $t('word.processInformation') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray auth">
				<!-- <li>{{ $t('message.warnProcess1') }}</li> -->
				<li>{{ $t('message.warnProcess2') }}</li>
				<li>{{ $t('message.warnProcess3') }}</li>
			</ul>
			<div class="h-20"></div>
			<!-- 비밀번호 인증 START -->
			<div class="hidden">
				<div class="relative">
					<input :type="passwdType" v-model="passwd" class="w-full text-black g-input-white" />
					<div class="flex absolute inset-y-0 right-0 items-center pl-3">
						<div class="pr-3" @click="changeInputType">
							<img v-if="passwdType != 'password'" src="@/assets/images/btn_eyes.svg" />
							<img v-else src="@/assets/images/btn_eyes_disable.svg" />
						</div>
					</div>
				</div>
				<div class="h-16"></div>
				<template v-if="store.state.device == 'Mobile'">
					<div class="flex justify-center items-start" @click="toogleFinger">
						<div class="text-center g-dark-gray font-normal">{{ $t('word.useFingerprint') }}</div>
						<div v-if="store.state.useFinger == 'NO'" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
						<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
					</div>
				</template>
				<div class="h-3"></div>
				<div class="w-full flex justify-center items-center">
					<div
						@click="checkPasswd"
						class="w-64 h-10 flex justify-center items-center text-sm"
						:class="[passwd != '' ? 'g-btn-color' : 'g-btn-light-gray']"
					>
						{{ $t('word.check') }}
					</div>
				</div>
			</div>
			<!-- 비밀번호 인증 END -->
			<!-- 이메일 인증 START -->
			<div>
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
							maxlength="6"
							oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							class="px-5 w-full h-11 text-sm text-black g-input-white"
							:placeholder="$t('word.emailAuthGuide')"
						/>
					</div>
					<div class="pl-2 w-48">
						<div
							v-if="authSec == 0 && authStatus == false"
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
					@click="verfiyEmail"
					class="h-12 flex justify-center items-center text-sm g-btn-color2"
				>
					{{ $t('word.emailAuthVerify') }}
				</div>
				<div v-else class="h-12 flex justify-center items-center text-sm g-btn-gray">
					{{ $t('word.emailAuthVerify') }}
				</div>
				<template v-if="(sendAddress != '' && sendPrice > 0) || (withdrawTokenId > 0 && withdrawIdx > 0 && withdrawQty > 0)">
					<div class="h-5"></div>
					<div class="text-sm font-normal g-dark-gray">{{ $t('word.otpEnterCode') }}</div>
					<input
						v-model.number="otp"
						type="number"
						maxlength="6"
						oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
						class="px-5 w-full h-11 text-sm text-black g-input-white"
						:placeholder="$t('word.emailAuthGuide')"
					/>
				</template>
				<div class="h-10"></div>
				<div @click="checkEmail" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.check') }}</div>
			</div>
			<!-- 이메일 인증 END -->
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
import openCrypto from '@/utils/openCrypto';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mySymbol = store.state.mySymbol;
const myData = reactive(store.getters['getMyData']);
const detailInfo = store.getters['getTokenInfos'][mySymbol];
const myAddress = ref();
const balance = myData[mySymbol];

const passwd = ref('');
const passwdType = ref('password');

const sendAddress = store.state.sendAddress;
const sendPrice = store.state.sendPrice;
const sendMemo = store.state.sendMemo;

const swapSymbol = store.state.swapSymbol;
const swapAmount = store.state.swapAmount;

const withdrawTokenId = store.state.withdrawTokenId;
const withdrawIdx = store.state.withdrawIdx;
const withdrawQty = store.state.withdrawQty;

const verifyId = ref('');
const verifyCode = ref('');

const authStatus = ref(false);
const showTimer = ref('');
const authSec = ref(0);
const token = ref('');
const authCode = ref('');

const otp = ref('');

var authTimer = null;

onMounted(() => {
	if (detailInfo.chainId == 'TRON') {
		myAddress.value = myData.wallet.tronAddress;
	} else {
		myAddress.value = myData.wallet.address;
	}

	if (store.state.device == 'Mobile' && store.state.useFinger == 'YES') {
		showFingerprint();
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
// Popup End =====================

const goBack = () => {
	if (store.state.mySymbol == '') {
		router.push('play');
	} else {
		router.push('/detail');
	}
};

const checkFingerprintSuccess = () => {
	const decode = openCrypto.decode(store.state.myPasswd);

	passwd.value = decode;

	checkPasswd();
};

const checkFingerprintError = error => {
	passwd.value = '';

	console.log(error);
};

const showFingerprint = () => {
	window.plugins.Fingerprint.show(
		{
			title: t('word.useFingerprint'),
			description: t('message.authFingerprint'),
			cancelButtonTitle: t('word.cancel')
		},
		checkFingerprintSuccess,
		checkFingerprintError
	);
};

const toogleFinger = () => {
	if (store.state.useFinger == 'NO') {
		store.commit('setFinger', { mode: 'YES' });

		showFingerprint();
	} else {
		store.commit('setFinger', { mode: 'NO' });
	}
};

const changeInputType = () => {
	passwdType.value = passwdType.value == 'password' ? 'text' : 'password';
};

const checkPasswd = () => {
	if (passwd.value == '') return false;

	http
		.post('/auth/pwverify', {
			uid: myData.uid,
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			verifyId.value = response.data.data.verifyId;
			verifyCode.value = response.data.data.verifyCode;

			if (sendAddress != '' && sendPrice > 0) {
				sendCoin();
			} else if (swapSymbol != '' && swapAmount > 0) {
				swapCoin();
			} else if (withdrawTokenId > 0 && withdrawIdx > 0 && withdrawQty > 0) {
				withdrawCoin();
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			passwd.value = '';
		});
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

const verfiyEmail = () => {
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
			} else {
				verifyId.value = '';
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			passwd.value = '';
		});
};

const checkEmail = () => {
	if (authStatus.value == false) {
		popupMsg.value = t('message.emailAuthRequire');
		return false;
	}

	if (sendAddress != '' && sendPrice > 0) {
		sendCoin();
	} else if (swapSymbol != '' && swapAmount > 0) {
		swapCoin();
	} else if (withdrawTokenId > 0 && withdrawIdx > 0 && withdrawQty > 0) {
		withdrawCoin();
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

		requestEmail();

		authTimer = setTimeout(() => {
			updateTimer();
		}, 1000);
	}
};

const sendCoin = () => {
	http
		.post('/token/sendCoin', {
			symbol: mySymbol,
			address: sendAddress,
			amount: sendPrice.toString(),
			verifyId: verifyId.value,
			verifyCode: pad(verifyCode.value, 6),
			memo: sendMemo,
			otp: pad(otp.value, 6)
		})
		.then(response => {
			console.log(response);

			store.state.isBalanceUpdate = true;

			if (response.data.message != 'Success') {
				popupMsg.value = t('message.errorSendProcess');
			} else {
				router.push('/play');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			if (error.response.data.errorId != 'ERROR_INVALID_ACCESS_OTP' && error.response.data.errorId != 'ERROR_NOT_MATCH_OTP') {
				resetTimer();

				passwd.value = '';
			}
		});
};

const swapCoin = () => {
	http
		.post('/swap/send', {
			fromSymbol: mySymbol,
			toSymbol: swapSymbol,
			amount: swapAmount.toString(),
			currency: store.state.currency
			/* 			verifyId: verifyId.value,
			verifyCode: verifyCode.value */
		})
		.then(response => {
			console.log(response);

			store.state.isBalanceUpdate = true;

			if (response.data.message != 'Success') {
				popupMsg.value = t('message.errorSendProcess');
			} else {
				router.push('/play');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			resetTimer();

			passwd.value = '';
		});
};

const withdrawCoin = () => {
	http
		.post('/users/withdraw', {
			verifyId: verifyId.value,
			verifyCode: pad(verifyCode.value, 6),
			tid: withdrawIdx,
			tokenId: withdrawTokenId,
			address: myAddress.value,
			withdrawQty: withdrawQty,
			otp: pad(otp.value, 6)
		})
		.then(response => {
			console.log(response);

			if (response.data.message != 'Success') {
				popupMsg.value = t('message.errorSendProcess');
			} else {
				router.push('/play');
				// refreshMyToken();
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			if (error.response.data.errorId != 'ERROR_INVALID_ACCESS_OTP' && error.response.data.errorId != 'ERROR_NOT_MATCH_OTP') {
				resetTimer();

				passwd.value = '';
			}
		});
};

const refreshMyToken = () => {
	http
		.get('/users/mytokens', {
			params: {}
		})
		.then(response => {
			console.log(response);

			let res = response.data.data;
			let myToken = null;

			for (let key in res) {
				if (res[key].symbol == mySymbol) {
					myToken = res[key].list;
				}
			}

			for (let key in myData.mytoken) {
				let tokenSymbol = myData.mytoken[key].symbol;

				if (tokenSymbol == mySymbol) {
					myData.mytoken[key].list = myToken;
				}
			}

			store.commit('setMyData', {
				data: myData
			});

			router.push('/play');
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
