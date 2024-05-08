import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { DirectionEntity } from "src/direction/direction.entity";
import { AttractionEntity } from "src/attraction/attraction.entity";
import { BlogEntity } from "src/blog/blog.entity";

@Entity()

export class ContentEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @Column('longtext')
    content: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

    @ManyToOne(
        () => DirectionEntity,
        (direction) => direction.contents,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    direction: DirectionEntity;


    @ManyToOne(
        () => AttractionEntity,
        (attraction) => attraction.contents,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    attraction: AttractionEntity;

    @ManyToOne(
        () => BlogEntity,
        (blog) => blog.contents,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    blog: BlogEntity;

}