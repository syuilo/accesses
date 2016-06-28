import Access from './access';

type Log = {
	color: {
		bg: string;
		fg: string;
	};
} & Access;

export default Log;
