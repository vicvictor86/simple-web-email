import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUserMessagesTable1678122030095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns(
            'user_messages',
            [
                new TableColumn(
                    {
                        name: 'sender_delete',
                        type: 'boolean',
                        default: false,
                    }
                ),
                new TableColumn(
                    {
                        name: 'addressee_delete',
                        type: 'boolean',
                        default: false,
                    }
                )
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('user_messages', 'sender_delete');
        await queryRunner.dropColumn('user_messages', 'addressee_delete');
    }

}
