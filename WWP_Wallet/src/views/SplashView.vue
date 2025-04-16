<template>
	<header></header>
	<main class="flex-grow overflow-hidden flex flex-col items-center">
		<div class="w-full h-full flex justify-center items-center">
			<img src="@/assets/images/logo.svg" />
		</div>
	</main>
	<footer>
		<div class="flex flex-col">
			<div v-if="versionUpdate == true">
				<div class="p-2 flex justify-center items-center text-sm g-btn-color" @click="updateVersion">Update</div>
				<div class="h-5"></div>
			</div>
			<div class="flex justify-center items-center">
				<div class="text-white text-xs">BEDR Co., Ltd</div>
				<div id="app_version" class="ml-1 text-xs text-white">&nbsp;{{ version }}</div>
			</div>
		</div>
		<div class="h-5"></div>
	</footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import MainModal from '@/components/MainModal.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

var vTimer = null;
const version = ref('');
const packageName = ref('');
const versionUpdate = ref(false);
const blockServer = ref(false);

onMounted(() => {
	store.commit('setPaymentKey', { key: '' }); // 온라인 결제키 삭제

	vTimer = setTimeout(() => checkServer(), 3000);

	document.addEventListener('deviceready', () => {
		if (store.state.device == 'Mobile') {
			clearTimeout(vTimer);

			setTimeout(() => {
				if (store.state.platform == 'Android' || store.state.platform == 'iOS') {
					window.bgColor = '#0B0F27';
					window.plugins.getAppVersion.setBgColor();
				}

				window.plugins.getAppVersion(output => {
					version.value = output;

					setTimeout(() => checkVersion(), 3000);
				});
			}, 100);

			onesignalInit();
		}
	});
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

	if (blockServer.value == true) {
		window.location.reload(true);
	} else {
		updateVersion();
	}
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const onesignalListener = event => {
	// const notificationData = JSON.stringify(event);
	// console.log(event);
};

const onesignalInit = () => {
	window.plugins.OneSignal.default.initialize('d2f70559-5a0d-41c0-a169-96e53708fe3e');
	window.plugins.OneSignal.default.Notifications.addEventListener('click', onesignalListener);
	window.plugins.OneSignal.default.Notifications.requestPermission(false).then(accepted => {
		console.log('User accepted notifications: ' + accepted);
	});
};

const checkVersion = () => {
	http
		.get('/api/checkversion', {
			params: {
				version: version.value
			}
		})
		.then(response => {
			console.log(response);

			if (response.data.status == 0) {
				window.plugins.getAppVersion.getPackageName(output => {
					packageName.value = output;
					versionUpdate.value = true;

					store.commit('setAppVersion', { ver: output });

					popupMsg.value = t('message.needUpdate');
				});
			} else {
				setTimeout(() => checkServer(), 500);
			}
		})
		.catch(error => {
			console.log(error);
		});
};

const moveNext = () => {
	// if (store.state.myPasswd != '') {
	router.push('/login');
	// } else {
	// router.push('/makePass');
	// }
};

const updateVersion = () => {
	if (versionUpdate.value == true) {
		if (store.state.platform == 'iOS') {
			// IOS APP ID 수정
			window.open('itms-apps://itunes.apple.com/app/6739613888', '_system');
		} else {
			window.open('https://play.google.com/store/apps/details?id=' + packageName.value, '_system');
		}
	} else {
		checkServer();
	}
};

const checkServer = () => {
	const today = new Date();

	fetch(store.state.checkServerUrl + '/patch.html?time=' + today)
		.then(response => response.text())
		.then(data => {
			let res = data.split('|');

			if (res[0] == 'true') {
				blockServer.value = true;

				popupMsg.value = res[1];
			} else {
				moveNext();
			}
		});
};
</script>

<style scoped></style>
