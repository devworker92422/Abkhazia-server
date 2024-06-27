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
import { ImageEntity } from "src/image/image.entity";

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

    @Column('text')
    heading: string;

    @Column({ default: false })
    active: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

    @OneToMany(
        () => ContentEntity,
        (content) => content.attraction,
        {
            cascade: true,
        }
    )
    contents: ContentEntity[]

    @OneToMany(
        () => ImageEntity,
        (image) => image.attraction
    )
    images: ImageEntity[];

    @ManyToOne(
        () => DirectionEntity,
        (direction) => direction.attractions,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    )

    direction: DirectionEntity;

}