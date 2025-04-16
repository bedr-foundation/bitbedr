<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div @click="$router.push('/setting')" class="w-[15%] cursor-pointer"><img src="@/assets/images/btn_close.svg" /></div>
			<div class="grow text-center">{{ $t('word.changePassword') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-3"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-8"></div>
			<div class="text-sm">{{ $t('word.currentPassword') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="passwd"
					v-bind:type="[showPassword1 ? 'text' : 'password']"
					class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
					:placeholder="$t('word.currentPassword')"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="showPassword1 = !showPassword1">
						<div v-if="showPassword1 == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
						<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
					</div>
				</div>
			</div>
			<div class="h-5"></div>
			<div class="text-sm">{{ $t('word.passwordNew') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="passwd1"
					v-bind:type="[showPassword2 ? 'text' : 'password']"
					class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
					:placeholder="$t('word.passwordNew')"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="showPassword2 = !showPassword2">
						<div v-if="showPassword2 == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
						<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
					</div>
				</div>
			</div>
			<div class="h-5"></div>
			<div class="text-sm">{{ $t('word.passwordVerify') }}</div>
			<div class="h-1"></div>
			<div class="relative">
				<input
					v-model="passwd2"
					v-bind:type="[showPassword3 ? 'text' : 'password']"
					class="px-5 w-full h-11 text-sm text-black g-input-white pr-12"
					:placeholder="$t('word.passwordVerify')"
				/>
				<div class="flex absolute inset-y-0 right-0 items-center pl-3">
					<div class="pr-3" @click="showPassword3 = !showPassword3">
						<div v-if="showPassword3 == false"><img src="@/assets/images/btn_eyes_disable.svg" /></div>
						<div v-else><img src="@/assets/images/btn_eyes.svg" /></div>
					</div>
				</div>
			</div>
			<div class="h-10"></div>
			<div @click="checkPassword" class="mx-10 h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.complete') }}</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import router from '@/router';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { makePhoneNumber, checkError } from '@/utils/util';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';
import store from '@/store';

const { t } = useI18n();

const myData = store.getters['getMyData'];

const passwd = ref('');
const passwd1 = ref('');
const passwd2 = ref('');

const verifyId = ref('');
const verifyCode = ref('');

const showPassword1 = ref(false);
const showPassword2 = ref(false);
const showPassword3 = ref(false);

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
// Popup End ======================

const showPopupMsg = res => {
	popupMsg.value = res;
};

const checkPassword = () => {
	if (passwd.value == '') {
		popupMsg.value = t('message.enterCurrentPassword');
	} else if (passwd1.value == '' || passwd2.value == '') {
		popupMsg.value = t('message.inputPassword');
	} else if (passwd1.value != passwd2.value) {
		popupMsg.value = t('message.notMatchPassword');
	} else if (passwd1.value.length < 8) {
		popupMsg.value = t('message.enterLeastPassword');
	} else {
		requestVerify();
	}
};

const requestVerify = () => {
	http
		.post('/auth/pwverify', {
			uid: myData.uid,
			password: passwd.value
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				verifyId.value = response.data.data.verifyId;
				verifyCode.value = response.data.data.verifyCode;

				requestChange();
			}
		})
		.catch(error => {
			passwd.value = '';
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};

const requestChange = () => {
	http
		.post('/auth/resetpw', {
			account: store.state.phoneNumber,
			password: passwd1.value,
			verifyId: verifyId.value,
			verifyCode: verifyCode.value
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 1) {
				popupMsg.value = t('message.changePasswordSuccess');

				passwd.value = '';
				passwd1.value = '';
				passwd2.value = '';
			}
		})
		.catch(error => {
			popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped></style>
