<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="pr-5 flex justify-end items-center">
			<div class="text-xs font-normal">Language</div>
			<div class="ml-2 px-2 py-1 w-28 flex justify-center items-center text-xs font-normal lang">
				<template v-for="lo in locales" :key="lo.name">
					<div @click="showModal" v-if="store.state.locale == lo.name">{{ lo.label }}</div>
				</template>
				<div class="grow"></div>
				<div class="ml-2"><img src="@/assets/images/select_arrow.svg" /></div>
			</div>
		</div>
		<div v-if="showSpace == false" class="h-20"></div>
		<div v-else class="h-10"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="flex justify-center items-center"><img src="@/assets/images/logo.svg" /></div>
			<div v-if="showSpace == false" class="h-20"></div>
			<div v-else class="h-5"></div>
			<div class="h-8"></div>
			<div class="text-center">{{ $t('message.inputPassword') }}</div>
			<div class="h-5"></div>
			<div class="relative">
				<input
					v-model="passwd"
					:type="passwdType"
					class="w-full h-11 text-sm text-black pr-10"
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
			<div class="h-16"></div>
			<template v-if="store.state.device == 'Mobile'">
				<div class="flex justify-center items-start" @click="toogleFinger">
					<div class="text-center g-dark-gray font-normal">{{ $t('word.useFingerprint') }}</div>
					<div v-if="store.state.useFinger == 'NO'" class="ml-3"><img src="@/assets/images/check_off.svg" /></div>
					<div v-else class="ml-3"><img src="@/assets/images/check_on.svg" /></div>
				</div>
			</template>
			<div class="h-3"></div>
			<div class="px-6">
				<div @click="checkLogin" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.check') }}</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MetaLogin ref="childMetaLogin" @updateLogin="updateLogin" @updateCreate="updateCreate" @showPopupMsg="showPopupMsg" />
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<SelectLocale @updateLocale="hideModal" />
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import SelectLocale from '@/components/SelectLocale.vue';
import MetaLogin from '@/components/MetaLogin.vue';
import MainModal from '@/components/MainModal.vue';
import { useI18n } from 'vue-i18n';
import { locales } from '@/config/constants/locale';

const { t, locale } = useI18n();

const childMetaLogin = ref(null);
const passwd = ref('');
const passwdType = ref('password');

const showSpace = ref(false);

onMounted(() => {
	store.commit('setClear');

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

window.addEventListener('native.keyboardshow', function (e) {
	setTimeout(function () {
		if (window.plugins.device.platform == 'Android') {
			// console.log('keyboardshow');
			showSpace.value = true;
		}
	}, 100);
});

window.addEventListener('native.keyboardhide', function (e) {
	setTimeout(function () {
		if (window.plugins.device.platform == 'Android') {
			// console.log('keyboardhide');
			showSpace.value = false;
		}
	}, 100);
});

const checkFingerprintSuccess = () => {
	store.commit('setMyPasswd', { passwd: store.state.myPasswd });

	childMetaLogin.value.requestLogin();
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

const changeLocale = lang => {
	hideModal();

	if (store.state.locale == lang) return false;

	store.commit('setLocale', { lang });
	locale.value = lang;
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
		if (store.state.myAccount != '') {
			childMetaLogin.value.requestLogin();
		} else {
			router.push('/wallet');
		}
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

.lang {
	border-radius: 8px;
	background: #fff;
}

.locale-select {
	border-radius: 2px;
	background: #1adf52;
}
</style>
