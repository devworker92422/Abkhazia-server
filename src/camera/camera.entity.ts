import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()

export class CameraEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lid: number;

    @Column({ default: false })
    active: Boolean;
}