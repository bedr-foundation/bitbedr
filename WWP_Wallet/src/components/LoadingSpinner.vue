<template>
	<div class="spinner-bg"></div>
	<div class="spinner-container">
		<div class="spinner"></div>
	</div>
</template>

<style scoped>
.spinner-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0px;
	top: 0px;
	background: rgba(0, 0, 0, 0.05);
}

.spinner-container {
	/* display: flex;
  justify-content: center;
  align-items: center;
  height: 240px; */
	display: block;
	position: fixed;
	top: calc(50% - (50px / 2));
	right: calc(50% - (50px / 2));
}

.spinner {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 5px solid #eeeeee;
	border-bottom: 5px solid #fe9616;
	animation: spin 1s linear infinite;
	position: relative;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
