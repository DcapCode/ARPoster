import { writable } from 'svelte/store';

export const showModal = writable(false);
export const modalContent = writable('');
export const modalHeader = writable('');

export const resetModal = () => {
	showModal.update(() => false);
	modalContent.update(() => '');
	modalHeader.update(() => '');
};

export const showResultModal = (header: string, content: string) => {
	modalContent.update(() => content);
	modalHeader.update(() => header);
	showModal.update(() => true);
};
