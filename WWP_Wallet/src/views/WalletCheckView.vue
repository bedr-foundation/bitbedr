<template>
	<header class="w-full">
		<div class="h-10"></div>
		<div class="px-8 w-full flex items-center">
			<router-link :to="'walletCreate'" class="w-[15%]"><img src="@/assets/images/btn_back.svg" /></router-link>
			<div class="grow text-2xl text-center"></div>
			<div class="w-[15%]"></div>
		</div>
		<div class="h-5"></div>
		<div class="text-2xl font-bold text-center">{{ $t('word.mySeedWordCheck') }}</div>
	</header>
	<main class="w-full grow overflow-hidden flex flex-col items-center">
		<div class="px-8 w-full overflow-y-auto">
			<div class="h-6"></div>
			<div class="px-8 text-sm font-normal seed-box">
				<div class="h-5"></div>
				<template v-for="index in 11" :key="index">
					<template v-if="index % 2 === 1">
						<div class="flex">
							<div class="w-[45%] flex">
								<div class="w-[15%] py-1 text-right">{{ index }}</div>
								<div class="grow"></div>
								<div v-if="seedLocation[index - 1] == ''" class="w-[80%] ml-2 py-1 seed-none">&nbsp;</div>
								<div @click="dropSeed(index - 1)" v-else class="w-[80%] ml-2 py-1 seed-btn">{{ seedLocation[index - 1] }}</div>
							</div>
							<div class="grow"></div>
							<div class="w-[45%] flex">
								<div class="w-[15%] py-1 text-right">{{ index + 1 }}</div>
								<div class="grow"></div>
								<div v-if="seedLocation[index] == ''" class="w-[80%] ml-2 py-1 seed-none">&nbsp;</div>
								<div @click="dropSeed(index)" v-else class="w-[80%] ml-2 py-1 seed-btn">{{ seedLocation[index] }}</div>
							</div>
						</div>
						<div class="h-3"></div>
					</template>
				</template>
				<div class="h-2"></div>
			</div>
			<div class="h-5"></div>
			<div class="px-2 text-sm font-normal">
				<template v-for="index in 11" :key="index">
					<template v-if="index % 3 === 2">
						<div class="p-1 flex justify-around items-center">
							<div v-if="seedUse[index - 2] == 1" class="p-1 w-[28%] seed-used">{{ seedItem[index - 2] }}</div>
							<div @click="dragSeed(index - 2)" v-else class="p-1 w-[28%] seed-btn">{{ seedItem[index - 2] }}</div>
							<div v-if="seedUse[index - 1] == 1" class="p-1 w-[28%] seed-used">{{ seedItem[index - 1] }}</div>
							<div @click="dragSeed(index - 1)" v-else class="p-1 w-[28%] seed-btn">{{ seedItem[index - 1] }}</div>
							<div v-if="seedUse[index] == 1" class="p-1 w-[28%] seed-used">{{ seedItem[index] }}</div>
							<div @click="dragSeed(index)" v-else class="p-1 w-[28%] seed-btn">
								{{ seedItem[index] }}
							</div>
						</div>
					</template>
				</template>
			</div>
			<div class="h-5"></div>
			<ul class="px-5 list-disc text-sm g-gray">
				<li>{{ $t('message.seedWordSelect') }}</li>
				<li>{{ $t('message.notReissuance') }}</li>
			</ul>
			<div class="h-5"></div>
			<div class="px-6">
				<div @click="seedFinish" v-if="seedMatch == true" class="h-12 flex justify-center items-center g-btn-color">
					{{ $t('word.backupComplete') }}
				</div>
				<div v-else class="h-12 flex justify-center items-center g-btn-light-gray">{{ $t('word.backupComplete') }}</div>
			</div>
			<div class="h-10"></div>
		</div>
	</main>
	<footer></footer>
	<MainModal :visible="visible" @hide="hideModal" :title="popupMsg"></MainModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import store from '@/store';
import openCrypto from '@/utils/openCrypto';
import MainModal from '@/components/MainModal.vue';

const seed = ref('');
const seedList = ref([]);
const seedLocation = ref(['', '', '', '', '', '', '', '', '', '', '', '']);
const seedItem = ref([]);
const seedUse = ref([]);
const seedMatch = ref(false);

onMounted(() => {
	getSeedInfo();
});

// Popup Start ====================
const visible = ref(false);
const popupMsg = ref('');

const showModal = () => {
	visible.value = true;
};

const hideModal = () => {
	visible.value = false;
	popupMsg.value = '';
};

watch(popupMsg, val => {
	if (val != '') showModal();
});
// Popup End ======================

const getSeedInfo = () => {
	seed.value = openCrypto.decode(store.state.saveSeed);

	if (seed.value != '') {
		seedList.value = seed.value.split(' ');
		seedItem.value = [...seedList.value].sort(() => Math.random() - 0.5);
		seedUse.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	} else {
		router.push('/login');
	}
};

const dragSeed = pos => {
	const movePos = seedLocation.value.indexOf('');

	if (movePos >= 0) {
		seedLocation.value[movePos] = seedItem.value[pos];
		seedUse.value[pos] = 1;

		diffSeedWord();
	}
};

const dropSeed = pos => {
	const word = seedLocation.value[pos];
	let movePos = -1;

	for (let i = 0; i < 12; i++) {
		if (seedUse.value[i] == 1 && seedItem.value[i] == word) {
			movePos = i;
			break;
		}
	}

	if (movePos >= 0) {
		seedUse.value[movePos] = 0;
		seedLocation.value[pos] = '';

		diffSeedWord();
	}
};

const diffSeedWord = () => {
	if (JSON.stringify(seedList.value) == JSON.stringify(seedLocation.value)) {
		seedMatch.value = true;
	} else {
		seedMatch.value = false;
	}
};

const seedFinish = () => {
	if (store.state.saveAccount != '') {
		store.commit('setMyAccount', { account: store.state.saveAccount });

		router.push('walletFinish');
	} else {
		router.push('/login');
	}
};
</script>

<style scoped>
.seed-box {
	border-radius: 2px;
	border: 1px solid #1adf52;
	background: rgba(255, 255, 255, 0.1);
}

.seed-btn {
	border-radius: 6px;
	background: #000;
	text-align: center;
	color: #1adf52;
	border: 1px solid #000;
}

.seed-none {
	border-radius: 6px;
	border: 1px dashed #1adf52;
}

.seed-used {
	border-radius: 6px;
	border: 1px solid #959595;
	opacity: 0.5;
	/* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
	text-align: center;
}
</style>
