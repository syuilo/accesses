import Access from './access';

interface IStore {
	insert: (access: Access) => void;
}

export default IStore;
