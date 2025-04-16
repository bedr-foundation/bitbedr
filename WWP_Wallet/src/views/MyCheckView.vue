<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'setting'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">{{ $t('word.auth') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-5"></div>
			<div>{{ $t('word.information') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray company">
				<li>{{ $t('message.additionalAuth') }}</li>
			</ul>
			<div class="h-16"></div>
			<div>Password</div>
			<div class="h-2"></div>
			<div class="relative">
				<input
					v-model="passwd"
					:type="passwdType"
					class="w-full h-11 text-sm text-black pr-10 g-input-white"
					:placeholder="$t('word.passwordInput')"
					@keyup.enter="checkLogin"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType">
						<img v-if="passwdType == 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-3"></div>
			<template v-if="store.state.device == 'Mobile'">
				<div class="flex justify-center items-start" @click="toogleFinger">
					<div class="text-center g-dark-gray font-normal">{{ $t('word.useFingerprint') }}</div>
					<div v-if="store.state.useFinger == 'NO'" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
					<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
				</div>
			</template>
			<div class="h-20"></div>
			<div class="w-full flex justify-center items-center">
				<div
					@click="checkLogin"
					class="w-64 h-10 flex justify-center items-center text-sm"
					:class="[passwd != '' ? 'g-btn-color' : 'g-btn-light-gray']"
				>
					{{ $t('word.authComplete') }}
				</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import MainModal from '@/components/MainModal.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const passwd = ref('');
const passwdType = ref('password');

onMounted(() => {
	if (store.state.myPasswd == '') {
		router.push('/makePass');
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
	visible.value = false;
	popupMsg.value = '';
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const checkFingerprintSuccess = () => {
	router.push('/mySeed');
};

const checkFingerprintError = error => {
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

const updateLogin = () => {
	router.push('/play');
};

const updateCreate = () => {
	router.push('/wallet');
};

const showPopupMsg = res => {
	popupMsg.value = res;
};

const checkLogin = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.Keyboard.close();
	} else {
		document.activeElement.blur();
	}

	if (passwd.value == '') {
		popupMsg.value = t('message.inputPassword');
	} else {
		checkPasswd();
	}
};

const checkPasswd = () => {
	const decode = openCrypto.decode(store.state.myPasswd);

	if (passwd.value == decode) {
		router.push('/mySeed');
	} else {
		popupMsg.value = t('message.checkPassword');
	}
};
</script>

<style scoped>
.input-no-border {
	border: none !important;
	box-shadow: 0px !important;
	background: transparent !important;
}

.line {
	background: #c9d8f5;
}
</style>
