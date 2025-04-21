export default {
	getItem: key => {
		const value = localStorage.getItem(key) || '';
		let res = '';
		try {
			res = JSON.parse(value);
		} catch (err) {
			res = value;
		}
		return res;
	},
	setItem: (key, val) => {
		localStorage.setItem(key, JSON.stringify(val));
	},
	removeItem: key => {
		localStorage.removeItem(key);
	},
	clear: () => {
		localStorage.clear();
	}
};
