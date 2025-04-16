import store from '@/store';
import { createRouter, createWebHistory } from 'vue-router';
import SplashView from '@/views/SplashView.vue';
import MakePassView from '@/views/MakePassView.vue';
import LoginView from '@/views/LoginView.vue';
import FindIdView from '@/views/FindIdView.vue';
import FindPassView from '@/views/FindPassView.vue';
import JoinView from '@/views/JoinView.vue';
import ResetView from '@/views/ResetView.vue';
import ChangeView from '@/views/ChangePasswordView.vue';
import PlayView from '@/views/PlayView.vue';
import DetailView from '@/views/DetailView.vue';
import SendView from '@/views/SendView.vue';
import SwapView from '@/views/SwapView.vue';
import LockupView from '@/views/LockupView.vue';
import AuthView from '@/views/AuthView.vue';
import SettingView from '@/views/SettingView.vue';
import MyCheckView from '@/views/MyCheckView.vue';
import MySeedView from '@/views/MySeedView.vue';
import MyInfoView from '@/views/MyInfoView.vue';
import QrcodeView from '@/views/QrcodeView.vue';
import CompanyView from '@/views/CompanyView.vue';
import PrivacyView from '@/views/PrivacyView.vue';
import NoticeView from '@/views/NoticeView.vue';
import NoticeDetailView from '@/views/NoticeDetailView.vue';
import WwpworldView from '@/views/WwpworldView.vue';
import SnsView from '@/views/SnsView.vue';
import WwpPayView from '@/views/WwpPayView.vue';
import ReceiptView from '@/views/ReceiptView.vue';
import SalesView from '@/views/SalesView.vue';
import SalesDetailView from '@/views/SalesDetailView.vue';
import OnlinePayView from '@/views/OnlinePayView.vue';
import OnlineReceiptView from '@/views/OnlineReceiptView.vue';
import SecessionView from '@/views/SecessionView.vue';
import OtpRegisterView from '@/views/OtpRegisterView.vue';
import OtpRemoveView from '@/views/OtpRemoveView.vue';

const routes = [
	{
		path: '/',
		name: 'splash',
		component: SplashView,
		meta: { backPage: '' }
	},
	{
		path: '/makePass',
		name: 'makePass',
		component: MakePassView,
		meta: { backPage: '' }
	},
	{
		path: '/login',
		name: 'login',
		component: LoginView,
		meta: { backPage: '' }
	},
	{
		path: '/findId',
		name: 'findId',
		component: FindIdView,
		meta: { backPage: 'login' }
	},
	{
		path: '/findPass',
		name: 'findPass',
		component: FindPassView,
		meta: { backPage: 'login' }
	},
	{
		path: '/join',
		name: 'join',
		component: JoinView,
		meta: { backPage: 'login' }
	},
	{
		path: '/reset',
		name: 'reset',
		component: ResetView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/change',
		name: 'change',
		component: ChangeView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/play',
		name: 'play',
		component: PlayView,
		meta: { backPage: '' }
	},
	{
		path: '/detail',
		name: 'detail',
		component: DetailView,
		meta: { backPage: 'play' }
	},
	{
		path: '/send',
		name: 'send',
		component: SendView,
		meta: { backPage: 'detail' }
	},
	{
		path: '/swap',
		name: 'swap',
		component: SwapView,
		meta: { backPage: 'detail' }
	},
	{
		path: '/lockup',
		name: 'lockup',
		component: LockupView,
		meta: { backPage: 'detail' }
	},
	{
		path: '/auth',
		name: 'auth',
		component: AuthView,
		meta: { backPage: '' }
	},
	{
		path: '/setting',
		name: 'setting',
		component: SettingView,
		meta: { backPage: '' }
	},
	{
		path: '/myCheck',
		name: 'myCheck',
		component: MyCheckView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/mySeed',
		name: 'mySeed',
		component: MySeedView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/myInfo',
		name: 'myInfo',
		component: MyInfoView,
		meta: { backPage: '' }
	},
	{
		path: '/address',
		name: 'address',
		component: () => import(/* webpackChunkName: "address" */ '@/views/AddressView.vue'),
		meta: { backPage: '' }
	},
	{
		path: '/qrcode',
		name: 'qrcode',
		component: QrcodeView,
		meta: { backPage: '' }
	},
	{
		path: '/company',
		name: 'company',
		component: CompanyView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/privacy',
		name: 'privacy',
		component: PrivacyView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/notice',
		name: 'notice',
		component: NoticeView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/noticeDetail',
		name: 'noticeDetail',
		component: NoticeDetailView,
		meta: { backPage: 'notice' }
	},
	{
		path: '/wwpworld',
		name: 'wwpworld',
		component: WwpworldView,
		meta: { backPage: '' }
	},
	{
		path: '/sns',
		name: 'sns',
		component: SnsView,
		meta: { backPage: '' }
	},
	{
		path: '/wwppay',
		name: 'wwppay',
		component: WwpPayView,
		meta: { backPage: '' }
	},
	{
		path: '/receipt',
		name: 'receipt',
		component: ReceiptView,
		meta: { backPage: '' }
	},
	{
		path: '/sales',
		name: 'sales',
		component: SalesView,
		meta: { backPage: '' }
	},
	{
		path: '/salesDetail',
		name: 'salesDetail',
		component: SalesDetailView,
		meta: { backPage: '' }
	},
	{
		path: '/onlinePay',
		name: 'onlinePay',
		component: OnlinePayView,
		meta: { backPage: '' }
	},
	{
		path: '/onlineReceipt',
		name: 'onlineReceipt',
		component: OnlineReceiptView,
		meta: { backPage: '' }
	},
	{
		path: '/secession',
		name: 'secession',
		component: SecessionView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/otpRegister',
		name: 'otpRegister',
		component: OtpRegisterView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/otpRemove',
		name: 'otpRemove',
		component: OtpRemoveView,
		meta: { backPage: 'setting' }
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/'
	}
];

const router = createRouter({
	history: createWebHistory(store.state.BASE_URL),
	routes
});

router.beforeEach(async (to, from, next) => {
	const routerList = [
		'splash',
		'makePass',
		'wallet',
		'walletGuide',
		'walletCreate',
		'walletCheck',
		'walletFinish',
		'seedCheck',
		'seedFinish',
		'join',
		'login',
		'privacy',
		'reset',
		'findId',
		'findPass'
	];

	// 외부 결제 처리시 paymentKey 저장
	if (to.name == 'onlinePay' && to.query.paymentKey != undefined) {
		if (to.query.paymentKey != '') {
			store.commit('setPaymentKey', { key: to.query.paymentKey });
			store.commit('setPaymentStatus', { key: '' });
			store.commit('setPaymentRid', { rid: '' });

			router.push('/login');
		} else {
			store.commit('setPaymentKey', { key: '' });
		}
	}

	if (!routerList.includes(to.name) && store.state.myData == '') {
		router.push('/login');
	} else if (!routerList.includes(to.name)) {
		// 온라인 결제와 관련없는 페이지 이동시 -> 온라인결제 관련정보 삭제
		if (to.name != 'onlinePay' && to.name != 'onlineReceipt') {
			if (store.state.paymentKey != '' || store.state.paymentStatus != '') {
				store.commit('setPaymentKey', { key: '' });
				store.commit('setPaymentStatus', { key: '' });
				store.commit('setPaymentRid', { rid: '' });

				router.push('/login');
			}
		}
	}

	next();
});

export default router;
