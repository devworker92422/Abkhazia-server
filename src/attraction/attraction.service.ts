import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AttractionEntity } from "./attraction.entity";
import { DirectionEntity } from "src/direction/direction.entity";
import { NewAttractionBodyDTO, AttractionBodyDTO } from "./attraction.dto";
import { ATTRACTION_RECENT_COUNT } from "src/constant";
import { ContentEntity } from "src/content/content.entity";

@Injectable()

export class AttractionService {
    constructor(
        private dataSource: DataSource
    ) { }

    async insert(attraction: NewAttractionBodyDTO): Promise<AttractionEntity> {
        const newAttraction = this.dataSource
            .getRepository(AttractionEntity)
            .create(attraction);
        const direction = await this.dataSource
            .getRepository(DirectionEntity)
            .findOne({
                where: {
                    id: attraction.directionID
                }
            });
        newAttraction.direction = direction;
        return await this.dataSource
            .getRepository(AttractionEntity)
            .save(newAttraction);
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

    findRecently(): Promise<AttractionEntity[]> {
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
                take: ATTRACTION_RECENT_COUNT,
            })
    }

    findAll(body: AttractionBodyDTO): Promise<AttractionEntity[]> {
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
                    images: {
                        id: true,
                        url: true
                    }
                },
                where: {
                    id: attractionID
                }
            })
    }

    async update(attraction: NewAttractionBodyDTO): Promise<AttractionEntity> {
        const contents = attraction.contents;
        delete attraction.contents;
        const update = await this.dataSource
            .getRepository(AttractionEntity)
            .findOne({
                relations: {
                    contents: true,
                },
                where: {
                    id: attraction.id
                }
            });
        update.direction = await this.dataSource
            .getRepository(DirectionEntity)
            .findOne({ where: { id: attraction.directionID } });
        update.name = attraction.name;
        update.bgImg = attraction.bgImg;
        update.description = attraction.description;
        update.heading = attraction.heading;
        update.latitude = attraction.latitude;
        update.longitude = attraction.longitude;
        update.contents = [];
        for (const content of contents) {
            const newContent = await this.dataSource
                .getRepository(ContentEntity)
                .save(content);
            update.contents.push(newContent);
        }
        return await this.dataSource
            .getRepository(AttractionEntity)
            .save(update);
    }

    async remove(attractionID: number): Promise<void> {
        await this.dataSource
            .getRepository(AttractionEntity)
            .delete(attractionID);
    }
}
