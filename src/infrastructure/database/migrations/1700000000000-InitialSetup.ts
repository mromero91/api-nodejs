import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1700000000000 implements MigrationInterface {
  name = 'InitialSetup1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    console.log('Database extensions enabled');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Extensions not dropped (may be used by other applications)');
  }
}
