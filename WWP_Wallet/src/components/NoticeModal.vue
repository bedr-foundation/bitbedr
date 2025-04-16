<template>
	<Teleport to="body">
		<div v-if="enable" class="modalWrap">
			<div class="p-5 w-full h-full flex justify-center items-center">
				<div v-if="descImage != null && descImage != ''" @click="hide"><img :src="descImage" /></div>
				<div v-else class="p-5 flex flex-col justify-center items-center popup-box" v-click-out-side="hide">
					<div class="w-full text-xl g-dark-blue">{{ $t('word.notice') }}</div>
					<div class="w-full flex flex-col justify-center items-center">
						<div class="h-6"></div>
						<div class="w-full text-right text-xs">{{ createdAt }}</div>
						<div class="h-3"></div>
						<div class="w-full notice-box">
							<div class="p-3 break-all">{{ title }}</div>
							<div class="h-px g-line"></div>
							<nl2br tag="p" :text="desc" class="px-3 text-sm g-gray" />
							<div class="h-3"></div>
						</div>
						<div class="h-8"></div>
						<div class="w-24 h-10 flex justify-center items-center text-sm g-btn-color-s" @click="hide">{{ $t('word.check') }}</div>
						<div class="h-6"></div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, toRefs, watch, defineProps, defineEmits } from 'vue';
import Nl2br from 'vue3-nl2br';
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside';

const props = defineProps({
	visible: {
		type: Boolean,
		default: () => false
	},
	title: {
		type: String,
		default: () => ''
	},
	createdAt: {
		type: String,
		default: () => ''
	},
	desc: {
		type: String,
		default: () => ''
	},
	descImage: {
		type: String,
		default: () => ''
	}
});

const emit = defineEmits(['hide', 'resData']);
const { visible, title, createdAt, desc, descImage } = toRefs(props);

const enable = ref(false);

watch(visible, val => {
	setTimeout(() => {
		enable.value = val;
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
	border-radius: 20px 20px 20px 20px;
	background: #fff;
	min-width: 22rem;
	min-height: 10rem;
}

.notice-box {
	border-radius: 10px;
	background: #e2e8f8;
	box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
}
</style>
