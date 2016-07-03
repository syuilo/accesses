/// <reference path="../../typings/mongoose/mongoose.d.ts" />
/// <reference path="../../typings/mongodb/mongodb.d.ts" />
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';

export type Options = {
	db?: mongodb.Db;
	mongooseConnection?: mongoose.Connection;
	collection?: string;
};


export default class {
	private options: Options;
	private db: mongodb.Db;

	constructor(options: Options) {
		this.options = options;
		this.collection = options.collection || 'accesses';
	}

	private connectionFailed(err: any) {
		this.changeState('disconnected');
		throw err;
	}

	public insert() {

	}
}
