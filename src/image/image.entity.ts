import { Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class ImageEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}