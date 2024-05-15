import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DirectionEntity } from "./direction.entity";
import { DIRECTION_RECENT_COUNT } from "src/constant";
import { DirectionBodyDTO, NewDirectionBodyDTO } from "./direction.dto";
import { ContentEntity } from "src/content/content.entity";
import { ImageEntity } from "src/image/image.entity";

@Injectable()

export class DirectionService {

    constructor(
        private dataSource: DataSource
    ) { }

    async insert(direction: NewDirectionBodyDTO): Promise<DirectionEntity> {
        return await this.dataSource
            .getRepository(DirectionEntity)
            .save(direction)
    }

    getTotalCount(): Promise<number> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .count();
    }

    findRecently(): Promise<DirectionEntity[]> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .find({
                select: {
                    id: true,
                    name: true,
                    bgImg: true
                },
                order: {
                    name: 'ASC'
                },
                take: DIRECTION_RECENT_COUNT
            })
    }

    findAll(body: DirectionBodyDTO): Promise<DirectionEntity[]> {
        return this.dataSource
            .getRepository(DirectionEntity)
            .find({
                select: {
                    id: true,
                    name: true,
                    bgImg: true
                },
                order: {
                    name: 'ASC'
                },
                take: body.limit,
                skip: body.offset
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
                    images: {
                        id: true,
                        url: true
                    }
                },
                where: {
                    id: directionID,
                },
            });
    }

    async update(direction: NewDirectionBodyDTO): Promise<DirectionEntity> {
        const updatedDirection = await this.dataSource
            .getRepository(DirectionEntity)
            .findOne({
                relations: {
                    contents: true
                },
                where: {
                    id: direction.id
                }
            });
        const contents = direction.contents;
        delete direction.contents;
        updatedDirection.bgImg = direction.bgImg;
        updatedDirection.name = direction.name;
        updatedDirection.description = direction.description;
        updatedDirection.heading = direction.heading;
        updatedDirection.longitude = direction.longitude;
        updatedDirection.latitude = direction.latitude;
        updatedDirection.title = direction.title;
        updatedDirection.name = direction.name;
        updatedDirection.contents = [];
        for (const content of contents) {
            const newContent = await this.dataSource
                .getRepository(ContentEntity)
                .save(content);
            updatedDirection.contents.push(newContent);
        }
        return await this.dataSource
            .getRepository(DirectionEntity)
            .save(updatedDirection);
    }

    async remove(directionID: number) {
        await this.dataSource
            .getRepository(DirectionEntity)
            .delete(directionID);
    }

}