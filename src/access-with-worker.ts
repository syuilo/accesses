import Access from './access';

type AccessWithWorker = {
	worker: string;
} & Access;

export default AccessWithWorker;
