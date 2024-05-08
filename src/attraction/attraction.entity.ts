import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
} from "typeorm";
import { ContentEntity } from "src/content/content.entity";
import { DirectionEntity } from "src/direction/direction.entity";

@Entity()

export class AttractionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    bgImg: string;

    @Column('double')
    latitude: number;

    @Column('double')
    longitude: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

    @OneToMany(
        () => ContentEntity,
        (content) => content.attraction,
    )
    contents: ContentEntity[]

    @ManyToOne(
        () => DirectionEntity,
        (direction) => direction.attractions,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    )

    direction: DirectionEntity;

}