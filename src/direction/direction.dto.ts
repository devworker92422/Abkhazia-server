import { ContentDTO } from "src/content/content.dto";
// import { ImageBodyDTO } from "src/image/image.dto";

export interface NewDirectionBodyDTO {
    name?: string;
    cityID?: number;
    title?: string;
    description?: string;
    heading?: string;
    bgImg?: string;
    thumbnail?: string;
    latitude?: number;
    longitude?: number;
    contents?: ContentDTO[];
    // images?: ImageBodyDTO[];
}

export interface UpdateDirectionBodyDTO {
    direction: {
        title?: string;
        description?: string;
        heading?: string;
        bgImg?: string;
        thumbnail?: string;
        latitude?: number;
        longitude?: number;
        active?: boolean;
    }
    contents: {
        new: ContentDTO[],
        update: ContentDTO[],
        remove: number[]
    };
}

export interface ListAllEntities {
    limit: number;
    offset: number;
}