import Access from './access';

interface IStore {
	insert: (access: Access) => void;
	list: (limit: number) => Promise<Access[]>;
}

export default IStore;
