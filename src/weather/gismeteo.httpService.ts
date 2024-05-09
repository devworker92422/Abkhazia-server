import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, catchError } from "rxjs";
import { AxiosError } from "axios";
import { GismeteoENVDTO, GismeteoBodyDTO, GismeteoCityBodyDTO } from "./weather.dto";
import { GISMETEO_URL, GISMETEO_CITY_URL } from "src/constant";

@Injectable()
export class GismeteoHttpService {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async getAllWeatherData(cityID: number): Promise<GismeteoBodyDTO[]> {
        const gismeteoConfig = this.configService.get<GismeteoENVDTO>('gismeteo');
        const header = {
            'Accept-Encoding': 'deflate, gzip',
            'X-Gismeteo-Token': gismeteoConfig.key
        }
        const { data } = await firstValueFrom(
            this.httpService.get(GISMETEO_URL + cityID, {
                headers: header,
                params: {
                    days: gismeteoConfig.days
                }
            }).pipe(
                catchError((error: AxiosError) => {
                    console.log(error.response.data)
                    throw 'An error happened!';
                }),
            )
        );
        return data.response
    }

    async getCityInfo(name: string): Promise<GismeteoCityBodyDTO> {
        const gismeteoConfig = this.configService.get<GismeteoENVDTO>('gismeteo');
        const header = {
            'Accept-Encoding': 'deflate, gzip',
            'X-Gismeteo-Token': gismeteoConfig.key
        }
        const { data } = await firstValueFrom(
            this.httpService.get(GISMETEO_CITY_URL, {
                headers: header,
                params: {
                    query: name
                }
            }).pipe(
                catchError((error: AxiosError) => {
                    console.log(error.response.data)
                    throw 'An error happened!';
                }),
            )
        );
        return data.response;
    }

}