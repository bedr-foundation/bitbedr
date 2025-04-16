<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'notice'" class="w-[15%]"><img src="@/assets/images/btn_close.svg" /></router-link>
			<div class="grow text-center"></div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-6"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-5"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="w-full h-px g-line"></div>
			<div class="h-3"></div>
			<div class="font-normal">
				<span v-if="notice.type == 0">[{{ $t('word.announcement') }}]</span>
				<span v-else-if="notice.type == 1">[{{ $t('word.information') }}]</span>
				<span v-else-if="notice.type == 2">[{{ $t('word.emergency') }}]</span>
				<span class="ml-1 break-all">{{ notice.title }}</span>
			</div>
			<div class="h-1"></div>
			<div class="text-xs font-normal g-gray">{{ getShowTime(notice.createdAt) }}</div>
			<div class="h-2"></div>
			<div class="h-px g-line"></div>
			<nl2br tag="p" :text="notice.desc" class="text-sm" />
			<div class="h-10"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full footer-main"></footer>
</template>

<script setup>
import store from '@/store';
import Nl2br from 'vue3-nl2br';
import { getShowTime } from '@/utils/util';

const notice = store.getters['getNoticeInfos'].find(v => v.idx == store.state.noticeIdx);
</script>

<style scoped></style>
