import { ContentDTO } from "src/content/content.dto";
import { ImageBodyDTO } from "src/image/image.dto";

export interface NewAttractionBodyDTO {
    directionID?: number;
    name?: string;
    description?: string;
    bgImg?: string;
    latitude?: number;
    longitude?: number;
    heading?: string;
    contents?: ContentDTO[];
}

export interface UpdateAttractionBodyDTO {
    attraction?: {
        name?: string;
        description?: string;
        bgImg?: string;
        latitude?: number;
        longitude?: number;
        heading?: string;
        directionID?: number;
        active?: boolean;
    },
    direction?: {
        id: number;
    }
    contents?: {
        new?: ContentDTO[],
        update?: ContentDTO[],
        remove?: number[]
    }
}

export interface ListAllEntities {
    limit: number;
    offset: number;
    directionID?: number;
}