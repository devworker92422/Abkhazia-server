import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    BaseEntity
} from "typeorm";

@Entity()

export class MetaEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('longtext')
    text: string;

    @Column()
    img: string;
}
