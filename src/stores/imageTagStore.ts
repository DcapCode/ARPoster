import { writable } from 'svelte/store';

// in the store describe a list of items by name and value
const data = [
	{
		name: 'Content-Type',
		value: 'application/png'
	}
];

// create a custom store fulfilling the CRUD operations
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
		set
	};
}

export const tags = createTag(data);
