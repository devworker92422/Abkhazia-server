import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DirectionEntity } from "./direction.entity";
import { NewDirectionBodyDTO, UpdateDirectionBodyDTO } from "./direction.dto";
import { ContentEntity } from "src/content/content.entity";

@Injectable()

export class DirectionService {

    constructor(
        private dataSource: DataSource
    ) { }

    async create(direction: NewDirectionBodyDTO): Promise<DirectionEntity> {
        return await this.dataSource
            .getRepository(DirectionEntity)
            .save(direction)
    }

    getTotalCount(): Promise<number> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .count();
    }

    findAllActive(): Promise<DirectionEntity[]> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .find({
                select: {
                    id: true,
                    name: true,
                    bgImg: true,
                    active: true
                },
                order: {
                    name: 'ASC'
                },
                where: {
                    active: true
                }
            })
    }

    findAll(limit: number, offset: number): Promise<DirectionEntity[]> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .find({
                select: {
                    id: true,
                    name: true,
                    bgImg: true,
                    heading: true,
                    active: true,
                },
                order: {
                    name: 'ASC'
                },
                take: limit,
                skip: offset
            });
    }

    findOne(directionID: number): Promise<DirectionEntity> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .findOne({
                relations: {
                    contents: true,
                    weathers: true,
                    images: true
                },
                select: {
                    id: true,
                    name: true,
                    title: true,
                    description: true,
                    bgImg: true,
                    createAt: true,
                    latitude: true,
                    longitude: true,
                    heading: true,
                    active: true,
                    contents: {
                        id: true,
                        question: true,
                        content: true
                    },
                    weathers: {
                        id: true,
                        description: true,
                        icon: true,
                        date: true,
                        comfortTemp: true,
                        waterTemp: true,
                        airTemp: true
                    },
                    // images: {
                    //     id: true,
                    //     url: true
                    // }
                },
                where: {
                    id: directionID,
                },
            });
    }

    async update(id: number, update: UpdateDirectionBodyDTO): Promise<DirectionEntity> {
        await this.dataSource
            .getRepository(DirectionEntity)
            .update({ id }, update.direction);
        update?.contents?.new?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .save({ ...a, direction: { id } });
        });
        update?.contents?.update?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .update({ id: a.id }, a)
        });
        update?.contents?.remove?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .delete(a);
        });
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number }> {
        await this.dataSource
            .getRepository(DirectionEntity)
            .delete(id);
        return { id }
    }

}