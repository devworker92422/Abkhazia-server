import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ImageEntity } from "./image.entity";
import { NewImageBodyDTO } from "./image.dto";

@Injectable()

export class ImageService {
    constructor(
        private dataSource: DataSource
    ) { }

    async create(image: NewImageBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(ImageEntity)
            .save(image);
    }

    async remove(id: number): Promise<void> {
        await this.dataSource
            .getRepository(ImageEntity)
            .delete(id);
    }

    async update(update: ImageEntity): Promise<void> {
        await this.dataSource
            .getRepository(ImageEntity)
            .save(update);
    }
}