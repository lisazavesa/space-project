import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import type { Polygon } from "geojson";
import { Observation } from "../../earth-observation/entities/observation.entity";

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

    @OneToMany(() => Observation, (observation) => observation.area)
    observations!: Observation[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
