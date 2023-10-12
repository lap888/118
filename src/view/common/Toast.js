import React from 'react';
import RootToast from 'react-native-root-toast';
// import Colors from './Colors';


export default Toast = (() => {
	let tipToast;
	const toastStyle = {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 10,
	};

	const tip = (message) => {
		if (tipToast) {
			RootToast.hide(tipToast);
		}
		tipToast = RootToast.show(message, {
			duration: 2000,
			position: RootToast.positions.CENTER,
			backgroundColor: 'rgba(0,0,0,0.8)',
			containerStyle: toastStyle,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
		});
	};

	const tipErrorDescription = (data) => {
		if (data && data.errorDescription) {
			tip(data.errorDescription);
		}
	};

	const tipErrorMsg = (data) => {
		if (data && data.errorMsg) {
			tip(data.errorMsg);
		}
	};

	const tipTop = (message, duration = 2000) => {
		if (tipToast) {
			RootToast.hide(tipToast);
		}
		tipToast = RootToast.show(message, {
			duration: duration,
			position: RootToast.positions.TOP,
			backgroundColor: 'rgba(0,0,0,0.8)',
			containerStyle: toastStyle,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
		});
	};

	const tipBottom = (message) => {
		if (tipToast) {
			RootToast.hide(tipToast);
		}
		tipToast = RootToast.show(message, {
			duration: 2000,
			position: RootToast.positions.BOTTOM,
			backgroundColor: 'rgba(0,0,0,0.8)',
			containerStyle: toastStyle,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
		});
	};

	const show = (message) => {
		if (tipToast) {
			RootToast.hide(tipToast);
		}
		tipToast = RootToast.show(message.text, {
			duration: 2000,
			position: message.position === "top" ? RootToast.positions.TOP : RootToast.positions.BOTTOM,
			backgroundColor: 'rgba(0,0,0,0.8)',
			containerStyle: toastStyle,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
		});
	};

	return {
		tip,
		tipErrorMsg,
		tipErrorDescription,
		tipTop,
		tipBottom,
		show,
	};
})();