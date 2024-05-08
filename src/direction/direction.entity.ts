import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { WeatherEntity } from "src/weather/weather.entity";
import { ContentEntity } from "src/content/content.entity";
import { AttractionEntity } from "src/attraction/attraction.entity";

@Entity()

export class DirectionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    bgImg: string;

    @Column()
    cityID: number;

    @Column('double')
    latitude: number;

    @Column('double')
    longitude: number;

    @Column('text')
    heading: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

    @OneToMany(
        () => WeatherEntity,
        (weather) => weather.direction,
    )
    weathers: WeatherEntity[]

    @OneToMany(
        () => ContentEntity,
        (content) => content.direction,
    )
    contents: ContentEntity[]

    @OneToMany(
        () => AttractionEntity,
        (attraction) => attraction.direction
    )
    attractions: AttractionEntity[]

}

