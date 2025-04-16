<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="flex justify-center items-center">WWP Ecosystem</div>
		<div class="h-5"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-2"></div>
			<div v-for="item in tkList" :key="item.idx" class="flex flex-col justify-center items-center">
				<div @click="movePage(item.link)"><img :src="item.image" /></div>
				<div class="h-3"></div>
			</div>
			<div class="h-10"></div>
		</div>
		<div class="h-10"></div>
	</main>
	<footer class="w-full g-footer">
		<div class="px-5 flex justify-around items-center" style="position: relative">
			<router-link :to="'play'"><img src="@/assets/images/menu_wallet.svg" /></router-link>
			<div><img src="@/assets/images/menu_nft.svg" /></div>
			<router-link :to="'setting'"><img src="@/assets/images/menu_setting.svg" /></router-link>
		</div>
	</footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg">
		<div v-if="popupParam == 'logout'" class="w-full">
			<div class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
			<div class="h-6"></div>
			<div class="text-center font-normal">{{ $t('message.checkLogout') }}</div>
			<div class="h-8"></div>
			<div class="w-full flex justify-center items-center">
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-none-s" @click="hideModal">{{ $t('word.cancel') }}</div>
				<div class="w-5"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="requestLogout">{{ $t('word.check') }}</div>
			</div>
			<div class="h-6"></div>
		</div>
		<div v-else-if="popupParam == 'withdraw'" class="w-full">
			<div class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
			<div class="h-6"></div>
			<div class="text-center font-normal">{{ $t('message.checkWithdrawal') }}</div>
			<div class="h-8"></div>
			<div class="relative">
				<input v-model="passwd" :type="passwdType" class="w-60 pr-10" />
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="changeInputType">
						<img v-if="passwdType == 'password'" src="@/assets/images/btn_eyes.svg" />
						<img v-else src="@/assets/images/btn_eyes_disable.svg" />
					</div>
				</div>
			</div>
			<div class="h-8"></div>
			<div class="w-full flex justify-center items-center">
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-none-s" @click="hideModal">{{ $t('word.cancel') }}</div>
				<div class="w-5"></div>
				<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="checkWithdraw">{{ $t('word.check') }}</div>
			</div>
			<div class="h-6"></div>
		</div>
		<div v-else-if="popupParam == 'locale'" class="w-full">
			<SelectLocale @updateLocale="hideModal" />
		</div>
	</MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import SelectLocale from '@/components/SelectLocale.vue';
import MainModal from '@/components/MainModal.vue';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';
import { locales } from '@/config/constants/locale';

const { t } = useI18n();

const popupParam = ref('');

const tkList = ref();

let child = null;
let childTimer = null;

onMounted(() => {
	getInfo();
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

const showInReady = () => {
	popupMsg.value = t('message.inReady');
};

const showPopupMsg = res => {
	popupMsg.value = res;
};

const getInfo = () => {
	http
		.get('/api/ecosystem', {
			params: {}
		})
		.then(response => {
			console.log(response);

			tkList.value = response.data.data;
		})
		.catch(error => {
			console.log(error);
		});
};

const movePage = (url, token) => {
	child = window.open(url + '?token=' + token, '_blank', 'fullscreen=yes,location=no');

	if (child == null || child == undefined) {
		popupMsg.value = t('message.NotAllowPopup');
	} else {
		childTimer = setInterval(checkChild, 500);
	}
};

const checkChild = () => {
	if (child.closed) {
		clearInterval(childTimer);
	}
};
</script>

<style scoped></style>
