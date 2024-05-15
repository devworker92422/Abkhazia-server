import { ContentDTO } from "src/content/content.dto";
import { ImageBodyDTO } from "src/image/image.dto";

export interface NewAttractionBodyDTO {
    id?: number;
    directionID?: number;
    name?: string;
    description?: string;
    bgImg?: string;
    latitude?: number;
    longitude?: number;
    contents?: ContentDTO[];
    images?: ImageBodyDTO[]
}

export interface AttractionBodyDTO {
    directionID?: number;
    attractionID?: number;
    limit?: number;
    offset?: number;
}