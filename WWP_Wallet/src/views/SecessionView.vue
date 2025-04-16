<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'setting'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">{{ $t('word.secession') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-6"></div>
			<div>{{ $t('message.secessionMsg1') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray auth">
				<li>{{ $t('message.secessionMsg2') }}</li>
				<li>{{ $t('message.secessionMsg3') }}</li>
				<li>{{ $t('message.secessionMsg4') }}</li>
				<li>{{ $t('message.secessionMsg5') }}</li>
				<li>{{ $t('message.secessionMsg6') }}</li>
				<li class="text-[#FF0000]">{{ $t('message.secessionMsg7') }}</li>
			</ul>
			<div class="h-8"></div>
			<div>{{ $t('word.password') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input :type="passwdType" v-model="passwd" class="w-full text-black g-input-white" />
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType">
						<img v-if="passwdType != 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-3"></div>
			<div class="w-full flex justify-center items-center" @click="toggleAgree">
				<div class="text-sm g-dark-gray">{{ $t('word.secessionAgree') }}</div>
				<div v-if="agree === false" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
				<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
			</div>
			<div class="h-3"></div>
			<!--
			<template v-if="store.state.device == 'Mobile'">
				<div class="flex justify-center items-start" @click="toogleFinger">
					<div class="text-center g-dark-gray font-normal">{{ $t('word.useFingerprint') }}</div>
					<div v-if="store.state.useFinger == 'NO'" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
					<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
				</div>
			</template>
			-->
			<div class="h-3"></div>
			<div class="w-full flex justify-center items-center">
				<div
					@click="checkPasswd"
					class="w-64 h-10 flex justify-center items-center text-sm"
					:class="[passwd != '' && agree == true ? 'g-btn-color' : 'g-btn-light-gray']"
				>
					{{ $t('word.secession') }}
				</div>
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
import { checkError } from '@/utils/util';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const myData = reactive(store.getters['getMyData']);

const passwd = ref('');
const passwdType = ref('password');

const agree = ref(false);

onMounted(() => {
	if (store.state.device == 'Mobile' && store.state.useFinger == 'YES') {
		//showFingerprint();
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

const toggleAgree = () => {
	agree.value = !agree.value;
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
	if (agree.value == false) return false;

	http
		.post('/auth/secession', {
			uid: myData.uid,
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			store.commit('setAccessToken', { accessToken: '' });
			store.commit('setPhoneNumber', { phoneNumber: '' });

			router.push('/login');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);

			passwd.value = '';
		});
};
</script>

<style scoped>
.auth {
	line-height: 200%;
}

.auth li {
	margin: 8px 0px;
}
</style>
