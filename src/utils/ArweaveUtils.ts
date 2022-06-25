import Arweave from 'arweave';
import type { TransactionResult } from '../models/TransactionResult';

// const arweave = Arweave.init({
//     host: "arweave.net",
//     port: 443,
//     protocol: "https",
//     timeout: 100000,
//     logging: false,
//   });
//TODO CHANGE THIS TO LIVE VERSION
const arweave = Arweave.init({
	host: 'localhost',
	port: 1984,
	protocol: 'http'
});

export const createArweavePost = async (
	content: string | Buffer,
	tags
): Promise<TransactionResult> => {
	const wallet = JSON.parse(sessionStorage.getItem('arweaveWallet'));
	const transaction = await arweave.createTransaction({ data: content }, wallet);

	tags.subscribe((tags) => {
		tags.forEach((tag) => {
			transaction.addTag(tag.name, tag.value);
		});
	});

	const signedTransaction = await arweave.transactions.sign(transaction, wallet).then(() => {
		return arweave.transactions.post(transaction);
	});

	return {
		id: transaction.id,
		status: signedTransaction.status,
		statusText: signedTransaction.statusText
	};
};

export const getPostCost = (dataSize: number) => {
	return arweave.transactions.getPrice(dataSize);
};
export const getWalletBalance = () => {
	return arweave.wallets.getBalance(sessionStorage.getItem('wallet_address'));
};
