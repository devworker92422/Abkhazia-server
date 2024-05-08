import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { DirectionEntity } from "src/direction/direction.entity";

@Entity()

export class WeatherEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    date: string;

    @Column('double')
    comfortTemp: number;

    @Column('double')
    airTemp: number;

    @Column('double')
    waterTemp: number;

    @Column()
    icon: string;

    @ManyToOne(
        () => DirectionEntity,
        (direction) => direction.weathers,
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    direction: DirectionEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updateAt: Date;
}