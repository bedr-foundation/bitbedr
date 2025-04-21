import store from '@/store';
import router from '@/router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import i18n from '@/i18n';
import BigNumber from 'bignumber.js';

export const onBackKeyDown = e => {
	e.preventDefault();

	let curPage = router.currentRoute.value.name;
	let backPage = router.currentRoute.value.meta.backPage;
	// console.log(curPage + ' / ' + backPage);

	if (store.state.blockMode == true) return false;

	if (curPage == 'address' || curPage == 'auth') {
		if (store.state.mySymbol == '') {
			router.push('play');
		} else {
			router.push('/detail');
		}
	} else if (curPage == 'qrcode') {
		if (store.state.mySymbol == '') {
			router.push('/play');
		} else {
			router.push('/send');
		}
	} else if (curPage == 'myInfo') {
		router.push('/' + store.state.mainPage);
	} else if (backPage != '') {
		router.push('/' + backPage);
	} else if (store.state.exitSec == 1) {
		clearTimeout(store.state.exitTimer);

		navigator.app.exitApp();
	} else {
		console.log(i18n);
		showToast(i18n.global.t('message.pressAgainEnd'));

		store.state.exitSec = 1;
		store.state.exitTimer = setTimeout(() => {
			store.state.exitSec = 0;
		}, 2000);
	}
};

export const isNullOrEmpty = value => {
	return !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0);
};

export const showToast = msg => {
	if (store.state.device != 'Mobile') {
		toast(msg, {
			theme: 'dark',
			autoClose: 1000,
			position: toast.POSITION.BOTTOM_CENTER,
			transition: toast.TRANSITIONS.SLIDE
		});
	} else {
		window.plugins.toast.showWithOptions(
			{
				message: msg,
				duration: 'short', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
				position: 'bottom',
				addPixelsY: -40 // added a negative value to move it up a bit (default 0)
			},
			null, // onSuccess
			null // onError
		);
	}
};

export const makePhoneNumber = phoneNumber => {
	let val = phoneNumber.toString();
	let code = store.state.countryCode;

	if (val.substring(0, 1) == '0') {
		return code.substring(1, code.length) + val.substring(1, val.length);
	} else {
		return code.substring(1, code.length) + val;
	}
};

export const fillZero = (width, value) => {
	var str = value.toString();

	return str.length >= width ? str : new Array(width - str.length + 1).join('0') + str;
};

export const toPlainString = num => {
	return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/, function (a, b, c, d, e) {
		return e < 0 ? b + '0.' + Array(1 - e - c.length).join('0') + c + d : b + c + d + Array(e - d.length + 1).join('0');
	});
};

// bignumber 의 소수점 자리 표시
const ConvertBigNumberToString = (value, f) => {
	return toPlainString(value.toFixed(f).replace(/\.?0+$/, ''));
};

const NumberWithCommas = (double, decimalPointCipher) => {
	var parts = double.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	if (parts.length == 1) {
		decimalPointCipher = 0;
	} else if (parseInt(parts[1]) == 0) {
		decimalPointCipher = 0;
	} else {
		parts[1] = parts[1].substr(0, decimalPointCipher);
	}

	if (decimalPointCipher < 1) {
		return parts[0];
	} else {
		return parts.join('.');
	}
};

export const setDecimals = (value, len = 4) => {
	if (len == 0) {
		return NumberWithCommas(value, len);
	} else {
		const a = new BigNumber(value);
		return NumberWithCommas(ConvertBigNumberToString(a, len));
	}

	/*
	if (len == 0) {
		return Math.round(value);
	} else {
		value = parseFloat(value).toFixed(len).toString();
		console.log(value);

		return NumberWithCommas(value, len);
	}
	*/
};

export const setDecimalsBall = value => {
	value = parseFloat(Math.round(value * 100) / 100).toFixed(2);

	var parts = value.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return parts.join('.');
};

export const getShowTime = value => {
	let c_time = new Date(value);
	let showTime = c_time.getFullYear() + '.' + ('0' + (c_time.getMonth() + 1)).slice(-2) + '.' + ('0' + c_time.getDate()).slice(-2);

	return showTime;
};

