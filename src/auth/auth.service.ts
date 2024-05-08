import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UserEntity } from "src/user/user.entity";
import { UserBodyDTO } from "src/user/user.dto";

@Injectable()

export class AuthService {
    constructor(
        private dataSource: DataSource,
        private jwtService: JwtService
    ) { }

    async signUp(body: UserBodyDTO): Promise<{ token: string }> {
        const { firstName, lastName, avatar, email, password, phoneNumber } = body;
        const user = this.dataSource
            .getRepository(UserEntity)
            .create({
                firstName,
                lastName,
                avatar,
                email,
                phoneNumber,
                password: await bcrypt.hash(password, 10)
            });
        await this.dataSource.getRepository(UserEntity).save(user);
        const token = this.jwtService.sign({ id: user.id })
        return { token }
    }

    async signIn(body: UserBodyDTO): Promise<{ token: string, user: UserBodyDTO }> {
        const { email, password } = body;
        const user = await this.dataSource
            .getRepository(UserEntity)
            .findOne({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: true,
                    avatar: true,
                    type: true,
                    phoneNumber: true,
                },
                where: { email }
            });
        if (!user)
            throw new UnauthorizedException('Invalid email or password');
        const isPwdMatched = await bcrypt.compare(password, user.password);
        if (!isPwdMatched)
            throw new UnauthorizedException('Invalid email or password');
        const token = this.jwtService.sign({ id: user.id });
        user.password = null;
        return {
            token,
            user
        }
    }


}