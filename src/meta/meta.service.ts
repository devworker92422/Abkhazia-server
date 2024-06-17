import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { MetaEntity } from "./meta.entity";
import { MetaBodyDTO } from "./meta.dto";

@Injectable()

export class MetaService {
    constructor(
        private dataSource: DataSource
    ) { }

    getMetatData(): Promise<any> {
        return this.dataSource
            .getRepository(MetaEntity)
            .findOne({
                where: {
                    id: 1
                }
            });
    }

    async createOrUpdate(body: MetaBodyDTO): Promise<void> {
        if (body.id)
            await this.dataSource
                .getRepository(MetaEntity)
                .update({ id: body.id }, body);
        else
            await this.dataSource
                .getRepository(MetaEntity)
                .save(body)
    }

}