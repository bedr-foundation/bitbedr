<template>
	<header>
		<div class="h-20"></div>
		<div class="text-2xl font-bold">{{ $t('word.seedWordGuide') }}</div>
		<div class="h-5"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-5"></div>
			<div class="text-center text-[#FD2E2E] font-normal">* {{ $t('word.seedWordInformation') }} *</div>
			<div class="h-5"></div>
			<ul class="px-5 list-disc text-sm g-gray">
				<li>{{ $t('message.useSeedWordRecovery') }}</li>
				<li>{{ $t('message.saveOfflineDevice') }}</li>
				<li>{{ $t('message.notExposureOthers') }}</li>
				<li>{{ $t('message.checkAndStart') }}</li>
			</ul>
			<div class="h-20"></div>
			<div class="h-20"></div>
			<div class="px-6">
				<div @click="requestCreateWallet" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.start') }}</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import MainModal from '@/components/MainModal.vue';
import { checkError } from '@/utils/util';

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

const requestCreateWallet = () => {
	const createToken = {
		timestamp: Date.now(),
		password: openCrypto.decode(store.state.myPasswd)
	};
	const toeknStr = JSON.stringify(createToken);
	const token = openCrypto.encode(toeknStr);

	http
		.post('/wauth/create', {
			token
		})
		.then(response => {
			console.log(response);

			store.state.saveAccount = response.data.data.account;
			store.state.saveSeed = response.data.data.seed;

			router.push('/walletCreate');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped></style>
