import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities';
import mikroOrmConfig from './mikro-orm.config';

const server = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();
	const post = orm.em.create(Post, { title: 'First post!' });
	await orm.em.persistAndFlush(post);
};

server().catch((err) => console.error(err));
