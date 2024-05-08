import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserBodyDTO } from "./user.dto";


@Injectable()

export class UserService {

    constructor(
        private dataSource: DataSource,
    ) { }

    findAll(): Promise<UserEntity[]> {
        return this.dataSource
            .getRepository(UserEntity)
            .find({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    createAt: true,
                    updateAt: true,
                    email: true,
                    phoneNumber: true,
                    status: true
                },
                where: {
                    type: 2
                }
            });
    }

    findOne(cond: UserBodyDTO): Promise<UserEntity | null> {
        return this.dataSource
            .getRepository(UserEntity)
            .findOneBy(cond);
    }

    findOneByID(id: number): Promise<UserEntity> {
        return this.dataSource
            .getRepository(UserEntity)
            .findOne({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    phoneNumber: true,
                    phoneVerify: true,
                    email: true,
                    emailVerify: true,
                    status: true,
                    createAt: true,
                    updateAt: true
                },
                where: {
                    id
                }
            });
    }

    async update(id: number, update: UserBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(UserEntity)
            .update({ id }, update);
    }

    async remove(id: number): Promise<void> {
        await this.dataSource
            .getRepository(UserEntity)
            .delete(id);
    }
}