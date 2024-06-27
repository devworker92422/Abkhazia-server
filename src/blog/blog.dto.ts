import { ContentDTO } from "src/content/content.dto";
import { ImageBodyDTO } from "src/image/image.dto";

export interface ListAllEntities {
    limit: number;
    offset: number;
    seo?: SEODTO[];
}

export interface SEODTO {
    id?: number;
    keyword?: string;
}

export interface NewBlogBodyDTO {
    title?: string;
    description?: string;
    bgImg?: string;
    contents?: ContentDTO[];
    seos?: SEODTO[];
    images?: ImageBodyDTO[];
}

export interface UpdateBlogBodyDTO {
    blog?: {
        title?: string;
        description?: string;
        bgImg?: string;
        active?: boolean;
    },
    contents?: {
        new?: ContentDTO[];
        update?: ContentDTO[];
        remove?: number[];
    },
    seos?: SEODTO[];
}