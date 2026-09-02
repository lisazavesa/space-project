import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1788361988742 implements MigrationInterface {
    name = 'Init1788361988742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "geometry" geometry(Polygon,4326) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5110493f6342f34c978c084d0d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dd8216a8eea25f7e439a1f0239" ON "areas" USING gist ("geometry") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_dd8216a8eea25f7e439a1f0239"`);
        await queryRunner.query(`DROP TABLE "areas"`);
    }

}
