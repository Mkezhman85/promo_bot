import { CityModel } from '@prisma/client';
import { CityCreateDto } from '../dto/city-add.dto';

export interface ICityService {
	createCity: (dto: CityCreateDto) => Promise<CityModel | null>;
	getAllCities: () => Promise<CityModel[] | null>;
	getCityInfo: (name: string) => Promise<CityModel | null>;
}
