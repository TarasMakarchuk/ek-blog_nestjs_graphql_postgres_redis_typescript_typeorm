import {MigrationInterface, QueryRunner} from "typeorm";

export class addConfirmedColumnInUsersTable1649231689594 implements MigrationInterface {
    name = 'addConfirmedColumnInUsersTable1649231689594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "confirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "confirmed"`);
    }

}
