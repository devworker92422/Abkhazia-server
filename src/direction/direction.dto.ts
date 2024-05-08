import { ContentDTO } from "src/content/content.dto";

export interface DirectionBodyDTO {
    id?: number;
    limit?: number;
    offset?: number;
}

export interface DirectionDetailBodyDTO {
    id: number;
}

export interface NewDirectionBodyDTO {
    id?: number;
    name?: string;
    cityID?: number;
    title?: string;
    description?: string;
    heading?: string;
    bgImg?: string;
    latitude?: number;
    longitude?: number;
    contents?: ContentDTO[];
}