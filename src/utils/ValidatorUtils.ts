export const isEmpty = (value: string) => {
	return !value || value.length === 0;
};

export const isBlank = (value: string) => {
	return !value || /^\s*$/.test(value);
};

export const isBlankOrEmpty = (value: string) => {
	return isEmpty(value) || isBlank(value);
};
