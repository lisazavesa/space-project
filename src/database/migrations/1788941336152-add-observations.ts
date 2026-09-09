import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObservations1788941336152 implements MigrationInterface {
    name = 'AddObservations1788941336152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "observations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "areaId" uuid NOT NULL, "observedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "cloudCover" double precision, "coveragePercentage" double precision, "score" double precision, "geometry" geometry(Polygon,4326) NOT NULL, "bbox" jsonb, "collection" character varying NOT NULL, "assets" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9208d64f50a76030758087c0ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74dcecbcfaeb4f63449f55a6c7" ON "observations" USING gist ("geometry") `);
        await queryRunner.query(`ALTER TABLE "observations" ADD CONSTRAINT "FK_98c65fc667191bcc96dd0f63e8f" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "observations" DROP CONSTRAINT "FK_98c65fc667191bcc96dd0f63e8f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74dcecbcfaeb4f63449f55a6c7"`);
        await queryRunner.query(`DROP TABLE "observations"`);
    }

}
