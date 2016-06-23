import AccessWithWorker from './access-with-worker';

type Log = {
	color: {
		bg: string;
		fg: string;
	};
} & AccessWithWorker;

export default Log;
