import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { __port__ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver, UserResolver } from './resolvers';

const server = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();

	const app = express();
	app.get('/', (_, res) => {
		res.send('Hello World!');
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false,
		}),
		context: () => ({ em: orm.em }),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(__port__, () => {
		console.log(`🚀 Server is running on port ${__port__}!`);
	});
};

server().catch((err) => console.error(err));
