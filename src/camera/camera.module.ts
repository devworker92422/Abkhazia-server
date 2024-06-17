import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CameraEntity } from "./camera.entity";
import { CameraController } from "./camera.controller";
import { CameraService } from "./camera.service";

@Module({
    imports: [TypeOrmModule.forFeature([CameraEntity])],
    providers: [CameraService],
    controllers: [CameraController]
})

export class CameraModule { }