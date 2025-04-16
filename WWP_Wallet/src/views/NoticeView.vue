<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'setting'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">{{ $t('word.notice') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-6"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="h-2"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div v-for="notice in noticeList" :key="notice.idx">
				<div @click="noticeDetail(notice.idx)" class="px-6 py-3 font-normal g-list-box">
					<div>
						<span v-if="notice.type == 0">[{{ $t('word.announcement') }}]</span>
						<span v-else-if="notice.type == 1">[{{ $t('word.information') }}]</span>
						<span v-else-if="notice.type == 2">[{{ $t('word.emergency') }}]</span>
						<span class="ml-1 break-all">{{ notice.title }}</span>
					</div>
					<div class="h-1"></div>
					<div class="text-right text-xs">{{ getShowTime(notice.createdAt) }}</div>
				</div>
				<div class="h-2"></div>
			</div>
			<div class="h-5"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full footer-main"></footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import store from '@/store';
import http from '@/api/http';
import { getShowTime } from '@/utils/util';

// const noticeList = store.getters['getNoticeInfos'].filter(v => v.popup == 0);
const noticeList = ref(null);

onMounted(() => {
	getNoticeInfos();
});

const noticeDetail = idx => {
	store.commit('setNoticeIdx', { idx });

	router.push('/noticeDetail');
};

const getNoticeInfos = () => {
	http
		.get('/api/notices', {
			params: {}
		})
		.then(response => {
			console.log(response);

			let res = response.data.data;

			store.commit('setNoticeInfos', { data: res });

			noticeList.value = res.filter(v => v.popup == 0);
		})
		.catch(error => {
			// popupMsg.value = checkError(error.response.status, error.response.data.errorCode, error.response.data.message);
		});
};
</script>

<style scoped></style>
