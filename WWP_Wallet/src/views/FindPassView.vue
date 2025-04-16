<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-10 w-full flex items-center">
			<div class="w-[15%]">
				<RouterLink to="login"><img src="@/assets/images/btn_back_white.svg" /></RouterLink>
			</div>
			<div class="grow text-white text-center">{{ $t('word.passwordFind') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-10"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-login-box">
		<div class="px-10 w-full overflow-y-auto">
			<div class="h-10"></div>
			<div class="text-base">{{ $t('word.loginId') }}</div>
			<div class="h-2"></div>
			<input v-model="loginId" type="text" class="px-5 w-full h-11 text-sm text-black g-input-white" :placeholder="$t('word.loginId')" />
			<div class="h-5"></div>
			<div class="text-base">{{ $t('word.emailAddress') }}</div>
			<div class="h-2"></div>
			<input v-model="email" type="text" class="px-5 w-full h-11 text-sm text-black g-input-white" :placeholder="$t('word.emailAddress')" />
			<div class="h-5"></div>
			<ul class="pl-5">
				<li class="text-sm list-disc g-gray">{{ $t('message.findPassText1') }}</li>
				<li class="text-sm list-disc g-gray">{{ $t('message.findPassText2') }}</li>
			</ul>
			<div class="h-20"></div>
			<div class="h-20"></div>
			<div @click="authFindPass" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.sendEmail') }}</div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import http from '@/api/http';
import router from '@/router';
import store from '@/store';
import MainModal from '@/components/MainModal.vue';
import { checkError } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const loginId = ref('');
const email = ref('');

onMounted(() => {});

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

const authFindPass = () => {
	if (loginId.value == '') {
		popupMsg.value = t('message.inputLoginId');
		return false;
	} else if (email.value == '') {
		popupMsg.value = t('message.inputEmail');
		return false;
	}

	http
		.post('/auth/find', {
			type: 'password',
			account: loginId.value,
			email: email.value
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				popupMsg.value = t('message.findPassSendEmail');

				loginId.value = '';
				email.value = '';
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped>
.line {
	background: #c9d8f5;
}
</style>
