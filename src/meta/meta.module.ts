import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetaEntity } from "./meta.entity";
import { MetaService } from "./meta.service";
import { MetaController } from "./meta.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([MetaEntity])
    ],
    providers: [MetaService],
    controllers: [MetaController]
})

export class MetaModule { }

