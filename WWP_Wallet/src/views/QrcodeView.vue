<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div @click="goBack" class="w-[15%]"><img src="@/assets/images/btn_back_white.svg" /></div>
			<div class="grow text-white text-center">QrCode</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<qr-stream v-if="store.state.device == ''" @decode="onDecode"></qr-stream>
	</main>
	<footer></footer>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import { QrStream } from 'vue3-qr-reader';
import { IsJsonString } from '@/utils/util';

const qrcode = ref('');

onMounted(() => {
	store.state.qrcodeInfo = '';

	store.state.shopType = '';
	store.state.shopId = '';
	store.state.shopAddress = '';
	store.state.shopCountry = '';
	store.state.shopName = '';

	document.addEventListener('deviceready', () => {
		window.plugins.QRScanner.getStatus(status => {
			console.log(status);

			if (status.denied == true) {
				store.state.saveShowPopup = 'message.allowCameraPermission';

				if (store.state.mySymbol != '') {
					qrScanEndPay();
				} else {
					qrScanEnd();
				}
			}
		});

		window.plugins.QRScanner.scan((err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);

				if (store.state.mySymbol == '') {
					if (IsJsonString(res) == true) {
						let json = JSON.parse(res);

						store.state.shopType = json.type;
						store.state.shopId = json.shopId;
						store.state.shopAddress = json.shopAddress;
						store.state.shopCountry = json.shopCountry;
						store.state.shopName = json.shopName;

						if (store.state.shopType == 'info') {
							store.state.refundId = json.paymentId;
						}
					}

					qrScanEndPay();
				} else {
					let qrData = res.split(':');

					if (qrData.length > 1) {
						qrcode.value = qrData[1];
					} else {
						qrcode.value = qrData[0];
					}

					// Metamask 예외 처리
					let metamask = qrcode.value.split('@');

					if (metamask.length > 1) {
						for (let i in metamask) {
							if (metamask[i].length >= 34 && metamask[i].length <= 42) {
								qrcode.value = metamask[i];
								break;
							}
						}
					}

					store.state.qrcodeInfo = qrcode.value;

					qrScanEnd();
				}
			}
		});

		window.plugins.QRScanner.show();
	});
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
// Popup End ====================

const qrScanEnd = () => {
	window.plugins.QRScanner.hide();

	window.plugins.QRScanner.destroy(function (status) {
		if (store.state.mySymbol != '') {
			router.push('/send');
		} else {
			router.push('/play');
		}
	});
};

const qrScanEndPay = () => {
	window.plugins.QRScanner.hide();

	window.plugins.QRScanner.destroy(function (status) {
		if (store.state.shopType == 'pay') {
			router.push('/tkpay');
		} else if (store.state.shopType == 'info') {
			router.push('/receipt');
		} else {
			router.push('/play');
		}
	});
};

const onDecode = res => {
	let qrData = res.split(':');

	if (qrData.length > 1) {
		qrcode.value = qrData[1];
	} else {
		qrcode.value = qrData[0];
	}

	// Metamask 예외 처리
	let metamask = qrcode.value.split('@');

	if (metamask.length > 1) {
		for (let i in metamask) {
			if (metamask[i].length >= 34 && metamask[i].length <= 42) {
				qrcode.value = metamask[i];
				break;
			}
		}
	}

	store.state.qrcodeInfo = qrcode.value;

	router.push('/send');
};

const goBack = () => {
	if (store.state.mySymbol == '') {
		router.push('/play');
	} else {
		router.push('/send');
	}
};
</script>

<style scoped></style>
