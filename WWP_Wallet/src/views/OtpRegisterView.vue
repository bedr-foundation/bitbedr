<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="goBack"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">OTP Registration</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-5"></div>
		<div class="px-8">
			<div>{{ $t('message.otpInstallApp') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray">
				<li>And : Play Store > Google OTP</li>
				<li>iOS : App Store > Google Authenticator</li>
			</ul>
		</div>
		<div class="h-5"></div>
		<div class="px-20">
			<div v-if="address != ''" class="p-6 flex justify-center items-center qrcode">
				<div class="p-4 qrcode-bg">
					<QRCodeVue3
						:dotsOptions="{ type: 'square', color: '#000000' }"
						:cornersSquareOptions="{ type: 'square', color: '#000000' }"
						:cornersDotOptions="{ type: 'square', color: '#000000' }"
						:value="address"
					/>
				</div>
			</div>
			<div class="h-3"></div>
		</div>
		<div class="px-8 w-full overflow-y-auto">
			<div @click="showPopup('guide')" class="text-center text-[#0B6BF3]">{{ $t('word.otpGuide') }} ></div>
			<div class="h-5"></div>
			<div>{{ $t('word.otpSettingsKey') }}</div>
			<div class="h-1"></div>
			<div class="flex justify-center items-center">
				<div class="pt-3 px-5 py-2 break-all font-normal truncate address-text">{{ key }}</div>
			</div>
			<div class="h-3"></div>
			<div class="flex justify-center items-center" @click="copyToClipboard"><img src=@/assets/images/btn_copy_key.svg/></div>
			<div class="h-8"></div>
			<div>{{ $t('word.otpEnterCode') }}</div>
			<div class="h-2"></div>
			<input
				v-model="authCode"
				type="tel"
				maxlength="6"
				class="px-5 w-full h-11 text-sm text-black g-input-white"
				:placeholder="$t('word.authCode')"
			/>
			<div class="h-5"></div>
			<div
				@click="otpAdd"
				class="h-12 flex justify-center items-center text-sm"
				:class="[authCode.length == 6 ? 'g-btn-color' : 'g-btn-gray']"
			>
				{{ $t('word.otpRegister') }}
			</div>
			<div class="h-10"></div>
		</div>
		<div class="h-10"></div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg" :bgColor="bgColor">
		<div v-if="popupParam == 'guide'" class="w-full max-h-[600px] flex flex-col justify-center items-center grow overflow-hidden">
			<div class="w-full overflow-y-auto">
				<div class="flex justify-end items-center"><img @click="hideModal" src="@/assets/images/btn_close.svg" /></div>
				<div class="h-3"></div>
				<div class="flex text-center font-normal">
					<div class="text-[#0B6BF3]">Google OTP</div>
					<div class="ml-1">Installation Guide</div>
				</div>
				<div class="h-3"></div>
				<ul class="px-6 list-disc text-sm g-gray">
					<li>And : Play Store > Google OTP</li>
					<li>iOS : App Store > Google Authenticator</li>
				</ul>
				<div class="h-3"></div>
				<div class="text-center font-normal text-[#0B6BF3]">
					Please add the WWP Wallet by scanning the QR code or copying and entering the setup key issued.
				</div>
				<div class="h-5"></div>
				<div class="flex flex-col justify-center items-center">
					<img src="@/assets/images/otp_guide1.png" />
					<div class="h-3"></div>
					<img src="@/assets/images/otp_guide2.png" />
					<div class="h-3"></div>
					<img src="@/assets/images/otp_guide3.png" />
				</div>
				<div class="h-10"></div>
				<div class="w-full flex justify-center items-center">
					<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="hideModal">{{ $t('word.check') }}</div>
				</div>
				<div class="h-6"></div>
			</div>
		</div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import QRCodeVue3 from 'qrcode-vue3';
import { showToast, checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const myData = reactive(store.getters['getMyData']);

const popupParam = ref('');
const bgColor = ref('');

const address = ref('');
const key = ref('');
const authCode = ref('');

onMounted(() => {
	otpInit();
});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	bgColor.value = '';

	popupMsg.value = '';
	visible.value = false;
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End =====================

const goBack = () => {
	router.push('/setting');
};

const showPopup = type => {
	popupParam.value = type;

	if (type == 'guide') {
		bgColor.value = '#EBF0F5';
	}

	showModal();
};

const copyToClipboard = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.clipboard.copy(
			{
				type: 'text',
				data: key.value
			},
			res => {
				console.log(res.data);
			}
		);
	} else {
		navigator.clipboard.writeText(key.value);
	}

	showToast(t('message.copyClipboard'));
};

const otpInit = () => {
	http
		.post('/auth/otp/init', {})
		.then(response => {
			console.log(response);

			address.value = response.data.data.qrcode;
			key.value = response.data.data.seed;
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const otpAdd = () => {
	if (authCode.value.length != 6) return false;

	http
		.post('/auth/otp/add', {
			otp: authCode.value.toString()
		})
		.then(response => {
			console.log(response);

			if (response.data.data.verified == true) {
				myData.useOTP = true;

				store.commit('setMyData', { data: myData });

				router.push('/setting');
			} else {
				popupMsg.value = t('error.INCORRET_VERIFY_CODE');
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.qrcode {
	max-width: 300px;
	border-radius: 30px;
	border: 2px solid #0b0f27;
	background: #0b0f27;
}

.qrcode-bg {
	background: #ffffff;
}

.address-text {
	max-width: 400px;
	border-radius: 30px;
	background: #c5c5c5;
	color: #000000;
}
</style>
