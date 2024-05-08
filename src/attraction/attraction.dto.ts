import { ContentDTO } from "src/content/content.dto";

export interface NewAttractionBodyDTO {
    id?: number;
    directionID?: number;
    name?: string;
    description?: string;
    bgImg?: string;
    latitude?: number;
    longitude?: number;
    contents?: ContentDTO[];
}

export interface AttractionBodyDTO {
    directionID?: number;
    attractionID?: number;
    limit?: number;
    offset?: number;
}