require('dotenv').config();

export const __prod__ = process.env.NODE_ENV !== 'production';
export const __port__ = 3000;

export const __db__ = {
	name: process.env.POSTGRES_DB,
	port: Number(process.env.POSTGRES_PORT),
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
};

export const __redis__ = {
	secret: process.env.REDIS_SECRET,
};
