import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Area } from "../../areas/entities/area.entity";

@Index(['areaId', 'externalId'], { unique: true })
@Entity("observations")
export class Observation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    externalId!: string;

    @Column()
    areaId!: string;

    @ManyToOne(() => Area, (area) => area.observations, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "areaId" })
    area!: Area;

    @Column({ type: "timestamptz" })
    observedAt!: Date;

    @Column({ type: "double precision", nullable: true })
    cloudCover!: number | null;

    @Column({ type: "double precision", nullable: true })
    coveragePercentage!: number | null;

    @Column({ type: "double precision", nullable: true })
    score!: number | null;

    @Index({ spatial: true })
    @Column("geometry", {
        spatialFeatureType: "Polygon",
        srid: 4326,
    })
    geometry!: GeoJSON.Polygon;

    @Column({ type: "jsonb", nullable: true })
    bbox!: number[] | null;

    @Column()
    collection!: string;

    @Column({ type: "jsonb", nullable: true })
    assets!: Record<string, unknown> | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
