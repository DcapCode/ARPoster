export const getFilesFromDropEvent = ({ dataTransfer: { files, items } }) => {
	return files.length
		? [...files]
		: items.filter(({ kind }) => kind === 'file').map(({ getAsFile }) => getAsFile());
};

export const getFilesFromInputEvent = ({ target }) => {
	const files = target.files ? [...target.files] : [];
	target.value = '';
	return files;
};

export const getImageContentType = (path: string): string => {
	const type = path.split('.').pop();
	return 'image/' + type;
};