export const getShowDate = value => {
	let c_time = new Date(value);
	let showTime =
		c_time.getFullYear() +
		'-' +
		('0' + (c_time.getMonth() + 1)).slice(-2) +
		'-' +
		('0' + c_time.getDate()).slice(-2) +
		' ' +
		('0' + c_time.getHours()).slice(-2) +
		':' +
		('0' + c_time.getMinutes()).slice(-2);

	return showTime;
};

export const shuffle = array => {
	array.sort(() => Math.random() - 0.5);

	return array;
};

export const pad = (n, width) => {
	n = n + '';

	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

export const IsJsonString = str => {
	try {
		var json = JSON.parse(str);
		return typeof json === 'object';
	} catch (e) {
		return false;
	}
};

export const charToUnicode = str => {
	if (!str) return false; // Escaping if not exist
	var unicode = '';
	for (var i = 0, l = str.length; i < l; i++) {
		unicode += '\\' + str[i].charCodeAt(0).toString(16);
	}
	return unicode;
};

export const escapeUnicode = str => {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		// Assumption: all characters are < 0xffff
		result += '\\u' + ('000' + str[i].charCodeAt(0).toString(16)).substr(-4);
	}
	return result;
};

export const checkEmail = email => {
	const validateEmail = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/;
	if (!validateEmail.test(email) || !email) {
		return true;
	} else {
		return false;
	}
};

export const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const checkError = (status, code, msg) => {
	if (status === 401 || status === 403 || status === 300) {
		router.push('/login');
	} else if (code === 300) {
		return msg;
	} else if (code === 301) {
		return 'error.HAS_SOME_ERROR';
	} else if (code === 302) {
		return 'error.MISSING_PARAM';
	} else if (code === 303) {
		return 'error.NOT_FOUND_USER';
	} else if (code === 304) {
		return 'error.NOT_ACTIVITY_USER';
	} else if (code === 305) {
		return 'error.BLOCKED_USER';
	} else if (code === 306) {
		return 'error.NOT_MATCH_PASSWORD';
	} else if (code === 307) {
		return 'error.ALREADY_REG_USER';
	} else if (code === 308) {
		return 'error.EXPRIED_MAIL_TOKEN';
	} else if (code === 309) {
		return 'error.EXPRIED_VERIFY_CODE';
	} else if (code === 310) {
		return 'error.INCORRET_VERIFY_CODE';
	} else if (code === 311) {
		return 'error.ERROR_ALREADY_REG_MAIL';
	} else if (code === 312) {
		return 'error.ERROR_INCORRECT_EMAIL';
	} else if (code === 500) {
		return 'error.NOT_FOUND_REFERRER';
	} else if (code === 501) {
		return 'error.WALLET_NOT_ENOUGH_MONEY';
	} else if (code === 502) {
		return 'error.WALLET_FEE_NOT_ENOUGH_MONEY';
	} else if (code === 503) {
		return 'error.NOT_FOUND_COIN';
	} else if (code === 504) {
		return 'error.NOT_FOUND_WALLET';
	} else if (code === 505) {
		return 'error.NOT_ENOUGH_BALANCE';
	} else if (code === 506) {
		return 'error.NOT_TRANSFER_POINT';
	} else if (code === 507) {
		return 'error.MISSING_WITHDRAW_PW';
	} else if (code === 508) {
		return 'error.NOT_SUPPORT_SWAP';
	} else if (code === 509) {
		return 'error.LESS_MINIMUM_COST_SWAP';
	} else if (code === 510) {
		return 'error.FAILED_POINT_SWAP';
	} else if (code === 511) {
		return 'error.TRANSFER_WAITING';
	} else if (code === 512) {
		return 'error.POINT_NEED_INTERNAL_TRANSFER';
	} else if (code === 513) {
		return 'error.CANT_SEND_SAME_ADDRESS';
	} else if (code === 514) {
		return 'error.LESS_MINIMUN_TRANSFER_QTY';
	} else if (code === 515) {
		return 'error.NETWORK_PRICE_ISSUS';
	} else if (code === 516) {
		return 'error.LESS_MAXIMUM_COST_SWAP';
	} else if (code === 600) {
		return 'error.WEX_BALL_NOT_START';
	} else if (code === 601) {
		return 'error.WEX_BALL_NOT_WINNUMBERS';
	} else if (code === 602) {
		return 'error.WEX_BALL_NOT_END';
	} else {
		return msg;
	}
};
