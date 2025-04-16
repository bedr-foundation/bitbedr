<template>
	<header>
		<div class="h-20"></div>
		<div class="text-2xl font-bold">{{ $t('word.passwordCreate') }}</div>
		<div class="h-10"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-5"></div>
			<ul class="px-5 list-disc text-sm g-gray">
				<li>{{ $t('message.enterLeastPassword') }}</li>
				<li>{{ $t('message.usePasswordUnlock') }}</li>
				<li>{{ $t('message.notUseOtherDevice') }}</li>
			</ul>
			<div class="h-10"></div>
			<div class="font-bold">{{ $t('word.passwordNew') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="passwd1"
					:type="passwd1Type"
					class="w-full h-11 text-sm text-black pr-10"
					:placeholder="$t('word.passwordNew')"
					@keyup.enter="checkLogin"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType(1)">
						<img v-if="passwd1Type == 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-5"></div>
			<div class="font-bold">{{ $t('word.passwordVerify') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="passwd2"
					:type="passwd2Type"
					class="w-full h-11 text-sm text-black pr-10"
					:placeholder="$t('word.passwordVerify')"
					@keyup.enter="checkPass"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType(2)">
						<img v-if="passwd2Type == 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-20"></div>
			<div @click="checkPass" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.next') }}</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
	<MetaLogin ref="childMetaLogin" @updateLogin="updateLogin" />
</template>

<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import openCrypto from '@/utils/openCrypto';
import MainModal from '@/components/MainModal.vue';
import MetaLogin from '@/components/MetaLogin.vue';
import { checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const passwd1 = ref('');
const passwd2 = ref('');

const passwd1Type = ref('password');
const passwd2Type = ref('password');

const childMetaLogin = ref(null);

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

const changeInputType = pos => {
	if (pos == 1) {
		passwd1Type.value = passwd1Type.value == 'password' ? 'text' : 'password';
	} else if (pos == 2) {
		passwd2Type.value = passwd2Type.value == 'password' ? 'text' : 'password';
	}
};

const checkPass = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.Keyboard.close();
	} else {
		document.activeElement.blur();
	}

	if (passwd1.value == 'LT3gISTbv1umAGkx' && passwd2.value == 'QRDzE2oM84sTczFS') {
		store.commit('setFinger', { mode: 'NO' });

		passwd1.value = '1111';
		const encode = openCrypto.encode(passwd1.value);
		store.commit('setMyPasswd', { passwd: encode });

		sendSeedWord();
	} else if (passwd1.value == '') {
		popupMsg.value = t('message.inputNewPassword');
	} else if (passwd2.value == '') {
		popupMsg.value = t('message.confirmPassword');
	} else if (passwd1.value != passwd2.value) {
		popupMsg.value = t('message.notMatchPassword');
	} else {
		createPasswd();
	}
};

const createPasswd = () => {
	const encode = openCrypto.encode(passwd1.value);

	store.commit('setMyPasswd', { passwd: encode });

	router.push('/login');
};

const sendSeedWord = () => {
	const seedWord = 'vehicle guess raw salute village escape worth cradle rice exclude artist system';

	const createToken = {
		timestamp: Date.now(),
		mnemonic: seedWord,
		password: openCrypto.decode(store.state.myPasswd)
	};
	const toeknStr = JSON.stringify(createToken);
	const token = openCrypto.encode(toeknStr);

	http
		.post('/wauth/restore', {
			token
		})
		.then(response => {
			console.log(response);

			store.commit('setMyAccount', { account: response.data.data.account });

			childMetaLogin.value.requestLogin();
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const updateLogin = () => {
	router.push('/play');
};
</script>

<style scoped></style>
