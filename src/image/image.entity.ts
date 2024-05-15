import {
    Entity,
    Column,
    BaseEntity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { DirectionEntity } from "src/direction/direction.entity";
import { AttractionEntity } from "src/attraction/attraction.entity";
import { BlogEntity } from "src/blog/blog.entity";

@Entity()

export class ImageEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(
        () => DirectionEntity,
        (direction) => direction.images,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    direction: DirectionEntity

    @ManyToOne(
        () => AttractionEntity,
        (attraction) => attraction.images,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    attraction: AttractionEntity;

    @ManyToOne(
        () => BlogEntity,
        (blog) => blog.images,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    blog: BlogEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}