type Access = {
	id: string;
	remoteaddr: string;
	protocol: string;
	httpVersion: string;
	method: string;
	path: string;
	query: string;
	headers: any;
	date: Date;
	worker: string;
}

export default Access;
