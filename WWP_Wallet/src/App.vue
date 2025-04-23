<template>
	<div
		id="top_layer"
		class="flex flex-col h-screen justify-start items-center text-black"
		:class="{
			height_full: isIos == false,
			height_ios: isIos == true,
			ios_splash_layout: store.state.platform == 'iOS' && $route.name == 'splash',
			app_splash_layout: store.state.platform != 'iOS' && $route.name == 'splash',
			ios_login_layout: store.state.platform == 'iOS' && loginView.includes($route.name),
			app_login_layout: store.state.platform != 'iOS' && loginView.includes($route.name),
			ios_app_layout: store.state.platform == 'iOS' && $route.name != 'qrcode',
			app_layout: store.state.platform != 'iOS' && $route.name != 'qrcode',
			qrcode_layout: $route.name == 'qrcode'
		}"
	>
		<header :style="safeWidth"></header>
		<main class="w-full grow overflow-hidden flex flex-col items-center">
			<RouterView></RouterView>
		</main>
		<footer
			:class="{
				safe_layout: $route.name == 'play' || $route.name == 'setting' || $route.name == 'tkworld' || $route.name == 'sns',
				login_layout: loginView.includes($route.name)
			}"
			:style="safeHeight"
		></footer>
	</div>
	<LoadingSpinner v-if="store.state.isLoading"></LoadingSpinner>
</template>

<script setup>
import store from '@/store';
import { onMounted, ref } from 'vue';
import { onBackKeyDown } from '@/utils/util';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const safeWidth = ref('');
const safeHeight = ref('width: 100%;');

const isIos = ref(false);

const loginView = Array('login', 'join', 'findId', 'findPass');

onMounted(() => {
	// isIos.value = /(iPhone|iPod|iPad).*AppleWebKit.*Safari/i.test(navigator.userAgent);

	document.addEventListener('deviceready', () => {
		if (window.plugins.device.platform == 'Android' || window.plugins.device.platform == 'iOS') {
			store.state.device = 'Mobile';
			store.state.platform = window.plugins.device.platform;

			if (store.state.platform == 'iOS') {
				isIos.value = true;

				window.plugins.safearea.get(function (result) {
					console.log(result);

					store.state.safeWidth = result.top - 20;
					store.state.safeHeight = result.bottom - 20;

					if (store.state.safeWidth > 0) {
						safeWidth.value = 'min-height: ' + store.state.safeWidth + 'px;';
					}

					if (store.state.safeHeight > 0) {
						safeHeight.value = safeHeight.value + ' min-height: ' + store.state.safeHeight + 'px;';
					}
				}, null);
			}

			document.addEventListener('backbutton', onBackKeyDown, false);
		} else {
			store.state.device = 'Pc';
		}
	});
});
</script>

<style scoped>
.app_layout {
	max-width: 850px;
	margin: 0 auto;
	padding: 0 !important;
	background: #ffffff;
	/* background-image: url('@/assets/images/app_bg.png'); */
	/* background-size: 100% 100%; */
}

.ios_app_layout {
	max-width: 1024px;
	margin: 0 auto;
	padding: 0 !important;
	background: #f5f5f5;
	/* background-image: url('@/assets/images/app_bg.png'); */
	/* background-size: 100% 100%; */
}

.app_splash_layout {
	max-width: 850px;
	margin: 0 auto;
	padding: 0 !important;
	background: #ffffff;
	background-image: url('@/assets/images/app_bg.png');
	background-size: 100% 100%;
}

.ios_splash_layout {
	max-width: 1024px;
	margin: 0 auto;
	padding: 0 !important;
	background: #0b0f27;
	background-image: url('@/assets/images/app_bg.png');
	background-size: 100% 100%;
}

.app_login_layout {
	max-width: 850px;
	margin: 0 auto;
	padding: 0 !important;
	background: #ffffff;
	background-image: url('@/assets/images/login_bg.png');
	background-size: 100% 100%;
}

.ios_login_layout {
	max-width: 1024px;
	margin: 0 auto;
	padding: 0 !important;
	background: #0b0f27;
	background-image: url('@/assets/images/login_bg.png');
	background-size: 100% 100%;
}

.qrcode_layout {
	max-width: 850px;
	margin: 0 auto;
	background: transparent;
}

.login_layout {
	background: #0b0f27;
}

.safe_layout {
	background: #f5f5f5;
}
</style>
