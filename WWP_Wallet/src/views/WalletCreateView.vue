<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'wallet'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-2xl text-center"></div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="text-2xl font-bold text-center">{{ $t('word.seedWordRecord') }}</div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-6"></div>
			<div class="px-8 text-sm font-normal seed-box">
				<div class="h-5"></div>
				<template v-for="index in 11" :key="index">
					<template v-if="index % 2 === 1">
						<div class="flex">
							<div class="w-[45%] flex">
								<div class="w-[15%] py-1 text-right">{{ index }}</div>
								<div class="grow"></div>
								<div class="w-[80%] ml-2 py-1 seed-btn">{{ seedList[index - 1] }}</div>
							</div>
							<div class="grow"></div>
							<div class="w-[45%] flex">
								<div class="w-[15%] py-1 text-right">{{ index + 1 }}</div>
								<div class="grow"></div>
								<div class="w-[80%] ml-2 py-1 seed-btn">{{ seedList[index] }}</div>
							</div>
						</div>
						<div class="h-3"></div>
					</template>
				</template>
				<div class="h-2"></div>
			</div>
			<div class="h-6"></div>
			<ul class="px-3 list-disc text-sm g-gray">
				<li>{{ $t('message.recordSeedWord') }}</li>
				<li>{{ $t('message.notSharing') }}</li>
				<li>{{ $t('message.enterOrder') }}</li>
				<li>{{ $t('message.notExposureOthers') }}</li>
				<li>{{ $t('message.useRecoverySeedWord') }}</li>
			</ul>
			<div class="h-6"></div>
			<div class="px-6">
				<div @click="copyToClipboard" class="h-12 flex justify-center items-center g-btn-none">
					<div class="w-[20%] flex justify-center items-center"><img src="@/assets/images/seed_copy.svg" /></div>
					<div class="grow text-center">{{ $t('word.seedWordCopy') }}</div>
					<div class="w-[20%]"></div>
				</div>
				<div class="h-3"></div>
				<router-link to="walletCheck" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.next') }} </router-link>
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
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const seed = ref('');
const seedList = ref([]);

onMounted(() => {
	getSeedInfo();
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

const getSeedInfo = () => {
	seed.value = openCrypto.decode(store.state.saveSeed);

	if (seed.value != '') {
		seedList.value = seed.value.split(' ');
	} else {
		router.push('/login');
	}
};

const copyToClipboard = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.clipboard.copy(
			{
				type: 'text',
				data: seed.value
			},
			res => {
				console.log(res.data);
			}
		);
	} else {
		navigator.clipboard.writeText(seed.value);
	}

	showToast(t('message.copyClipboard'));
};
</script>

<style scoped>
.seed-box {
	border-radius: 2px;
	border: 1px solid #1adf52;
	background: rgba(255, 255, 255, 0.1);
}

.seed-btn {
	border-radius: 6px;
	border: 1px solid #000000;
	text-align: center;
}
</style>
