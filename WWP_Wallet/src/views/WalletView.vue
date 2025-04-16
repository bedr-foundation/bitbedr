<template>
	<header></header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-20"></div>
			<div class="h-20"></div>
			<div class="flex justify-center items-center"><img src="@/assets/images/logo.svg" /></div>
			<div class="h-5"></div>
			<div class="h-20"></div>
			<div class="h-16"></div>
			<div class="text-center">{{ $t('word.importOrCreate') }}</div>
			<div class="h-5"></div>
			<div class="px-10">
				<router-link to="walletGuide" class="h-12 flex justify-center items-center g-btn-color">{{ $t('word.start') }} </router-link>
				<div class="h-3"></div>
				<router-link to="seedCheck" class="h-12 flex justify-center items-center g-btn-none">{{ $t('word.seedWordImport') }} </router-link>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
</template>

<script setup>
import { onMounted } from 'vue';
import store from '@/store';

onMounted(() => {
	store.state.saveAccount = '';
	store.state.saveSeed = '';
});
</script>

<style scoped></style>
