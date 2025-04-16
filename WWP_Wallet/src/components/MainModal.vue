<template>
	<Teleport to="body">
		<div v-if="enable" class="modalWrap">
			<div class="p-5 w-full h-full flex justify-center items-center">
				<div
					class="p-5 flex flex-col justify-center items-center popup-box"
					v-click-out-side="hide"
					:class="[bgColor != '' ? 'bg-[#EBF0F5]' : 'bg-[#FFFFFF]']"
				>
					<div v-if="title != ''" class="w-full text-xl font-normal g-dark-blue">{{ $t('word.notification') }}</div>
					<div v-if="title != ''" class="flex flex-col justify-center items-center">
						<div class="h-6"></div>
						<div class="font-normal">{{ showTitle }}</div>
						<div class="h-8"></div>
						<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="hide">{{ $t('word.check') }}</div>
						<div class="h-6"></div>
					</div>
					<slot v-else></slot>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, toRefs, watch, defineProps, defineEmits } from 'vue';
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
	visible: {
		type: Boolean,
		default: () => false
	},
	title: {
		type: String,
		default: () => ''
	},
	bgColor: {
		type: String,
		default: () => ''
	}
});

const emit = defineEmits(['hide', 'resData']);
const { visible, title, bgColor } = toRefs(props);

const enable = ref(false);
const showTitle = ref('');

watch(visible, val => {
	setTimeout(() => {
		enable.value = val;
	}, 100);
});

watch(title, val => {
	setTimeout(() => {
		if (title.value != '' && t(title.value) != title.value) {
			showTitle.value = t(title.value);
		} else {
			showTitle.value = title.value;
		}
	}, 100);
});

const hide = () => {
	enable.value = false;
	emit('hide');
};
</script>

<style scoped>
.modalWrap {
	position: fixed;
	z-index: 99;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.6);
}

.popup-box {
	border-radius: 6px;
	min-width: 20rem;
	min-height: 10rem;
}
</style>
