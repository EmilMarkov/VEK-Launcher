import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class GameMigration1716747583764 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "game",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: "title",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "screenshots",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "torrents",
                    type: "text",
                    isNullable: true
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("game");
    }
}
