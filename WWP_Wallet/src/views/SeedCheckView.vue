<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'wallet'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-2xl text-center"></div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="text-2xl font-bold text-center">{{ $t('word.importWallet') }}</div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-10"></div>
			<ul class="px-5 list-disc text-sm g-gray">
				<li>{{ $t('message.ownSeedWord') }}</li>
				<li>{{ $t('message.useSeedWordAll') }}</li>
			</ul>
			<div class="h-10"></div>
			<div class="px-2 font-bold">{{ $t('word.seedWordInput') }}</div>
			<div class="h-2"></div>
			<div class="h-28 seed-box">
				<textarea v-model="seedData" class="w-full h-28 text-sm" :placeholder="$t('word.seedWordInput')"></textarea>
			</div>
			<div class="h-2"></div>
			<div class="px-2 text-sm g-gray">{{ $t('message.betweenWordSpace') }}</div>
			<div class="h-20"></div>
			<div class="px-6">
				<div @click="makeSeedData" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.import') }}</div>
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
import { showToast } from '@/utils/util';
import { checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const seedData = ref('');

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

const makeSeedData = () => {
	let seedInfo = seedData.value.trim().split(',');

	if (seedData.value == '') {
		popupMsg.value = t('message.inputSeedWord');
	} else if (seedInfo.length == 12) {
		seedInfo = seedData.value.replace(/ /gi, '');
		seedInfo = seedInfo.replace(/,/gi, ' ');

		sendSeedWord(seedInfo);
	} else if (seedInfo.length == 1) {
		seedInfo = seedData.value.trim().split(' ');

		if (seedInfo.length == 12) {
			sendSeedWord(seedData.value.trim());
		} else {
			popupMsg.value = t('message.checkSeedWord');
		}
	} else {
		popupMsg.value = t('message.checkSeedWord');
	}
};

const sendSeedWord = seedWord => {
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

			router.push('/seedFinish');
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.seed-box {
	border-radius: 10px;
	background: #f3f5f8;
	box-shadow: 0px 2px 4px 0px rgba(21, 53, 90, 0.25);
}
</style>
