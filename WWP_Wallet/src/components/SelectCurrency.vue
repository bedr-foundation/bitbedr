<template>
	<div class="h-3"></div>
	<div class="px-2 flex justify-center items-center">
		<div class="w-[15%]" @click="changeCurrency('')"><!-- <img src="@/assets/images/btn_close.svg" /> --></div>
		<div class="grow text-center font-normal g-dark-blue">{{ $t('word.currencySelect') }}</div>
		<div class="w-[15%]"></div>
	</div>
	<div class="h-8"></div>
	<div class="w-full flex flex-col justify-center items-center">
		<template v-for="ex in exchangeInfos" :key="ex.currency">
			<div
				@click="changeCurrency(ex.currency)"
				class="w-48 h-10 flex justify-center items-center text-sm"
				:class="[store.state.currency == ex.currency ? 'locale-select' : '']"
			>
				{{ ex.currency }}
			</div>
			<div class="h-5"></div>
		</template>
	</div>
</template>

<script setup>
import { defineEmits } from 'vue';
import store from '@/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const exchangeInfos = store.getters['getExchangeInfos'];

const emit = defineEmits(['updateCurrency']);

const changeCurrency = currency => {
	if (currency != '' && store.state.currency != currency) {
		store.commit('setCurrency', { currency });
	}

	emit('updateCurrency');
};
</script>

<style scoped>
.locale-select {
	border-radius: 30px;
	background: #0b0f27;
	color: #ffffff;
}
</style>
