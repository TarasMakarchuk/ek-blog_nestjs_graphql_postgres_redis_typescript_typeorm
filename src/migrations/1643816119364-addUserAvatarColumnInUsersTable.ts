import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserAvatarColumnInUserTable1643816119364 implements MigrationInterface {
    name = 'addUserAvatarColumnInUserTable1643816119364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "userAvatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userAvatar"`);
    }

}
