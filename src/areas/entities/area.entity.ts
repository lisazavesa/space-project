import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import type{ Polygon } from "geojson";

@Entity("areas")
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    name!: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description?: string;

    @Index({ spatial: true })
    @Column({
        type: "geometry",
        spatialFeatureType: "Polygon",
        srid: 4326,
    })
    geometry!: Polygon;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
