import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AttractionEntity } from "./attraction.entity";
import { DirectionEntity } from "src/direction/direction.entity";
import { NewAttractionBodyDTO, ListAllEntities, UpdateAttractionBodyDTO } from "./attraction.dto";
import { ContentEntity } from "src/content/content.entity";

@Injectable()

export class AttractionService {
    constructor(
        private dataSource: DataSource
    ) { }

    async create(attraction: NewAttractionBodyDTO): Promise<AttractionEntity> {
        return await this.dataSource
            .getRepository(AttractionEntity)
            .save({ ...attraction, direction: { id: attraction.direction.id } });
    }

    getTotalCount(directionID?: number): Promise<number> {
        const whereCond: Object = directionID ? {
            direction: {
                id: directionID
            }
        } : {};
        return this.dataSource
            .getRepository(AttractionEntity)
            .count({
                where: whereCond
            });
    }

    findAllActive(): Promise<AttractionEntity[]> {
        return this.dataSource
            .getRepository(AttractionEntity)
            .find({
                select: {
                    id: true,
                    bgImg: true,
                    name: true
                },
                order: {
                    createAt: 'DESC'
                },
                where: {
                    active: true
                }
            })
    }

    findAll(body: ListAllEntities): Promise<AttractionEntity[]> {
        const whereCond: Object = body.directionID ? {
            direction: {
                id: body.directionID
            }
        } : {};
        return this.dataSource
            .getRepository(AttractionEntity)
            .find({
                select: {
                    id: true,
                    name: true,
                    bgImg: true,
                    direction: {
                        id: true
                    }
                },
                where: whereCond,
                take: body.limit,
                skip: body.offset,
            });
    }

    findOne(attractionID: number): Promise<AttractionEntity> {
        return this.dataSource
            .getRepository(AttractionEntity)
            .findOne({
                relations: {
                    contents: true,
                    images: true
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    heading: true,
                    bgImg: true,
                    latitude: true,
                    longitude: true,
                    createAt: true,
                    contents: {
                        id: true,
                        question: true,
                        content: true
                    },
                    // images: {
                    //     id: true,
                    //     url: true
                    // }
                },
                where: {
                    id: attractionID
                }
            })
    }

    async update(id: number, update: UpdateAttractionBodyDTO): Promise<AttractionEntity> {
        await this.dataSource
            .getRepository(AttractionEntity)
            .update({ id }, { ...update.attraction, direction: { id: update?.direction?.id } });
        update?.contents?.new?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .save({ ...a, attraction: { id } });
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
            .getRepository(AttractionEntity)
            .delete(id);
        return { id }
    }
}
