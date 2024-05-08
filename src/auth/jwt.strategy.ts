import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTENVDTO } from "./auth.dto";
import { UserEntity } from "src/user/user.entity";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private dataSoucre: DataSource,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get<JWTENVDTO>('jwt').secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { id } = payload;
        const user = await this.dataSoucre
            .getRepository(UserEntity)
            .findOne({
                where: {
                    id
                }
            });
        if (!user)
            throw new UnauthorizedException('Login first to access');
        return user;
    }

}
