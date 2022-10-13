import { CityModel } from '@prisma/client';
import { City } from '../city.entity';

export interface ICityRepository {
	createCity: (city: City) => Promise<CityModel>;
	find: (name: string) => Promise<CityModel | null>;
	findAll: () => Promise<CityModel[] | null>;
}
