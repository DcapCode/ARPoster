import { getWalletBalance } from '../utils/ArweaveUtils';
import { writable } from 'svelte/store';

export const walletBalance = writable(0);
export const walletConnected = writable(false);

export const updateWalletBalance = async () => {
	await getWalletBalance().then((result) => {
		walletBalance.update(() => +result / 1000000000000);
	});
};
