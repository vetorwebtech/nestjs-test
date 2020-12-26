import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Box {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    color: string;

    constructor() {
    }
}
