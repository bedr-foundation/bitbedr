<template>
	<header>
		<div class="h-20"></div>
		<div class="text-3xl">SUCCESS!!</div>
		<div class="h-5"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-5"></div>
			<div class="flex justify-center items-center"><img src="@/assets/images/finish.png" /></div>
			<div class="h-20"></div>
			<div class="text-center text-2xl">{{ $t('message.walletComplete') }}</div>
			<div class="h-20"></div>
			<div class="px-6">
				<div @click="checkFinish" class="h-12 flex justify-center items-center text-sm g-btn-color">{{ $t('word.check') }}</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MetaLogin ref="childMetaLogin" @updateLogin="updateLogin" />
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';
import store from '@/store';
import MetaLogin from '@/components/MetaLogin.vue';

const childMetaLogin = ref(null);

const updateLogin = () => {
	router.push('/play');
};

const checkFinish = () => {
	if (store.state.myAccount != '' && store.state.myPasswd != '') {
		childMetaLogin.value.requestLogin();
	} else {
		router.push('/login');
	}
};
</script>

<style scoped></style>
