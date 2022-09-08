import { compare, hash } from 'bcryptjs';

export class User {
	private _password!: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly _cityId: number,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get cityId(): number {
		return this._cityId;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, 10);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
