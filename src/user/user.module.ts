import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, JwtService],
    controllers: [UserController]
})

export class UserModule { }