import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { UserEntity } from "src/user/user.entity";
import { JWTENVDTO } from "./auth.dto";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<JWTENVDTO>('jwt').secret,
                    signOptions: {
                        expiresIn: config.get<JWTENVDTO>('jwt').expires
                    }
                }
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ConfigService, UserService],
    exports: [PassportModule, JwtStrategy]
})

export class AuthModule { }

