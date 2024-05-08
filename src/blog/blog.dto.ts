import { ContentDTO } from "src/content/content.dto";

export interface BlogBodyDTO {
    id?: number;
    limit?: number;
    offset?: number;
    seos?: SEODTO[];
}

export interface SEODTO {
    id?: number;
    keyword?: string;
}

export interface NewBlogBodyDTO {
    id?: number;
    title?: string;
    description?: string;
    bgImg?: string;
    contents?: ContentDTO[];
    seos?: SEODTO[];
}