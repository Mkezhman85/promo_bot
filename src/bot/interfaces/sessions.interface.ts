import { Context, Scenes } from 'telegraf';

// обогатить сессию доп. свойствами.
export interface IMySessionScene extends Scenes.SceneSessionData {
	myProps: string;
}

// Типизировать отдельную сессию
export interface IMySession extends Scenes.SceneSession<IMySessionScene> {
	name: string;
	myProp: string;
}

// Контекст бота
export interface IMyContext extends Context {
	props: string;
	session: IMySession;
	scene: Scenes.SceneContextScene<IMyContext, IMySessionScene>;
}
