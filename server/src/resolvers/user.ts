import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Resolver,
} from 'type-graphql';
import { User } from '../entities';
import { MyContext } from 'src/types';
import argon2 from 'argon2';

@InputType()
class RegisterInput {
	@Field()
	username: string;
	@Field()
	email: string;
	@Field()
	password: string;
}

@InputType()
class LoginInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@ObjectType()
class InputError {
	@Field()
	input: string;
	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [InputError], { nullable: true })
	errors?: InputError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg('data') data: RegisterInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse> {
		// CONSIDER: lowercase letters === uppercase letters for username (advanced uniqueness check)

		if (data.username.length <= 3) {
			return {
				errors: [
					{
						input: 'username',
						message: 'Username is too short.',
					},
				],
			};
		}

		if (data.password.length <= 6) {
			return {
				errors: [
					{
						input: 'password',
						message: 'Password should contain at least 6 characters',
					},
				],
			};
		}

		const hashedPassword = await argon2.hash(data.password);
		const user = em.create(User, {
			username: data.username,
			email: data.email,
			password: hashedPassword,
		});
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			// Username already exists
			if (err.code === '23505') {
				return {
					errors: [
						{
							input: 'username',
							message: 'Username already taken.',
						},
					],
				};
			}
		}
		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('data') data: LoginInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: data.username });
		if (!user) {
			return {
				errors: [
					{
						input: 'username',
						message: "Username doesn't exist.",
					},
				],
			};
		}
		const passwordValid = await argon2.verify(user.password, data.password);
		if (!passwordValid) {
			return {
				errors: [
					{
						input: 'password',
						message: 'Password is incorrect.',
					},
				],
			};
		}
		return { user };
	}
}
