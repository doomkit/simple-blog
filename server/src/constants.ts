import path from 'path';
require('dotenv').config({
	path: path.resolve(process.cwd(), '.env.postgres'),
});

export const __prod__ = process.env.NODE_ENV !== 'production';

export const __db__ = {
	name: process.env.POSTGRES_DB,
	port: Number(process.env.POSTGRES_PORT),
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
};
