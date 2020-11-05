import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { __port__, __prod__, __redis__ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver, UserResolver } from './resolvers';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const server = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();

	const app = express();
	app.get('/', (_, res) => {
		res.send('Hello World!');
	});

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	if (!__redis__.secret) {
		throw new Error("Can't connect to redis: secret is undefined");
	}

	app.use(
		session({
			name: 'sbid',
			store: new RedisStore({ client: redisClient, disableTouch: true }),
			cookie: {
				maxAge: 1000 * 86400 * 365, // 1 year
				httpOnly: true,
				sameSite: 'lax',
				secure: __prod__,
			},
			saveUninitialized: false,
			secret: __redis__.secret,
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(__port__, () => {
		console.log(`🚀 Server is running on port ${__port__}!`);
	});
};

server().catch((err) => console.error(err));
