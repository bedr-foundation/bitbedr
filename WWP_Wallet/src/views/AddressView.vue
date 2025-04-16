<template>
	<header class="w-full">
		<div class="h-8"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%]" @click="goBack"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">My Address</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full">
			<div class="h-px g-line"></div>
		</div>
		<div class="px-20">
			<div class="h-10"></div>
			<div v-if="address != ''" class="p-6 flex justify-center items-center qrcode">
				<div class="p-4 qrcode-bg">
					<QRCodeVue3
						:dotsOptions="{ type: 'square', color: '#000000' }"
						:cornersSquareOptions="{ type: 'square', color: '#000000' }"
						:cornersDotOptions="{ type: 'square', color: '#000000' }"
						:value="address"
					/>
				</div>
			</div>
			<div class="h-10"></div>
		</div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="flex justify-center items-center">
				<div class="pt-3 px-5 py-2 break-all font-normal address-text">{{ address }}</div>
			</div>
			<div class="h-10"></div>
			<div class="flex justify-center items-center" @click="copyToClipboard"><img src=@/assets/images/btn_copy_address.svg/></div>
			<div class="h-10"></div>
			<div class="w-full h-px g-line"></div>
			<div class="h-8"></div>
			<div>{{ $t('message.beforeDeposit') }}</div>
			<div class="h-2"></div>
			<ul class="px-6 list-disc text-sm g-gray">
				<li>{{ $t('message.warnDepositAddress1') }}</li>
				<li>{{ $t('message.warnDepositAddress2') }}</li>
				<li>{{ $t('message.warnDepositAddress3') }}</li>
			</ul>
		</div>
		<div class="h-10"></div>
	</main>
	<footer></footer>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import router from '@/router';
import store from '@/store';
import QRCodeVue3 from 'qrcode-vue3';
import { showToast } from '@/utils/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const address = ref('');

const myData = store.getters['getMyData'];
const tokenInfos = store.getters['getTokenInfos'];
const mySymbol = store.state.mySymbol;

onMounted(() => {
	if (tokenInfos[mySymbol].chainId == 'TRON') {
		address.value = myData.wallet.tronAddress;
	} else {
		address.value = myData.wallet.address;
	}
});

const goBack = () => {
	if (store.state.mySymbol == '') {
		router.push('play');
	} else {
		router.push('/detail');
	}
};

const copyToClipboard = () => {
	if (store.state.device == 'Mobile') {
		window.plugins.clipboard.copy(
			{
				type: 'text',
				data: address.value
			},
			res => {
				console.log(res.data);
			}
		);
	} else {
		navigator.clipboard.writeText(address.value);
	}

	showToast(t('message.copyClipboard'));
};
</script>

<style scoped>
.qrcode {
	max-width: 300px;
	border-radius: 30px;
	border: 2px solid #0b0f27;
	background: #0b0f27;
}

.qrcode-bg {
	background: #ffffff;
}

.address-text {
	max-width: 400px;
	border-radius: 30px;
	background: #c5c5c5;
	color: #000000;
}
</style>
