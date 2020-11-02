import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities';
import { __db__, __prod__ } from './constants';

export default {
	type: 'postgresql',
	dbName: __db__.name,
	port: __db__.port,
	user: __db__.user,
	password: __db__.password,
	migrations: {
		path: './src/migrations',
	},
	entities: [Post],
	debug: __prod__,
} as Parameters<typeof MikroORM.init>[0];
