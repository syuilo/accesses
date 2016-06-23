type Access = {
	ip: string;
	protocol: string;
	method: string;
	host: string;
	path: string;
	query: string;
	headers: any;
	date: Date;
}

export default Access;
