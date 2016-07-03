/// <reference path="../../typings/mongoose/mongoose.d.ts" />
/// <reference path="../../typings/mongodb/mongodb.d.ts" />
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import IStore from '../istore';
import Access from '../access';

export type Options = {
	db?: mongodb.Db;
	mongooseConnection?: mongoose.Connection;
	collection?: string;
};

export default class MongoStore implements IStore {
	private options: Options;
	private db: mongodb.Db;
	private collection: mongodb.Collection;

	constructor(options: Options) {
		this.options = options;

		const db = options.db;
		this.collection = db.collection(options.collection || 'accesses');
	}

	public insert(access: Access) {
		this.collection.insertOne(access);
	}

	public list(limit: number) {
		return new Promise((resolve, reject) => {
			this.collection
			.find({})
			.sort({date: -1})
			.limit(limit)
			.toArray((err, docs) => {
				if (err) {
					return reject(err);
				}

				resolve(docs);
			});
		});
	}
}
