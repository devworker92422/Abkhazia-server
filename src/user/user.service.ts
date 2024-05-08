import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserBodyDTO } from "./user.dto";


@Injectable()

export class UserService {

    constructor(
        private dataSource: DataSource,
    ) { }

    async signUp(body: UserBodyDTO): Promise<void> {
        const { email, password } = body;
        const user = this.dataSource
            .getRepository(UserEntity)
        // .create({
        //     email,
        //     password: bcrypt.hash(password, 10)
        // });
    }

    findAll(): Promise<UserEntity[]> {
        return this.dataSource
            .getRepository(UserEntity)
            .find();
    }

    findOne(cond: UserBodyDTO): Promise<UserEntity | null> {
        return this.dataSource
            .getRepository(UserEntity)
            .findOneBy(cond);
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