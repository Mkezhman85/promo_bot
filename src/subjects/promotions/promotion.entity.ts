export class Promotion {
	constructor(
		private readonly _title: string,
		private readonly _text: string,
		private readonly _themeId: number,
		private readonly _cityId: number,
	) {}
	get title(): string {
		return this._title;
	}
	get text(): string {
		return this._text;
	}
	get themeId(): number {
		return this._themeId;
	}
	get cityId(): number {
		return this._cityId;
	}
}
