<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'setting'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-center">{{ $t('word.company') }}</div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-8"></div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center g-main-box">
		<div class="h-3"></div>
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-5"></div>
			<ul class="px-6 list-disc text-sm font-normal g-gray company">
				<li>{{ $t('word.corporation') }} : 미쉘원홀딩스(주)</li>
				<li>{{ $t('word.ceo') }} : 이종국</li>
				<li>{{ $t('word.emailAddress') }} : human0037@naver.com</li>
				<li>{{ $t('word.location') }} : 경기도 수원시 팔달구 우만동 508-14 청송빌딩 5층</li>
				<li>{{ $t('word.contact') }} : +82-43-653-5532</li>
			</ul>
			<div class="h-10"></div>
		</div>
		<div class="h-2"></div>
	</main>
	<footer class="w-full footer-main"></footer>
</template>

<script setup></script>

<style scoped>
.company {
	line-height: 28px;
}
</style>
