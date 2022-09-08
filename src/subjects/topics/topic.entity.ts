import { Promotion } from '../promotions/promotion.entity';

export class Theme {
	constructor(private readonly _title: string, private readonly _description: string) {}
	get title(): string {
		return this._title;
	}
	get description(): string {
		return this._description;
	}
}
