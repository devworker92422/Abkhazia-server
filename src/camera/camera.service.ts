import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CameraEntity } from "./camera.entity";
import { CameraBodyDTO } from "./camera.dto";

@Injectable()

export class CameraService {
    constructor(
        private dataSource: DataSource
    ) { }

    async create(body: CameraBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(CameraEntity)
            .save(body);
    }

    getTotal(): Promise<CameraEntity[]> {
        return this.dataSource
            .getRepository(CameraEntity)
            .find()
    }

    getActive(): Promise<CameraEntity[]> {
        return this.dataSource
            .getRepository(CameraEntity)
            .find({
                where: {
                    active: true
                }
            })
    }

    async update(id: number, body: CameraBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(CameraEntity)
            .update({ id }, body)
    }

    async remove(id: number): Promise<void> {
        await this.dataSource
            .getRepository(CameraEntity)
            .delete({ id })
    }

    async clear(): Promise<void> {
        await this.dataSource
            .getRepository(CameraEntity)
            .clear();
    }
}