import { CityModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { City } from './city.entity';
import { ICityRepository } from './city.repository.interface';
import { CityCreateDto } from './dto/city-add.dto';

@injectable()
export class CityService {
	constructor(
		@inject(TYPES.CityRepository) private cityRepository: ICityRepository,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}
	async createCity({ name }: CityCreateDto): Promise<CityModel | null> {
		const newCity = new City(name);
		const existedCity = await this.cityRepository.find(name);
		if (existedCity) {
			return null;
		}
		this.loggerService.log(`[CityService] Добавлен город. ${name}`);
		return this.cityRepository.createCity(newCity);
	}

	async getAllCities(): Promise<CityModel[] | null> {
		this.loggerService.log(`[CityService] Получен перечень городов...`);
		return this.cityRepository.findAll();
	}

	async getCityInfo(name: string): Promise<CityModel | null> {
		const existedCity = await this.cityRepository.find(name);
		if (existedCity) {
			this.loggerService.log(`[CityService] Получена информация по городу ${existedCity.name}...`);
		} else {
			this.loggerService.log(`[CityService] Город не найден...`);
		}
		return existedCity;
	}
}
