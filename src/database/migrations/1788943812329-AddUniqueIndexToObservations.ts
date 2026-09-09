import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndexToObservations1788943812329 implements MigrationInterface {
    name = 'AddUniqueIndexToObservations1788943812329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4cd909763e92f3947b723ad861" ON "observations"  ("areaId", "externalId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4cd909763e92f3947b723ad861"`);
    }

}
