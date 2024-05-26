import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("game")
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    title: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("simple-array", { nullable: true })
    screenshots: string[];

    @Column("simple-array", { nullable: true })
    torrents: string[];
}
