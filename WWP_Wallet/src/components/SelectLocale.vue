<template>
	<div class="h-3"></div>
	<div class="px-2 flex justify-center items-center">
		<div class="w-[15%]" @click="changeLocale('')"><!-- <img src="@/assets/images/btn_close.svg" /> --></div>
		<div class="grow text-center font-normal g-dark-blue">{{ $t('word.langSelect') }}</div>
		<div class="w-[15%]"></div>
	</div>
	<div class="h-8"></div>
	<div class="w-full flex flex-col justify-center items-center">
		<template v-for="lo in locales" :key="lo.name">
			<div
				@click="changeLocale(lo.name)"
				class="w-48 h-10 flex justify-center items-center text-sm"
				:class="[store.state.locale == lo.name ? 'locale-select' : '']"
			>
				{{ $t('common.' + lo.type) }}
			</div>
			<div class="h-5"></div>
		</template>
	</div>
</template>

<script setup>
import { defineEmits } from 'vue';
import store from '@/store';
import { useI18n } from 'vue-i18n';
import { locales } from '@/config/constants/locale';

const { t, locale } = useI18n();

const emit = defineEmits(['updateLocale']);

const changeLocale = lang => {
	if (lang != '' && store.state.locale != lang) {
		store.commit('setLocale', { lang });
		locale.value = lang;
	}

	emit('updateLocale');
};
</script>

<style scoped>
.locale-select {
	border-radius: 30px;
	background: #0b0f27;
	color: #ffffff;
}
</style>
