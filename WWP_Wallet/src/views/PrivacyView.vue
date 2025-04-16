<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<div class="w-[15%] cursor-pointer" @click="goBack"><img src="@/assets/images/btn_back.svg" /></div>
			<div class="grow text-center">{{ $t('word.termsAndPrivacy') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-6"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-5"></div>
		<div class="px-8 w-full overflow-y-auto font-normal">
			<div class="h-8"></div>
			<div class="flex justify-center items-center">
				<div class="font-bold">{{ $t('word.termsUse') }}</div>
				<div class="grow text-right text-xs g-gray">Update : 2024.07.01</div>
			</div>
			<div class="h-5"></div>
			<pre class="text-sm font-normal font-NotoSansKR">{{ terms2 }}</pre>
			<div class="h-5"></div>
			<div class="h-px g-line"></div>
			<div class="h-10"></div>
			<div class="flex justify-center items-center">
				<div class="font-bold">{{ $t('word.privacyPolicy') }}</div>
				<div class="grow text-right text-xs g-gray">Update : 2024.07.01</div>
			</div>
			<div class="h-5"></div>
			<pre class="text-sm font-normal font-NotoSansKR">{{ terms3 }}</pre>
			<div class="h-10"></div>
		</div>
		<div class="h-5"></div>
	</main>
	<footer class="w-full footer-main"></footer>
</template>

<script setup>
import terms2 from '@/assets/terms/terms2_ko.md';
import terms3 from '@/assets/terms/terms3_ko.md';
import router from '@/router';
import store from '@/store';

const goBack = () => {
	if (store.getters['getMyData'] == '') {
		router.push('/join');
	} else {
		router.push('/setting');
	}
};
</script>

<style scoped></style>
