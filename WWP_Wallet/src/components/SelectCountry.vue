<template>
	<select v-model="dialCode" :onChange="updateCountryCode" class="w-full h-11 text-xs">
		<option v-for="code in countryCode" :key="code.dial_code" :value="code.dial_code">{{ code.name }} ({{ code.dial_code }})</option>
	</select>
</template>

<script setup>
import store from '@/store';
import { ref } from 'vue';
import countryCode from '@/assets/json/countryCode.json';

const dialCode = ref(store.state.countryCode);

const updateCountryCode = () => {
	store.commit('setCountryCode', { code: dialCode.value });
};
</script>

<style scoped></style>
