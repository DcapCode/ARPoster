import { writable } from 'svelte/store';

const data = [
	{
		name: 'Content-Type',
		value: 'application/json'
	},
	{
		name: 'AppName',
		value: 'dcapedcode'
	},
	{
		name: 'Section',
		value: 'projectposts'
	}
];

function createTag(initialItems) {
	const { subscribe, update, set } = writable(initialItems);

	return {
		subscribe,
		// create: add an object for the item at the end of the store's array
		create: (name, value) =>
			update((n) => {
				n = [
					...n,
					{
						name,
						value
					}
				];
				return n;
			}),

		// delete: remove the item from the array
		delete: (name) =>
			update((n) => {
				const index = n.findIndex((item) => item.name === name);
				n = [...n.slice(0, index), ...n.slice(index + 1)];
				return n;
			}),
		//make it possible to reset store
		set
	};
}

export const tags = createTag(data);